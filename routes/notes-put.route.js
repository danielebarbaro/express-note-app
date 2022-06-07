import express from 'express';
import { param, body, validationResult } from 'express-validator';

// Notes
import * as core from '../core-notes.js';

import authMiddleware from '../middlewares/auth.middleware.js';



const notesPutRoute = express.Router();



notesPutRoute.put( '/:uuid', authMiddleware );

// Parse JSON handling errors
notesPutRoute.put(
    '/:uuid',
    express.json(),
    function(err, request, reply, next) {
        if (err instanceof SyntaxError && err.status === 400) {
            reply.status(400).json({ errors: [{ msg: 'Bad JSON' }] });
        }
    }
);



notesPutRoute.put(
    '/:uuid',
    
    // Validation middleware
    param('uuid').isUUID().bail(),
    body('title').exists({ checkNull: true, checkFalsy: true }).bail().trim().isLength({ min:1, max: 50 }),
    body('body').exists({ checkNull: true, checkFalsy: true }).bail().isLength({ min:0, max: 500 }),
    
    function (request, reply) {
        
        // Check validation results
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
           return reply.status(400).json({ errors: errors.array() });
        }
        
        const uuid = request.params.uuid;
        
        const title = request.body.title;
        const body = request.body.body;

        //const updatedNote = request.app.locals.noteboard.updateNote(uuid, title, body);
        const updatedNote = core.updateNote(request.app.locals.noteboard, uuid, title, body);
        
        if (updatedNote === undefined) {
            
            reply.sendStatus(404);
            
        } else {
            
            reply.status(200).json({
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
