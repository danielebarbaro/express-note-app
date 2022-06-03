const logMiddleware = (request, response, next) => 
{ 
    const {method, url} = request; // dalla ricihesta prendo il metodo e l'url e lo stampo in console

    //const method = request.method; stesso modo di scrivere della riga 3, ma diviso su 2 righe
    //const method = request.url;
    const time = new Date().getTime(); 

    console.log(`${method}: ${url} [${time}]`) // stampa del metodo, dell'url e della data della richiesta
    next(); 
}
export default logMiddleware