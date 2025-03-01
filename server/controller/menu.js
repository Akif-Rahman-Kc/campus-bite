import Menu from "../model/menu-schema.js";
import {v2 as cloudinary} from 'cloudinary';

//////////////////////////////////////////////////////  MENU  //////////////////////////////////////////////////////

export async function menuCreate(req, res) {
    try {
        const { name, price, category } = req.body;
        if (name != "" && price != "" && category != "") {
            if (req.file) {
                if (req.file.size < 10485760) {
                    const sss = cloudinary.config({
                        cloud_name: process.env.CLOUD_NAME,
                        api_key: process.env.CLOUD_KEY,
                        api_secret: process.env.CLOUD_SECRET,
                    });
                    const result = await cloudinary.uploader.upload(req.file.path);
                    const image = {
                        public_id: result.public_id,
                        path: result.secure_url,
                    };
                    await Menu.create({image, name, price, category});
                    res.json({ status: "success" });
                } else {
                    res.json({
                        status: "failed",
                        message: "Image size is too heavy Pls select another Image",
                    });
                }
            } else {
                res.json({ status: "failed", message: "Please select a image" });
            }
        } else {
            res.json({
                status: "failed",
                message: "Please enter full details of menu",
            });
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" });
    }
}

export async function menuDetails(req, res) {
    try {
        const menu = await Menu.findById(req.query._id)
        res.json({ status: "success", menu })
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function menuList(req, res) {
    try {
        const menus = await Menu.find().sort({ created_at: -1 })
        res.json({ status: "success", menus })
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function menuUpdate(req, res) {
    try {
        const menu = await Menu.findById(req.body._id)
        if (menu) {
            let image = null
            if (req.file) {
                if (req.file.size < 10485760) {
                    cloudinary.config({
                        cloud_name: process.env.CLOUD_NAME,
                        api_key: process.env.CLOUD_KEY,
                        api_secret: process.env.CLOUD_SECRET
                    });
                    const result = await cloudinary.uploader.upload(req.file.path)
                    await cloudinary.api.delete_resources([menu.image.public_id], { type: 'upload', resource_type: 'image' })
                    image = {
                        public_id:result.public_id,
                        path:result.secure_url
                    }
                } else {
                    res.json({status:"failed", message:"FIle size is too heavy Pls select another File"})
                }
            }
            await Menu.updateOne({_id:req.body._id}, {
                $set:{
                    name: req.body.name ? req.body.name : menu.name,
                    price: req.body.price ? req.body.price : menu.price,
                    category: req.body.category ? req.body.category : menu.category,
                    image: image ? image : menu.image,
                }
            })
            res.json({ status: "success" })
        } else {
            res.json({ status: "failed", message: "This menu not exist" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function menuStatusUpdate(req, res) {
    try {
        const menu = await Menu.findById(req.body._id)
        if (menu) {
            await Menu.updateOne({ _id: req.body._id }, {
                $set: {
                    status: menu.status === "IN STOCK" ? "OUT STOCK" : "IN STOCK"
                }
            })
            res.json({ status: "success" })
        } else {
            res.json({ status: "failed", message: "This menu not exist" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}

export async function menuDelete(req, res) {
    try {
        const menu = await Menu.findById(req.query._id)
        if (menu) {
            cloudinary.config({
                cloud_name: process.env.CLOUD_NAME, 
                api_key: process.env.CLOUD_KEY, 
                api_secret: process.env.CLOUD_SECRET
            });
            const result = await cloudinary.api.delete_resources([menu.image.public_id], { type: 'upload', resource_type: 'image' })
            const deleted = Object.keys(result.deleted)[0]
            if (result.deleted[deleted] == 'deleted') {
                await Menu.deleteOne({ _id: req.query._id })
                res.json({ status: "success" })
            }else{
                res.json({status:"failed", message:"File not deleted"})
            }
        } else {
            res.json({ status: "failed", message: "This menu not exist" })
        }
    } catch (error) {
        res.json({ status: "failed", message: "Code error" })
    }
}