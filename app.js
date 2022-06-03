// IMPORTS

// Packages
import 'dotenv/config';
import express from 'express';
import isPort from 'validator/lib/isPort.js';

// Noteboard
import Noteboard from './noteboard.js';

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
const defaultDatabasePath = './database/githubnotes.json'


// PARSE ENV

// Parse port number
const parsePort = function () {
    if (isPort(process.env.PORT || "")) {
        return process.env.PORT;
    } else {
        console.warn(`WARNING! Invalid or no port number specified in environment variables. Falling back to default ${defaultPort}`);
        return defaultPort;
    }
}

const port = parsePort();

// Parse path to notes database
const parseDatabasePath = function () {
    if (!!process.env.NOTES_DATABASE_PATH) { //Needs some better validation...
        return process.env.NOTES_DATABASE_PATH;
    } else {
        console.warn(`WARNING! Invalid or no database path specified in environment variables. Falling back to default "${defaultDatabasePath}"`);
        return defaultDatabasePath;
    }
}

const databasePath = parseDatabasePath();



// SETUP

// Create express server
const server = express();

// Create noteboard
server.locals.noteboard = new Noteboard(databasePath); //this way the "noteboard" should be accessible in all components of the app



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
