const logMiddleware = (request, response, next) => {
    const {method, url} = request;
    const time = new Date().getTime();
    console.log(`${method}: ${url} [${time}]`)
    next();
}
export default logMiddleware