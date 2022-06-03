import express from 'express';

import Notebook from '../core-notes.js';

import authMiddleware from '../middlewares/auth.middleware.js';



const notesPutRoute = express.Router();



notesPutRoute.put( '/:uuid', authMiddleware );

notesPutRoute.put( '/:uuid', express.json() );



notesPutRoute.put(
    '/:uuid',
    function (request, reply) {
        
        const uuid = request.params.uuid;
        
        const title = request.body.title;
        const body = request.body.body;

        const updatedNote = request.app.locals.noteboard.updateNote(uuid, title, body);
        
        if (updatedNote === undefined) {
            
            reply.sendStatus(404);
            
        } else {
            
            reply.status(201).json({
                success: true,
                single: true,
                data: [
                    updatedNote
                ]
            }); 
            
        }
    
    }
);



export default notesPutRoute;
