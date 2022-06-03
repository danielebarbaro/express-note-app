const authMiddleware = (request, response, next) => {
    console.log("Auth Middleware: Controllare chiave dentro headr");
    const {headers} =request;
    if(headers['secret']===process.env.API_KEY){
        next();
    }
    else if(headers['secret']===null){
        response
            .status(401)
            .json({
                "success": false,
                "code": 2001,
                "error": "Unauthorized"
            });
    }
    else{
        response
            .status(403)
            .json({
                "success": false,
                "code": 2002,
                "error": "Forbidden"
            });
    }
}
export default authMiddleware