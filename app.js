import express from "express";
import adminsRoute from "./routes/admins.route.js";
import 'dotenv/config';
import notFoundMiddleware from "./middlewares/notfound.middleware.js"
import logMiddleware from "./middlewares/log.middleware.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import loadNotes from "./services/note.service.js";
import noteRoute from "./routes/notes.route.js";

const app = express()
import {body, check ,validationResult} from "express-validator"
app.use(logMiddleware)
app.use(adminsRoute)
app.use(noteRoute)


//chiavi: secret, token
//DEVE ESSERE AUTH USA IL MIDDLE AUTH 

//const { check , validationResult } = require('express-validator');



app.use(notFoundMiddleware)
app.listen(process.env.PORT)

