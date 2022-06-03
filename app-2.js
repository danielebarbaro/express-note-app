import 'dotenv/config';
import express from 'express';

import Noteboard from './core-notes.js';

import logMiddleware from './middlewares/log.middleware.js';
import authMiddleware from './middlewares/auth.middleware.js';

import notesGetRoute from './routes/notes-get.route.js';
import notesPostRoute from './routes/notes-post.route.js';
import notesPutRoute from './routes/notes-put.route.js';
import adminRoute from './routes/admin.route.js';



// Constants
const defaultPort = 8080;



// Local functions and methods
const isValidPort = function (portNumber) {
    if ( portNumber >>> 0 === parseFloat(portNumber) ) {
        if ( portNumber > 0 && portNumber < 65536 )
           return true;
    }
    return false;
}



// Parse environment variables (or .env file)
const parsePort = function () {
    if (isValidPort(process.env.PORT)) {
        return process.env.PORT;
    } else {
        console.warn(`WARNING! Invalid port number in environment variable. Falling back to default ${defaultPort}.`);
        return defaultPort;
    }
}

const port = parsePort();



// Setup
const server = express();

//const noteboard = new Noteboard('./database/githubnotes.json');
server.locals.noteboard = new Noteboard('./database/githubnotes.json'); //this way the "noteboard" should be accessible in all components of the app



server.use( logMiddleware );

// Declare routes
/*
server.get(
    '/api/notes',
    logMiddleware,
    function (request, reply) {
        const notes = server.locals.noteboard.listNotes();
        
        reply.status(200).json({
            success: true,
            list: true,
            data: notes
        });
    }
);

server.get(
    '/api/notes/:uuid',
    logMiddleware,
    function (request, reply) {
        const note = server.locals.noteboard.getNote(request.params.uuid);
        
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
*/

server.use('/api/notes', notesGetRoute);

/*
server.post(
    '/api/notes',
    [ logMiddleware, authMiddleware ],
    function (request, reply) {
        const input = request.body;
        
        const newNote = server.locals.noteboard.addNote(input.user, input.date, input.title, input.body);
        
        if (newNote === undefined) {
            reply.sendStatus(400);
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
*/

server.use('/api/notes', notesPostRoute);

/*
server.put(
    '/api/notes/:uuid',
    [ logMiddleware, authMiddleware ],
    function (request, reply) {
        const uuid = request.params.uuid;
        const input = request.body;

        const updatedNote = server.locals.noteboard.updateNote(uuid, input.title, input.body);

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
*/

server.use('/api/notes', notesPutRoute);

/*
server.get(
    '/api/admin/user-stats/:user',
    [ logMiddleware, authMiddleware ],
    function (request, reply) {
        const user = request.params.user;

        const notes = server.locals.noteboard.getNotesByUser(user);

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
*/

server.use('/api/admin', adminRoute);

server.use(
    '/',
    function (request, reply) {
        reply.status(500).json({
            success: false,
            code: 1001,
            message: 'Resource not found'
        });
    }
);



// Run the server
console.log(`Server now listening on port ${port}...`);

server.listen(port);
