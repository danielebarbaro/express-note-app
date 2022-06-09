import express from 'express';
import { body, validationResult } from 'express-validator';

// Notes
import * as core from '../core-notes.js';

import authMiddleware from '../middlewares/auth.middleware.js';



const notesPostRoute = express.Router();



notesPostRoute.post( '/', authMiddleware );

// Parse JSON handling errors
notesPostRoute.post(
    '/',
    express.json(),
    function(err, request, reply, next) {
        if (err instanceof SyntaxError && err.status === 400) {
            reply.status(400).json({ errors: [{ msg: 'Bad JSON' }] });
        }
    }
);



notesPostRoute.post(
    '/',
    
    // Validation middleware
    body('user').exists({ checkNull: true, checkFalsy: true }).bail().trim().isLength({ min:1, max: 20 }),
    body('date').isDate().bail().trim(),
    body('title').exists({ checkNull: true, checkFalsy: true }).bail().trim().isLength({ min:1, max: 50 }),
    body('body').exists({ checkNull: true, checkFalsy: true }).bail().isLength({ min:0, max: 500 }),
    
    function (request, reply) {
        
        // Check validation results
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
           return reply.status(400).json({ errors: errors.array() });
        }

        const user = request.body.user;
        const date = request.body.date;
        const title = request.body.title;
        const body = request.body.body;

        //const newNote = request.app.locals.noteboard.addNote(user, date, title, body);
        const newNote = core.addNote(request.app.locals.noteboard, user, date, title, body);

        if (newNote === undefined) {
            
            reply.sendStatus(500);
            
        } else {
            
            /*
            reply.status(201).json({
                success: true,
                single: true,
                data: [
                    newNote
                ]
            });
            */
            
            reply.status(201).json(newNote);
            
        }
        
    }

);



export default notesPostRoute;
