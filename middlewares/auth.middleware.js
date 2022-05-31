const authMiddleware = (req,res,next) =>{
    //console.log("Auth Middleware: Deve controllare dentro l'header che esista la chiave coretta")
    const {headers} = req;
    if(headers['secret'] === process.env.API_KEY){
        next();
    }else if(headers['secret']!== process.env.API_KEY && headers['secret']){
        res.status(403)
        .json({
            "success": false,
            "code": 2002,
            "error": "Forbidden"
        })
    }else{
        res.status(401)
        .json({
            "success": false,
            "code": 2001,
            "error": "Unauthorized"
        })
    }
}

export default authMiddleware;