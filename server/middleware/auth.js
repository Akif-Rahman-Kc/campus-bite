import pkg from 'jsonwebtoken';
const { verify } = pkg;

///////////////////////////////////////////////// STUDENT /////////////////////////////////////////////////

export async function studentJWT(req, res, next) {
    const token = req.headers['studenttoken'];
    if (!token) {
        res.json({auth:false, status:"failed", message:"Please logout and try"})
    } else {
        verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
            if (err) {
                console.log(err);
                res.json({auth:false, status:"failed", message:"Please logout and try"})
            } else {
                req.studentId =decoded.studentId
                next();
            }
        })
    }
}

///////////////////////////////////////////////// CANTEEN /////////////////////////////////////////////////

export async function canteenJWT(req, res, next) {
    const token = req.headers['canteentoken'];
    if (!token) {
        res.json({auth:false, status:"failed", message:"Please logout and try"})
    } else {
        verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
            if (err) {
                console.log(err);
                res.json({auth:false, status:"failed", message:"Please logout and try"})
            } else {
                req.canteenId =decoded.canteenId
                next();
            }
        })
    }
}

///////////////////////////////////////////////// COLLEGE /////////////////////////////////////////////////

export async function collegeJWT(req, res, next) {
    const token = req.headers['collegetoken'];
    if (!token) {
        res.json({auth:false, status:"failed", message:"Please logout and try"})
    } else {
        verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
            if (err) {
                console.log(err);
                res.json({auth:false, status:"failed", message:"Please logout and try"})
            } else {
                req.collegeId =decoded.collegeId
                next();
            }
        })
    }
}