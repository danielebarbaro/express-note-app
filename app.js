import express from "express";
import 'dotenv/config';
import router from "./routes/notes.route.js";
import adminsRoute from "./routes/admins.route.js";

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(router);
app.use(adminsRoute);
app.use(function(req, res, next){
    res.status(404).json({
        "success": false,
        "code": 1001,
        "error": "Resource not found"
    });
});
app.listen(process.env.PORT || 3000)