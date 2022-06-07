const auth = (req, res, next) => {
    
    const {headers} = req;
    if (headers['secret'] && headers['secret'] === process.env.API_KEY) {
        next();
    }else if(headers['secret'] && headers['secret'] !== process.env.API_KEY){
        res
        .status(403)
        .json({
            success: false,
            code: 2002,
            error: 'Forbidden'
        });
    }else{
        res
        .status(401)
        .json({
            success: false,
            code: 2001,
            error: 'Unauthorized'
        });
    }

}

export default auth;
