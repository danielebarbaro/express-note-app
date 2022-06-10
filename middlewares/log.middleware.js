
const logMiddleware = function (request, reply, next) {
    
    const {method, url} = request;
    const time = new Date().getTime();

    console.log(`${method}: ${url} [${time}]`)

    next();
    
}

export default logMiddleware;
