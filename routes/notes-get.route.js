import express from 'express';

import Noteboard from '../noteboard.js';

import logMiddleware from '../middlewares/log.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';



const notesGetRoute = express.Router();



notesGetRoute.get(
    '/',
    function (request, reply, next) {
        
        if (request.query.date || request.query.limit) {
            authMiddleware(request, reply, next);
        } else {
            next();
        }

    }
);



notesGetRoute.get(
    '/',
    function (request, reply) {
        
        const limit = request.query.limit || -1;
        const sortByDate = !!request.query.limit; //if limit is set order result by date

        const afterDate = request.query.date || undefined;
        
        const notes = request.app.locals.noteboard.listNotes(limit, sortByDate, afterDate);
        
        reply.status(200).json({
            success: true,
            list: true,
            data: notes
        });
    }
);



notesGetRoute.get(
    '/:uuid',
    function (request, reply) {
        const note = request.app.locals.noteboard.getNote(request.params.uuid);
        
        if (note === undefined) {
            reply.sendStatus(404);
        } else {
            reply.status(200).json({
                success: true,
                single: true,
                data: [
                    note
                ]
            });
        }
    }
);



export default notesGetRoute;
