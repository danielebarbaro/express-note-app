import express from 'express';
const router = express.Router();
import * as fs from 'fs';
import auth from '../middlewares/auth.middleware.js';
import * as core from "../services/core.service.js";
import logMiddleware from "../middlewares/log.middleware.js";
import {saveNote, notesLoader} from '../services/note.service.js';
import {param, query, validationResult } from 'express-validator';


//funziona
const generateUUID = () => {
    
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
    
}

router.get('/init', logMiddleware,(req, res) => {
    try{
        core.notesLoader();
    }catch(error){
        console.log(error)
        res.status(500).json({
            "error" : error,
        })
    }
})

router.route('/api/notes')
    .get(logMiddleware,async (req, res) => {

            res.status(200).json({
                "success" : true,
                "list" : true,
                "data":notesLoader()
            })
        })
    .post(auth, logMiddleware,(req, res) => {

        let newUUID = generateUUID()
        let newUser = req.body.user;
        let newDate = req.body.date;
        let newTitle = req.body.title;
        let newBody = req.body.body;
        let noteArray = {
            "id": newUUID,
            "user" : newUser,
            "date" : newDate,
            "title" : newTitle,
            "body" : newBody
        }
    
        let oldNotes = notesLoader()
        
        
        oldNotes.push(noteArray)
        
        saveNote(oldNotes)
    
        res.status(201).json({
            "id": newUUID,
            "user" : newUser,
            "date" : newDate,
            "title" : newTitle,
            "body" : newBody
        })
    })

router.route('/api/notes/date')
    .get(query('date').trim().isDate(), auth, logMiddleware, (req, res) => {
        let date = req.query.date;
        console.log(date);
        let filtered = notesLoader().filter(n => new Date(n.date) > new Date(date))
        console.log()
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({
                success: false,
                error: errors.array()
            })
        }
        res.status(200).json({
            "success" : true,
            "filtered" : true,
            "data" : [filtered]
        })
    })
router.get('/api/notes/limit',query('limit').isNumeric(), auth, logMiddleware, (req, res) =>{
        const errors = validationResult(req);
            if(!errors.isEmpty()){
                res.status(400).json({
                    success: false,
                    error: errors.array()
                })
            }
        let limit = req.query.limit;
        console.log(limit)
        let orderedNotes = notesLoader().sort((a,b) =>{
            new Date(b.date) - new Date(a.date)
        });
        res.status(200).json({
            success: true,
            data : orderedNotes.slice(-limit)
        })

    })

router.route('/api/notes/:uuid')
    .get(param('uuid').isLength({min: 36, max:36}), logMiddleware,(req, res) => {
        let uuid = req.params.uuid;
        const errors = validationResult(req);
        let listNotes = notesLoader();
        if(!errors.isEmpty()){
            res.status(400).json({
                success: false,
                error: errors.array()
            })
        }
        res.status(200)
            .json({
            "success" : true,
            "single": true,
            "data": listNotes.filter(l => l.id === uuid)
        });
    })
    .put(param('uuid').isLength({min: 36, max:36}), auth, logMiddleware,(req, res) => {

        let oldNotes = notesLoader();
        let uuid = req.params.uuid;
        let title = req.body.title;
        let body = req.body.body;
        let selectedNote = oldNotes.find(note => note.id === uuid)
        //console.log(selectedNote);
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({
                success: false,
                error: errors.array()
            })
        }
        
        let editedNote;
    
        if(selectedNote === undefined){
            res.status(404).json({
                "success" : false,
                "error": "Nota non trovata" 
            })
        }else{
            editedNote = {
                "id": uuid,
                "user" : selectedNote.user,
                "date" : selectedNote.date,
                "title" : title,
                "body" : body,
                "created_at": selectedNote.created_at
            }
        }
        let editedOldNotes = oldNotes.filter( n => n.id !== uuid);
        editedOldNotes.push(editedNote);
        saveNote(editedOldNotes)
        res.status(200).json({
            "title" : editedNote.title,
            "body": editedNote.body
        })
    
    })

export default router;