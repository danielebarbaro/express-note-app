import express from "express";
import 'dotenv/config';
import router from "./routes/notes.route.js";
//import {adminsRoute, loaduUsernames} from "./routes/admins.route.js";

const app = express()
//loaduUsernames()
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(router);
//app.use(adminsRoute);
app.use(function(req, res, next){
    res.status(404).json({
        "success": false,
        "code": 1001,
        "error": "Resource not found"
    });
});
const port = process.env.PORT;
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => console.log(`Server listening on port ${port}`));
}
export default app;