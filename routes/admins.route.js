import express from "express";
import logMiddleware from "../middlewares/log.middleware.js";
import authMiddleware from '../middlewares/auth.middleware.js';
import {importNotes} from "../services/note.service.js";
import {param, validationResult} from 'express-validator'; 

const adminsRoute = express.Router();
const users = [];
importNotes().forEach(note => users.push(note.user))

adminsRoute.get(`/api/admin/user-stats/:user`, param('user').isIn(users), authMiddleware, logMiddleware,(req,res) => 
{
    
    const error = validationResult(req);
    let response;
    let statCode;
    if(!error.isEmpty())
    {
        response = 
        {
            success: false,
            error: "User not found"
        }
        statCode = 400
    }
    else 
    {
        let notes = importNotes();
        let user = req.params.user;
        let searchByUser = notes.filter( note => note.user === req.params.user);
        let searchResult = 
        {
            [user] : searchByUser
        }
        response = 
        {
            "success": true,
            "user": req.params.uuid,
            "data": [searchResult]
        }
        statCode = 200
    }
    res.status(statCode).json(response);
});

adminsRoute.get(`/api/admin/note-count`, authMiddleware, logMiddleware,(req, res) => 
{
    let notes = importNotes();
    let count = 0;
    notes.forEach(note => count++);
    res.status(200).json
    ({
        "success": true,
        "notes": count
    });
});


export default adminsRoute;