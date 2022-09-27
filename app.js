import express from "express";
import 'dotenv/config';
import adminsRoute from "./routes/admins.route.js";

const app = express()

app.use(adminsRoute);


app.listen(process.env.PORT || 3000);