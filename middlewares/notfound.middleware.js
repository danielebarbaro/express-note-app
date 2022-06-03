const notFoundMiddleware = (req, res) => {
    res
        .status(500)
        .json({
            "success": false,
            "code": 1001,
            "error": "Resource not found"
        })
}
export default notFoundMiddleware