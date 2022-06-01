
import express, { request, response } from "express";
import 'dotenv/config';
import logMiddleware from "./middlewares/log.middleware.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import {param, query, validationResult} from 'express-validator';
import axios from "axios";
import * as fs from 'fs';
import * as ns from "./services/note.service.js"; 

const port = process.env.PORT;
const app = express()
app.use(express.json())

const saveNotes = function (notes) {
    const dataJSON = JSON.stringify(notes)
    fs.writeFileSync('database/githubnotes.json', dataJSON)
}

app.get('/init', async function(req, res) {
     
        const options = {
            method: 'post',
            url: 'https://its.dbdevelopment.tech/notes',
            headers: {
                "token":  process.env.API_KEY
            },
            data: {
                "user": "@riccardo-maldera"
            }
        };
    
        try {
            const response = await axios.request(options)
            const notes= response?.data;
            saveNotes(notes.data);
        } catch (error) {
            console.error('ERRORE: ', error);
        }
    
    res.send('Hello World')
})

app.get('/api/notes', function (req, res) {
    
    res
        .status(200)
        .json({
            success: 'true',
            list: 'true',
            data: 
                (ns.loadNotes())
        })
    
})


app.get('/api/notes/:uuid', function (req, res) {
    
    const uuid = req.params.uuid;
    const noteCaricate = (ns.loadNotes());
    const notef = noteCaricate.filter((req => req === uuid))
    if(notef === uuid)
    {
        res
        .status(200)
        .json({
            success: 'true',
            list: 'true',
            data: notef
                
        })
    }
    else
    {
        res.send("Errore");
    }
    
    
})




app.listen(port || 3000)


