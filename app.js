import express from "express";
import 'dotenv/config';
import logMiddleware from "./middlewares/log.middleware.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import {check, Result, validationResult} from 'express-validator';
import axios from 'axios';
import fs from 'fs';
import { findSourceMap } from "module";

const app = express()

app.use(express.json())

//lettura file
const loadNotes = function () {
    try {
        const data = fs.readFileSync('database/githubnotes.json')
        const result = data.toString()
        return JSON.parse(result)
    } catch (e) {
        return []
    }
}

//Creazione id random
const randv = function(n){
    var rand='';
        for(var i=0; i<n; i++) {
            rand+=(Math.floor(Math.random() * 16)).toString(16);
        }
        return(hexstring);
}

const randid =function(){
    return(randv(8) + '-' + randv(4) + '-' + randv(4) + '-' + randv(4) + '-' + randv(12));
}

//Prova
app.get('/',logMiddleware,  (request, response) =>
    response.send('Prova 123')
)

//Caricamento dati
app.get('/init',logMiddleware, async(request, response)=>{
        const options = {
            method: 'post', 

            url: 'https://its.dbdevelopment.tech/notes',

            headers: {
                'token': "d413mi-882254-ekr",
            },

            data: {
                "user": "@Alastor636"
            }
            
        };
    
        try {
            const result = await axios.request(options)
            const notes = result.data;
            const dataJSON=JSON.stringify(notes.data)
            fs.writeFileSync('database/githubnotes.json', dataJSON)

        } catch (error) {
            console.error('ERRORE: ', error);
        }

        response
        .json({
            'Avanzamento': 'Completato'
        })
})

//Restituisce tutte le note
app.get('/api/notes',logMiddleware, (request, response) => {

    const notes = loadNotes();

    response
        .json({
            'success': true,
            'list': true,
            'data': notes,
        })
})

//Restituisce la nota con uuid passato come parametro
app.get('/api/notes/:uuid',logMiddleware, (request, response) => {
    const {uuid}=request.params

    const notes = loadNotes();

    response
        .json({
            'success': true,
            'single': true,
            'data': notes.find(note => note.id === uuid),
        })
})

//Restituisce tutte le note con data maggiore di `date`
app.get('/api/notes?date=2023-10-01',[authMiddleware, logMiddleware],(request, response) =>{
    
    const datec = new Date("2023-10-01")
    const {uuid}=request.params

    const notes = loadNotes();

    response
        .json({
            'success': true,
            'filtered': true,
            'data': notes.find(note => note.date >= datec),
        })
})

//Restituisce un numero di `limit` note
app.get('/api/notes?limit=2',[authMiddleware, logMiddleware],(request, response) =>{
    
    const notes = loadNotes();

    response
        .json({
            'success': true,
            'list': true,
            'data': notes,
        })
})

//Aggiunge una nota
app.post('/api/notes',[authMiddleware, logMiddleware],(request, response) => {

    const notes = loadNotes();

    const noteExist = findNote(notes, title);
    const idExist = findNote(notes, id);

    const idc =randid();

    if(!noteExist&&!idExist){
        notes.push({
            "id": idc,
            "user": "spacex",
            "date": "2022-05-20",
            "title": "Corso Node",
            "body": "Crea app Note"
        })
        saveNotes(notes);
        console.log(chalk.green('Nota aggiunta con successo', '\n'));
    }
    else{
        console.log(chalk.red('Non puoi inserire la nota, esiste già.', '\n'));
    }
    response
        .status(201)
})

//Aggiorna la nota
app.put('/api/notes/:uuid',[authMiddleware, logMiddleware],(request, response) => {
})

//Restituisce tutte le note di un determinato `user`
app.get('api/admin/user-stats/:user',[authMiddleware, logMiddleware],(request, response) => {
})

//Default
app.all('*', (request, response) => {
    response
        .status(500)
        .json({
            "success": false,
            "code": 1001,
            "error": "Resource not found"
        })
})

app.listen(process.env.PORT || 3000)