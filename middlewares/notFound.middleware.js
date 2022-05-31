const notFoundMiddleware = (req,res,next) =>{
    res.status(500)
    .json({
        "success": false,
        "code": 1001,
        "error": "Resource not found"
    });
}

export default notFoundMiddleware;