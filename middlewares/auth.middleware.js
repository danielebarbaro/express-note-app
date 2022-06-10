const apiKey = process.env.API_KEY;

const authMiddleware = function (request, reply, next) {

    const {headers} = request;

    if (headers['secret'] === apiKey) {
        next();
    } else if (headers['secret'] === undefined) {
        reply.status(401).json({
            success: false,
            code: 2001,
            error: 'Unauthorized'
        });
    } else {
        reply.status(403).json({
            success: false,
            code: 2002,
            error: 'Forbidden'
        });
    }
    
}

export default authMiddleware;
