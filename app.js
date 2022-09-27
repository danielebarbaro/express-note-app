import express from "express";
import 'dotenv/config';
import logMiddleware from './middlewares/log.middleware.js'
import adminsRoute from "./routes/admins.route.js";
import noteRoute from './routes/notes.route.js'


const app = express()

app.use(logMiddleware)
app.use(adminsRoute)
app.use(noteRoute)

app.listen(process.env.PORT || 3000)