import 'dotenv/config';
import express from 'express';

import * as core from './core-notes.js';

import logMiddleware from './middlewares/log.middleware.js';
import authMiddleware from './middlewares/auth.middleware.js';



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

const noteboard = new core.NoteBoard('./database/githubnotes.json');



// Declare routes
server.get(
    '/api/notes',
    logMiddleware,
    function (request, reply) {
        const notes = noteboard.listNotes();
        
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
        const note = noteboard.getNote(request.params.uuid);
        
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

server.post(
    '/api/notes',
    [ logMiddleware, authMiddleware ],
    function (request, reply) {
        const input = request.body.json();
        
        const newNoteUuid = notebook.addNote(input.user, input.date, input.title, input.body);
        
        if (newNoteUuid === undefined) {
            reply.sendStatus(304);
        } else {
            const note = noteboard.getNote(newNoteUuid);
            reply.status(201).json({
                success: true,
                single: true,
                data: [
                    note
                ]
            });
        }
    }
);

server.all('*', function (request, reply) {
    reply.status(500).json({
        success: false,
        code: 1001,
        message: 'Resource not found'
    });
});



// Run the server
console.log(`Server now listening on port ${port}...`);

server.listen(port);
