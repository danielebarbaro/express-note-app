import express from "express";
import auth from '../middlewares/auth.middleware.js';
import logMiddleware from "../middlewares/log.middleware.js";
import {notesLoader} from "../services/note.service.js";

const adminsRoute = express.Router();

//funziona e autentica
adminsRoute.get(`/api/admin/user-stats/:user`, auth, logMiddleware,(req,res) => {
    let notes = notesLoader();
    let filteredNotes = notes.filter( n => n.user === req.params.user);
    let user = req.params.user;
    let userNotes = {
        [user] : filteredNotes
    }
    res.status(200).json({
        "success": true,
        "user": req.params.uuid,
        "data": [
            userNotes
        ]
    });
});

//funziona e autentica
adminsRoute.get(`/api/admin/note-count`, auth, logMiddleware,(req, res) => {
    let notes = notesLoader();
    let count = 0;
    notes.forEach(n => count++);
    res.status(200).json({
        "success": true,
        "notes": count
    });
});

export default adminsRoute;
