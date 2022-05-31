import express from 'express';
const router = express.Router();
import * as fs from 'fs';
import auth from '../middlewares/auth.middleware.js';
import * as core from "../services/core.service.js";
import logMiddleware from "../middlewares/log.middleware.js";
import {saveNote, notesLoader} from '../services/note.service.js';

//funziona


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

router.get(`/api/notes`, logMiddleware,(req, res) => {

    res.status(200).json({
        "success" : true,
        "list" : true,
        "data":notesLoader()
    });

});

//funziona
router.get(`/api/notes/:uuid`, logMiddleware,(req, res) => {
    let uuid = req.params.uuid;
    let listNotes = notesLoader();
    res.status(200)
    .json({
        "success" : true,
        "single": true,
        "data": listNotes.filter(l => l.id === uuid)
    });
});

//non va
router.get('api/notes', auth, logMiddleware,async (req, res) => {
    let date = req.query.date;
    console.log(date);
    res.status(200).json({
        "success" : true,
        "filtered" : true,
        "data" : notesLoader().filter(n => new Date(n.date) > new Date(date))
    });
});

//non va
router.get(`api/notes`, auth, logMiddleware,async (req, res) =>{
    let limit = req.query.limit;
    let orderedNotes = notesLoader().sort();
    let limitedNotes = [];
    for (let i = 0 ; i < limit ; i++){
        limitedNotes.push(orderedNotes[i]);
    }
    response.status(200).json({
        success: true,
        data : limitedNotes
    })
    
});

//funziona e autentica
router.post(`/api/notes`, auth, logMiddleware,(req, res) => {

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
});

//funziona e autentica
router.put(`/api/notes/:uuid`, auth, logMiddleware,(req, res) => {

    let oldNotes = notesLoader();
    let uuid = req.params.uuid;
    let title = req.body.title;
    let body = req.body.body;
    let selectedNote = oldNotes.find(note => note.id === uuid)
    console.log(selectedNote);
    let editedNote = {
        "uuid": uuid,
        "user" : selectedNote.user,
        "date" : selectedNote.date,
        "title" : title,
        "body" : body
    }

    

    let editedOldNotes = oldNotes.filter( n => n.id !== uuid);
    editedOldNotes.push(editedNote);

    res.status(200).json({
        "title" : editedNote.title,
        "body": editedNote.body
    })

});

export default router;