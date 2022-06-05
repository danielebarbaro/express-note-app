const authMiddleware = (request, response, next) => {

    const {headers} = request;
    console.log('Auth Middleware: controllo chiave nell header');
    
    if(headers['secret'] === process.env.API_KEY)
    {
        next();
    }
    else if(headers['secret']!== process.env.API_KEY && headers['secret'])
    {
        res
        .status(403)
        .json({
            "success": false,
            "code": 2002,
            "error": "Forbidden"})
    }
    else if (headers['secret'] === '')
    {
        res
        .status(401)
        .json({
            "success": false,
            "code": 2001,
            "error": "Unauthorized"})
    }
    
    

    
    
    
}
export default authMiddleware
