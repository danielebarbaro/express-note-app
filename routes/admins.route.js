import express from "express";
import auth from '../middlewares/auth.middleware.js';
import logMiddleware from "../middlewares/log.middleware.js";
import {notesLoader} from "../services/note.service.js";
import {param, validationResult} from 'express-validator';

const adminsRoute = express.Router();
const usernames = [];
notesLoader().forEach(n => usernames.push(n.user))
//funziona e autentica
adminsRoute.get(`/api/admin/user-stats/:user`, param('user').isIn(usernames), auth, logMiddleware,(req,res) => {
    
    const errors = validationResult(req);
    let resJson;
    let code;
    if(!errors.isEmpty()){
        resJson = {
            success: false,
            error: "Username non trovato"
        }
        code = 400
    }
    else {
        let notes = notesLoader();
        let filteredNotes = notes.filter( n => n.user === req.params.user);
        let user = req.params.user;
        let userNotes = {
            [user] : filteredNotes
        }
        resJson = {
            "success": true,
            "user": req.params.uuid,
            "data": [
                userNotes
            ]
        }
        code = 200
        }
    res.status(code).json(resJson);
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
