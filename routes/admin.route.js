import express from 'express';
import { param, validationResult } from 'express-validator';

import Noteboard from '../noteboard.js';

import authMiddleware from '../middlewares/auth.middleware.js';



const adminRoute = express.Router();



adminRoute.use( authMiddleware );



adminRoute.get(
    '/user-stats/:user',
    
    // Validation middleware
    param('user').exists({ checkNull: true, checkFalsy: true }).bail().trim().isLength({ min:1, max: 20 }),
    
    function (request, reply) {
        
        // Check validation results
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
           return reply.status(400).json({ errors: errors.array() });
        }
        
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
