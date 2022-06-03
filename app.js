// IMPORTS

// Packages
import 'dotenv/config';
import express from 'express';
import isPort from 'validator/lib/isPort.js';

// Noteboard
import Noteboard from './core-notes.js';

// Express Middlewares
import logMiddleware from './middlewares/log.middleware.js';
import authMiddleware from './middlewares/auth.middleware.js';

// Express Routes
import notesGetRoute from './routes/notes-get.route.js';
import notesPostRoute from './routes/notes-post.route.js';
import notesPutRoute from './routes/notes-put.route.js';
import adminRoute from './routes/admin.route.js';



// DEFAULT CONFIGS
const defaultPort = 8080;



// SETUP

// Parse environment variables (or .env file)
const parsePort = function () {
    if (isPort(process.env.PORT || "")) {
        return process.env.PORT;
    } else {
        console.warn(`WARNING! Invalid port number in environment variable. Falling back to default ${defaultPort}.`);
        return defaultPort;
    }
}

const port = parsePort();

// Create express server
const server = express();

// Create noteboard
server.locals.noteboard = new Noteboard('./database/githubnotes.json'); //this way the "noteboard" should be accessible in all components of the app



// ROUTES & MIDDLEWARE

// Logs middleware
server.use( logMiddleware );

// "/api/notes" GET...
server.use('/api/notes', notesGetRoute);
// ...POST...
server.use('/api/notes', notesPostRoute);
// ...and PUT
server.use('/api/notes', notesPutRoute);

// "/api/admin" routes
server.use('/api/admin', adminRoute);

// Default error for non existent/implemente paths
server.use(
    //'/',
    function (request, reply) {
        reply.status(500).json({
            success: false,
            code: 1001,
            message: 'Resource not found'
        });
    }
);



// RUN SERVER
console.log(`Server now listening on port ${port}...`);

server.listen(port);
