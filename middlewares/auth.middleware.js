const authMiddleware = (request, response, next) => {


    console.log("Auth Middleware: deve controllare se dentro header");
    const {headers} = request;


    if(headers ['secret'] === process.env.API_KEY){
        
        next();
    }else {
        response
        .status (401)
        .json({
            "success": false,
            "code": 2001,
            "error": "Unauthorized"
        });
    }

}
export default authMiddleware