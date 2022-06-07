import express from 'express';
const router = express.Router();
import auth from '../middlewares/auth.middleware.js';
import * as core from "../services/core.service.js";
import logMiddleware from "../middlewares/log.middleware.js";
import {saveNote, notesLoader} from '../services/note.service.js';
import {param, query, validationResult, oneOf , check} from 'express-validator';
import {v4 as generateUUID} from 'uuid';

router.get('/init', logMiddleware,(req, res) => {
    try{
        core.notesLoader();
    }catch(error){
        console.log(error)
        res.status(500).json({
            "error" : error,
        })
    }
    res.status(204).json()
})

router.get('/api/notes', logMiddleware,async (req, res, next) =>{
    if(!req.query.date && !req.query.limit){
        res.status(200).json({
            "success" : true,
            "list" : true,
            "data":notesLoader()
        })
    }else {
        next();
    }
}, auth, oneOf([query('date').trim().isDate(),query('limit').isNumeric()]), logMiddleware,async  (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.status(400).json({
            success: false,
            error: errors.array()
        })
    }
    if(req.query.date && !req.query.limit){
        let date = req.query.date;
        console.log(date);
        let filtered = notesLoader().filter(n => new Date(n.date) > new Date(date))
        console.log()
        res.status(200).json({
            "success" : true,
            "filtered" : true,
            "data" : [filtered]
        })
    }else if (req.query.limit && !req.query.date){
        let limit = req.query.limit;
        console.log(limit)
        let orderedNotes = notesLoader().sort((a,b) =>{
            new Date(b.date) - new Date(a.date)
        });
        res.status(200).json({
            success: true,
            data : orderedNotes.slice(-limit)
        })
    }
    else {
        res.status(400).json({
            success: false,
            error: 'Invalid request'
        })
    }
}
)

router.route('/api/notes')
    .post(auth, [check('body').isLength(100).bail().isString().bail(), check('title').isLength(100).bail().isString().bail()],logMiddleware,(req, res) => {

        let newUUID = generateUUID()
        let newUser = req.body.user;
        let newDate = req.body.date;
        let newTitle = req.body.title;
        let newBody = req.body.body;
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            res.status(400).json({
                success: false,
                error: errors.array()
            })
        }
        const createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
        
        let noteArray = {
            "id": newUUID,
            "user" : newUser,
            "date" : newDate,
            "title" : newTitle,
            "body" : newBody,
            "created_at" : createdAt
        }

        let oldNotes = notesLoader()

        oldNotes.push(noteArray)
        
        //saveNote(oldNotes)
    
        res.status(201).json({
            "id": newUUID,
            "user" : newUser,
            "date" : newDate,
            "title" : newTitle,
            "body" : newBody
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
        const nota = listNotes.find(note => note.id === uuid)
        delete nota.created_at
        res.status(200)
            .json({
            "success" : true,
            "single": true,
            "data": nota
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
       // saveNote(editedOldNotes)
        res.status(200).json({
            "success" : true,
            "list" : true,
            "data": editedOldNotes
        })
    
    })

export default router;