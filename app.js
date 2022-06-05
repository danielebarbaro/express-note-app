import express, { request, response } from "express";
import 'dotenv/config';
import logMiddleware from "./middlewares/log.middleware.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import {param, query, validationResult} from 'express-validator';
import axios from "axios";
import * as fs from 'fs';
import * as note from "./services/note.service.js"; 

const app = express()

app.get('/init', async function(req, res) {

    const options = {
        method: 'post',
        url: 'https://its.dbdevelopment.tech/notes',
        headers: {
            'token': 'o822pm-774372-hkq'
        },
        data: {
            "user": '@saramorritti'
        }
    };

    try {
        const response = await axios.request(options)
        const notes= response?.data;
        note.saveNotes(notes.data);
    } catch (error) {
        console.error('ERRORE: ', error);
    }

res.send('A posto')
})

app.get('/api/notes',logMiddleware, function (req, res) {

    res
        .status(200)
        .json({
            success: 'true',
            list: 'true',
            data: 
                (note.loadNotes())
        })

})


app.get('/api/notes/:uuid',logMiddleware, function (request, response) {

    const loadN = (note.loadNotes());
    const uuid = req.params.uuid;
    const filter = noteCaricate.filter((request => request === uuid))
    if(loadN === uuid)
    {
        response
        .status(200)
        .json({
            success: 'true',
            list: 'true',
            data: filter

        })
    }
    else
    {
        response.send("Errore");
    }


})

app.post('/api/notes',(request,response)=>{

    const noteW=request.body
    note.push(noteW)
    response.status(201)
    response.json({
        "success": true,
        "data":''
    })


})



app.get('/api/notes/date',query('date'))


app.listen(process.env.PORT || 3000)