import { useEffect, useState } from "react";
import NavbarComponent from "../components/Navbar";
import SidebarComponent from "../components/Sidebar";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Dropdown from "../components/Dropdown";
import { CanteenAuthApi, CanteenMenuCreate, CanteenMenuDelete, CanteenMenuList, CanteenMenuStatusUpdate, CanteenMenuUpdate } from "../apis/canteen";
import { CollegeAuthApi, CollegeMenuList } from "../apis/college";
import { useNavigate } from "react-router-dom";


const MenusPage = () => {
    // navigate
    const navigate = useNavigate()

    // get current admin ( canteen or college )
    const admin = localStorage.getItem("admin")
    
    // const all_menus = [
    //     {
    //         "image": "data:image/jpeg;base64,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",
    //         "name": "Menu 1",
    //         "status": "IN STOCK",
    //         "price": "10",
    //         "category": "Beverages",
    //         "rating": "4.8"
    //     },
    //     {
    //         "image": "data:image/jpeg;base64,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",
    //         "name": "Menu 2",
    //         "status": "IN STOCK",
    //         "price": "12",
    //         "category": "Snacks",
    //         "rating": "4.5"
    //     },
    //     {
    //         "image": "data:image/jpeg;base64,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",
    //         "name": "Menu 3",
    //         "status": "IN STOCK",
    //         "price": "15",
    //         "category": "Snacks",
    //         "rating": "4.3"
    //     },
    //     {
    //         "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR3tufV9v3QaDl5gfFql4JITgj-awlcUg9IHp-4JDnqJquXwFM0snUTd9kCAA&s",
    //         "name": "Menu 4",
    //         "status": "OUT STOCK",
    //         "price": "150",
    //         "category": "Main Course",
    //         "rating": "4.7"
    //     },
    //     {
    //         "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhaauaqFbZ4EGEi8_u6Q-M4_yglMJYtbfcQU9gJEIs1YUwfw5gwuVuDjIDoQ&s",
    //         "name": "Menu 5",
    //         "status": "IN STOCK",
    //         "price": "30",
    //         "category": "Breakfast",
    //         "rating": "3.5"
    //     },
    //     {
    //         "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCvEGnZAusA6szh03JPZ7zByl1LR5l2vUPBG30C57tupBy6JP0A2I9OMsCHA&s",
    //         "name": "Menu 6",
    //         "status": "OUT STOCK",
    //         "price": "100",
    //         "category": "Main Course",
    //         "rating": "4.9"
    //     },
    //     {
    //         "image": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSr3ODtK8HPnINXTY5-Aet7bQWg-VgZnY4MBd3oWC7QFzxUT-iSwBnD7BLiMw&s",
    //         "name": "Menu 7",
    //         "status": "IN STOCK",
    //         "price": "50",
    //         "category": "Beverages",
    //         "rating": "4.0"
    //     }
    // ]

    // states
    // states
    const [refresh, setRefresh] = useState(false)
    const [menuRefresh, setMenuRefresh] = useState(false)
    const [selectedValue, setSelectedValue] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [index, setIndex] = useState(0);
    const [formData, setFormData] = useState({
        image: "",
        name: "",
        price: "",
        category: ""
    })
    const [menus, setMenus] = useState([])
    const [allMenus, setAllMenus] = useState([])

    // use effect for login or not checking
    useEffect(() => {
        async function auth() {
            if (admin === "canteen") {
                const token = localStorage.getItem("canteentoken")
                if (token) {
                    const auth = await CanteenAuthApi(token)
                    if (!auth || auth.status === "failed" || !auth.auth) {
                        navigate("/login")
                    }
                }
            } else {
                const token = localStorage.getItem("collegetoken")
                if (token) {
                    const auth = await CollegeAuthApi(token)
                    if (!auth || auth.status === "failed" || !auth.auth) {
                        navigate("/login")
                    }
                }
            } 
        }
        auth()
    }, []);

    // use effect fetching menu list
    useEffect(() => {
        async function fetchData() {
            if (admin === "canteen") {
                const token = localStorage.getItem("canteentoken")
                const response = await CanteenMenuList(token)
                if (response && response.status === "success") {
                    setMenus(response.menus)
                    setAllMenus(response.menus)
                } else {
                    alert(response?.message)
                }
            } else {
                const token = localStorage.getItem("collegetoken")
                const response = await CollegeMenuList(token)
                if (response && response.status === "success") {
                    setMenus(response.menus)
                    setAllMenus(response.menus)
                } else {
                    alert(response?.message)
                }
            }
        }
        fetchData()
    }, [menuRefresh]);
    
    // use effect for refresh
    useEffect(() => {
        console.log("Refresh");
    }, [refresh]);

    // category filtering
    useEffect(() => {
        if (selectedValue) {
            const filterd_menus = allMenus.filter(menu => menu.category.toLowerCase() === selectedValue.toLowerCase());
            setMenus(filterd_menus)
            setRefresh(!refresh)
        } else {
            setMenus(allMenus)
        }
    }, [selectedValue]);

    // status change
    const changeStatus = async (index, status) => {
        if (admin === "canteen") {
            const token = localStorage.getItem("canteentoken")
            if (token) {
                const response = await CanteenMenuStatusUpdate(token, { _id: menus[index]._id })
                if (response && response.status === "success") {
                    setMenuRefresh(!menuRefresh)
                } else {
                    alert(response?.message)
                }
            } else {
                alert("You cant change menu, Please login first")
            }
        } else {
            alert("You cannot change menu details, you dont have access")   
        }
    }

    // search
    const search = (value) => {
        if (value) {
            const lowercase_value = value.toLowerCase();
            const filterd_menus = allMenus.filter(menu => menu.name.toLowerCase().includes(lowercase_value));
            setMenus(filterd_menus)
            setRefresh(!refresh)
        } else {
            setMenus(allMenus)
        }
    }

    // add modal open
    const addModalOpen = () => {
        setIsAddModalOpen(true)
        setFormData({
            image: "",
            name: "",
            price: "",
            category: "",
        });
    }

    // add modal change
    const addModalChange = (e) => {
        const { name, type, value, files } = e.target;
        if (type === "file") {
            setFormData((prevData) => ({
                ...prevData,
                [name]: files && files[0] ? files[0] : null,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    // add modal submit
    const addModalSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        const form = new FormData();
        form.append("image", formData.image);
        form.append("name", formData.name);
        form.append("price", formData.price);
        form.append("category", formData.category);
        if (admin === "canteen") {
            const token = localStorage.getItem("canteentoken")
            if (token) {
                const response = await CanteenMenuCreate(token, form)
                if (response && response.status === "success") {
                    setMenuRefresh(!menuRefresh)
                    setIsAddModalOpen(false)
                } else {
                    alert(response?.message)
                }
            } else {
                alert("You cant add menu, Please login first")
            }
        } else {
            alert("You cannot add menu details, you dont have access")   
        }
    };

    // edit modal open
    const editModalOpen = (index) => {
        setIndex(index)
        setIsEditModalOpen(true)
        setFormData(menus[index]);
    }

    // edit modal change
    const editModalChange = (e) => {
        const { name, type, value, files } = e.target;
        if (type === "file") {
            setFormData((prevData) => ({
                ...prevData,
                [name]: files && files[0] ? files[0] : null,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    // edit modal submit
    const editModalSubmit = async (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        const form = new FormData();
        form.append("_id", formData._id);
        form.append("image", formData.image);
        form.append("name", formData.name);
        form.append("price", formData.price);
        form.append("category", formData.category);
        if (admin === "canteen") {
            const token = localStorage.getItem("canteentoken")
            if (token) {
                const response = await CanteenMenuUpdate(token, form)
                if (response && response.status === "success") {
                    setMenuRefresh(!menuRefresh)
                    setIsEditModalOpen(false)
                } else {
                    alert(response?.message)
                }
            } else {
                alert("You cant edit menu, Please login first")
            }
        } else {
            alert("You cannot edit menu details, you dont have access")   
        }
    };

    // delete modal open
    const deleteModalOpen = (index) => {
        setIndex(index)
        setIsDeleteModalOpen(true)
    }

    // delete modal confirm
    const deleteModalConfirm = async () => {
        if (admin === "canteen") {
            const token = localStorage.getItem("canteentoken")
            if (token) {
                const response = await CanteenMenuDelete(token, menus[index]._id)
                if (response && response.status === "success") {
                    setMenuRefresh(!menuRefresh)
                    setIsDeleteModalOpen(false)
                } else {
                    alert(response?.message)
                }
            } else {
                alert("You cant delete menu, Please login first")
            }
        } else {
            alert("You cannot delete menu details, you dont have access")   
        }
    };

    // return
    return (
        <>
            <NavbarComponent now={'menus'} />
            <SidebarComponent now={'menus'} />
            <div className="w-auto min-h-screen px-3 pt-16 md:ml-60 lg:ml-80 bg-gray-900">
                <div className="w-full min-h-screen bg-gray-700 rounded-lg px-5 py-5  mt-3">
                    {/* Filters */}
                    <div className="mb-3 flex w-full items-center">
                        {/* Dropdown Start */}
                        <div className="w-1/3 flex">
                            <Dropdown key_name={"category"} items={["Beverages", "Snacks", "Breakfast", "Main Course"]} selectedValue={selectedValue} setSelectedValue={setSelectedValue} />
                        </div>
                        {/* Dropdown End */}
                        {/* Add Menu Start */}
                        <div className="w-1/3 flex justify-center">
                            {
                                admin === "canteen" &&
                                <button onClick={addModalOpen} className="border-2 border-green-500 text-green-500 hover:text-white py-1 px-6 text-xxs font-bold uppercase rounded hover:bg-green-500">
                                    Add Menu
                                </button>
                            }
                        </div>
                        {/* Add Menu End */}
                        {/* Search Bar Start */}
                        <div className="w-1/3 flex justify-end">
                            <input
                                type="text"
                                id="search"
                                placeholder="Search..."
                                className="flex px-4 w-10/12 lg:w-6/12 py-1 bg-gray-900 border border-gray-300 rounded-full text-white text-xs lg:text-sm"
                                // value={search}
                                onChange={(e) => search(e.target.value)}
                            />
                        </div>
                        {/* Search Bar End */}
                    </div>
                    {/* Table */}
                    <div className="w-full bg-gray-900 overflow-x-auto rounded-xl">
                        <table className="w-full table-auto border-collapse border border-gray-400">
                            <thead>
                                <tr>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Image
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Name
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Price
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Category
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Rating
                                    </th>
                                    <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                        Status
                                    </th>
                                    {
                                        admin === "canteen" &&
                                        <th className="text-md border border-gray-500 px-4 py-2 bg-yellow-500 capitalize">
                                            Options
                                        </th>
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {menus.map((item, index) => (
                                    <tr key={index}>
                                        <td className="border text-white text-sm border-gray-500 px-4 py-2">
                                            <img src={item.image.path} alt="Example" className="rounded-md shadow-lg h-9" />
                                        </td>
                                        <td className="border text-white text-sm border-gray-500 px-4 py-2">
                                            {item.name}
                                        </td>
                                        <td className="border text-white text-sm border-gray-500 px-4 py-2">
                                            ₹{item.price}
                                        </td>
                                        <td className="border text-white text-sm border-gray-500 px-4 py-2">
                                            {item.category}
                                        </td>
                                        <td className="border text-white text-sm border-gray-500 px-4 py-2">
                                            ⭐️ {item.rating}
                                        </td>
                                        {
                                            admin === "canteen" ?
                                            <td className="border text-white text-xs border-gray-500 px-4 py-2">
                                                <div className="w-full flex justify-center">
                                                    <div onClick={() => changeStatus(index, item.status === "IN STOCK" ? "OUT STOCK" : "IN STOCK")} className="w-20 bg-gray-600 rounded-full shadow-md shadow-inner">
                                                        {
                                                            item.status === "IN STOCK" ?
                                                                <div className="flex w-14 py-1 bg-green-700 rounded-full text-white font-bold ml-auto justify-center status-box cursor-pointer">
                                                                    {item.status}
                                                                </div>
                                                                :
                                                                <div className="flex w-14 py-1 bg-red-600 rounded-full text-white font-bold justify-center status-box cursor-pointer">
                                                                    {item.status}
                                                                </div>
                                                        }
                                                    </div>
                                                </div>
                                            </td>
                                            :
                                            <td className={`border text-sm text-center text-md border-gray-500 px-4 py-2 font-semibold ${item.status === "IN STOCK" ? "text-green-400" : "text-red-400"}`}>
                                                {item.status}
                                            </td>
                                        }
                                        {
                                            admin === "canteen" &&
                                            <td className="border text-xs border-gray-300 w-1/12 px-4 py-2">
                                                <div className="w-full flex justify-center">
                                                    <FontAwesomeIcon className="mt-1 mr-2 cursor-pointer" onClick={() => editModalOpen(index)} icon={faEdit} color="#6961ff" size="md" />
                                                    <FontAwesomeIcon className="mt-1 ml-2 cursor-pointer" onClick={() => deleteModalOpen(index)} icon={faTrash} color="#f54242" size="md" />
                                                </div>
                                            </td>
                                        }
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Table */}
                    {/* Add Modal Start */}
                    {isAddModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                            <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-96 relative">
                                {/* close button */}
                                <button
                                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"
                                    onClick={() => setIsAddModalOpen(false)}
                                >
                                    &times;
                                </button>

                                {/* modal content */}
                                <h2 className="text-xl text-white text-center font-bold mb-4">Add Menu</h2>
                                {/* form */}
                                <form onSubmit={addModalSubmit}>
                                    {/* image field */}
                                    <div className="mb-4">
                                        <label htmlFor="image" className="block text-sm font-medium text-gray-300">
                                            Image
                                            <span className="text-red-500">*</span>
                                        </label>
                                        {formData?.image && (
                                            <img
                                                src={URL.createObjectURL(formData.image)}
                                                alt="Selected"
                                                className="mt-1 w-full object-cover rounded-md mb-3"
                                            />
                                        )}
                                        <input
                                            type="file"
                                            id="image"
                                            name="image"
                                            className="hidden"
                                            onChange={addModalChange}
                                        />
                                        <label
                                            htmlFor="image"
                                            className="shadow appearance-none bg-gray-600 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5 cursor-pointer hover:bg-gray-500 mb-3 text-center block"
                                        >
                                            Choose Image
                                        </label>
                                    </div>
                                    {/* name field */}
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                            Name
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Enter name"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={formData.name}
                                            onChange={addModalChange}
                                            required
                                        />
                                    </div>
                                    {/* price field */}
                                    <div className="mb-4">
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-300">
                                            Price
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="price"
                                            name="price"
                                            placeholder="Enter price"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={formData.price}
                                            onChange={addModalChange}
                                            required
                                        />
                                    </div>
                                    {/* category field */}
                                    <div className="mb-4">
                                        <label htmlFor="Category" className="block text-sm font-medium text-gray-300">
                                            Category
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <select required className="w-full text-gray-300 text-sm bg-gray-900 capitalize px-2 py-1.5 rounded-md border border-gray-500" name={"category"} id={"category"} value={formData.category} onChange={addModalChange}>
                                            <option value="">Select category</option>
                                            {["Beverages", "Snacks", "Main Course", "Breakfast"].map((item) => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* submit button */}
                                    <div className="flex justify-center mt-4">
                                        <button
                                            type="submit"
                                            className="mt-4 border-2 border-blue-500 text-blue-500 hover:text-white px-4 py-2 text-xxs rounded font-bold uppercase hover:bg-blue-500"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    {/* Add Modal End */}
                    {/* Edit Modal Start */}
                    {isEditModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                            <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-96 relative">
                                {/* close button */}
                                <button
                                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    &times;
                                </button>

                                {/* modal content */}
                                <h2 className="text-xl text-white text-center font-bold mb-4">Edit Menu</h2>
                                {/* form */}
                                <form onSubmit={editModalSubmit}>
                                    {/* image field */}
                                    <div className="mb-4">
                                        <label htmlFor="image" className="block text-sm font-medium text-gray-300">
                                            Image
                                            <span className="text-red-500">*</span>
                                        </label>
                                        {console.log(formData)
                                        }
                                        {formData?.image ? (
                                            <img
                                                src={formData.image.path ? formData.image.path : URL.createObjectURL(formData.image)}
                                                alt="Selected"
                                                className="mt-1 w-full object-cover rounded-md mb-3"
                                            />
                                        ) : (
                                            <p className="text-gray-500 text-sm">No image selected</p>
                                        )}
                                        <input
                                            type="file"
                                            id="image"
                                            name="image"
                                            className="hidden"
                                            onChange={editModalChange}
                                        />
                                        <label
                                            htmlFor="image"
                                            className="shadow appearance-none bg-gray-600 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5 cursor-pointer hover:bg-gray-500 mb-3 text-center block"
                                        >
                                            Change Image
                                        </label>
                                    </div>
                                    {/* name field */}
                                    <div className="mb-4">
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                                            Name
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="Enter name"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={formData.name}
                                            onChange={editModalChange}
                                            required
                                        />
                                    </div>
                                    {/* price no field */}
                                    <div className="mb-4">
                                        <label htmlFor="price" className="block text-sm font-medium text-gray-300">
                                            Price
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="price"
                                            name="price"
                                            placeholder="Enter price"
                                            className="shadow appearance-none bg-gray-900 text-sm border border-gray-500 rounded-md w-full py-1.5 px-3 text-gray-300 leading-tight focus:outline-none focus:shadow-outline mt-0.5"
                                            value={formData.price}
                                            onChange={editModalChange}
                                            required
                                        />
                                    </div>
                                    {/* category field */}
                                    <div className="mb-4">
                                        <label htmlFor="Category" className="block text-sm font-medium text-gray-300">
                                            Category
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <select required className="w-full text-gray-300 text-sm bg-gray-900 capitalize px-2 py-1.5 rounded-md border border-gray-500" name={"category"} id={"category"} value={formData.category} onChange={editModalChange}>
                                            {["Beverages", "Snacks", "Main Course", "Breakfast"].map((item) => (
                                                <option key={item} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* submit button */}
                                    <div className="flex justify-center mt-4">
                                        <button
                                            type="submit"
                                            className="mt-4 border-2 border-blue-500 text-blue-500 hover:text-white px-4 py-2 text-xxs rounded font-bold uppercase hover:bg-blue-500"
                                        >
                                            Submit
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                    {/* Edit Modal End */}
                    {/* Delete Modal Start */}
                    {isDeleteModalOpen && (
                        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-gray-700 p-6 rounded shadow-lg w-96 relative">
                                {/* close button */}
                                <button
                                    className="absolute top-4 right-4 text-gray-300 hover:text-gray-500"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                >
                                    &times;
                                </button>
                                {/* model content */}
                                <h2 className="text-lg text-white font-bold mb-2">Are you sure?</h2>
                                <p className="mb-7 text-sm text-gray-300">Do you want to delete this menu data?</p>
                                {/* yes or no button */}
                                <div className="flex justify-center space-x-4">
                                    <button
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="border-2 border-red-500 text-red-500 hover:text-white py-2 px-4 text-xxs font-bold uppercase rounded hover:bg-red-500"
                                    >
                                        No
                                    </button>
                                    <button
                                        onClick={deleteModalConfirm}
                                        className="border-2 border-green-500 text-green-500 hover:text-white py-2 px-4 text-xxs font-bold uppercase rounded hover:bg-green-500"
                                    >
                                        Yes
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Delete Modal End */}
                </div>
            </div>
        </>
    );
}

export default MenusPage;