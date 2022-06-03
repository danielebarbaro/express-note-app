const authMiddleware = (request, response, next) => 
{
    console.log("Auth Middleware. Controlla se l'header ha la chiave corretta"); // serve a controllare se nell'header c'è la chiave di autenticazione corretta
    const { headers } = request;

    if (headers['secret'] && headers['secret'] === process.env.API_KEY) 
    { //controlla che la password e la chiave API siano corrette. Se lo sono va avanti. 
        next();
    } 
    else if (headers['secret'] && headers['secret'] !== process.env.API_KEY) // Parola corretta ma non la chiave API
    {
        response.status(403)
            .json
            ({
                "success": false,
                "code": 2002,
                "error": "Forbidden"
            })
    }
    else 
    {
        response.status(401) // non sono state ricevute nè la password nè la chiave API
            .json
            ({
                "success": false,
                "code": 2001,
                "message": "Unauthorized",
            })
    }
}
export default authMiddleware