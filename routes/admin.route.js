import express from 'express';

import Notebook from '../core-notes.js';

import authMiddleware from '../middlewares/auth.middleware.js';



const adminRoute = express.Router();



adminRoute.use( authMiddleware );



adminRoute.get(
    '/user-stats/:user',
    function (request, reply) {
        
        const user = request.params.user;

        const notes = request.app.locals.noteboard.getNotesByUser(user);

        if (notes.length === 0) {
        
            reply.sendStatus(404);
        
        } else {
        
            reply.status(201).json({
                success: true,
                data: [{
                    [user]: notes.map( note => ({ date: note.date, title: note.title, body: note.body }) )
                }]
            });
        
        }
        
    }
);



export default adminRoute;