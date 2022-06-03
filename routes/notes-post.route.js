import express from 'express';

import Noteboard from '../noteboard.js';

import authMiddleware from '../middlewares/auth.middleware.js';



const notesPostRoute = express.Router();



notesPostRoute.post( '/', authMiddleware );

notesPostRoute.post( '/', express.json() );



notesPostRoute.post(
    '/',
    function (request, reply) {

        const user = request.body.user;
        const date = request.body.date;
        const title = request.body.title;
        const body = request.body.body;

        const newNote = request.app.locals.noteboard.addNote(user, date, title, body);

        if (newNote === undefined) {
            
            reply.sendStatus(500);
            
        } else {
            
            reply.status(201).json({
                success: true,
                single: true,
                data: [
                    newNote
                ]
            });
            
        }

    }

);



export default notesPostRoute;
