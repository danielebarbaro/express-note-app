const authMiddleware = (request, response, next) => {

     const {headers }= request;
 
     if(headers['secret'===process.env.API_KEY]){
             next();
 
     }else{
         response
         .status(401)
         .json({
             status:'fail',
             code: 403,
             error: 'Unautorized'
         });
     }
 
 
 }
 export default authMiddleware 