// IMPORTS

// Built-in
import * as fs from "fs";

// Packages
import 'dotenv/config';
import axios from "axios";
import express from 'express';

// Notes
import * as core from './core-notes.js';

// Express Middlewares
import logMiddleware from './middlewares/log.middleware.js';
import authMiddleware from './middlewares/auth.middleware.js';

// Express Routes
import notesGetRoute from './routes/notes-get.route.js';
import notesPostRoute from './routes/notes-post.route.js';
import notesPutRoute from './routes/notes-put.route.js';
import adminRoute from './routes/admin.route.js';


// Settings
const port = process.env.PORT;
const appSecret = process.env.API_KEY;
const noteLink = process.env.API_NOTES_LINK;
const keyLink = process.env.API_KEY_LINK;
const gitHubUser = process.env.GITHUB_USER;


const databasePath = 'database/githubnotes.json'



// SETUP

// Create express app
const app = express();

// Create noteboard
app.locals.noteboard = core.loadNotes(databasePath); //this way the "noteboard" should be accessible in all components of the app



// ROUTES & MIDDLEWARE

// Init
app.get('/init', async (request, response) => {
    const apiSecretResponse = await axios.get(`${keyLink}/${gitHubUser}`).then(r => r.data);
    const apiSecret = apiSecretResponse.data;

    const notes = await axios({
        method: 'post',
        url: noteLink,
        data: {"user": `${gitHubUser}`},
        headers: {'token': `${apiSecret}`}
    }).then(res => {
        return res.data
    })

    fs.writeFileSync(databasePath, JSON.stringify(notes));

    app.locals.noteboard = notes; //update "app.locals.noteboard" every time the init route is executed

    response
        .status(204)
        .json()
});




// Logs middleware
app.use( logMiddleware );

// "/api/notes" GET...
app.use('/api/notes', notesGetRoute);
// ...POST...
app.use('/api/notes', notesPostRoute);
// ...and PUT
app.use('/api/notes', notesPutRoute);

// "/api/admin" routes
app.use('/api/admin', adminRoute);

// Default error for non existent/implemente paths
app.use(
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

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => console.log(`Server listening on port ${port}`));
}

export default app;
