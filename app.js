import express from "express";
import 'dotenv/config';
import logMiddleware from './middlewares/log.middleware.js'
import authMiddleware from './middlewares/auth.middleware.js'
import notFoundMiddleware from "./middlewares/notfound.middleware.js";
import getAll from './services/note.service.js'
import noteRoute from './routes/notes.route.js'
import adminsRoute from "./routes/admins.route.js";
import { body, check, validationResult } from "express-validator"

const app = express()

app.use(express.json())
app.use(logMiddleware)
app.use(adminsRoute)
app.use(noteRoute)

app.use(notFoundMiddleware)

app.listen(process.env.PORT || 3000)