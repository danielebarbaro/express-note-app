import { response } from "express";

const authMiddleware = (request, response, next) => {
console.log("Auth Middelware: Deve controllare se dentro lheader esiste la chiave corretta" );
    const {headers} = request;
    
    if (headers['secret']=== process.env.API_KEY){
    next();
    }else{
        response
        .status(401)
        .json({
            status: 'fall',
            code: 403,
            error: 'Unauthorized'
        });

    }
   
}
export default authMiddleware