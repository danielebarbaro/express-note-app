import express from "express";
import 'dotenv/config';
import notes from "./routes/notes.route.js";
import admin from "./routes/admins.route.js";
import logMiddleware from './middlewares/log.middleware.js';
import notFoundMiddleware from "./middlewares/notFound.middleware.js";

const app = express()

app.use(express.json())
app.use(logMiddleware)
app.use(notes);
app.use(admin);
app.use(notFoundMiddleware);
app.listen(process.env.PORT || 3000)