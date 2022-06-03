const notFoundMiddleweare = (request,response) => {
    response
            .status(500)
            .json({
                "success": false,
                "code": 1001,
                "error": "Resource not found"
            });

    }
export default notFoundMiddleweare