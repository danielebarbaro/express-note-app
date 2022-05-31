const authMiddleware = (request, response, next) => {

    const {headers} = request;
    console.log('Auth Middleware: controllo chiave nell header');
    
    if(headers['secret'] === process.env.API_KEY)
    {
        next();
    }
    else
    {
        response
            .status(401)
            .json({
                status: 'fail',
                code: 403,
                error: 'Unauthorized'
            })
    }
    
    next();
}
export default authMiddleware
