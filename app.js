
import express, { request, response } from "express";
import 'dotenv/config';
import logMiddleware from "./middlewares/log.middleware.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import{body, check, validationResult} from "express-validator";
import axios from "axios";
import * as fs from 'fs';

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

const loadNotes = function () {
    try {
        const data = fs.readFileSync('database/githubnotes.json')
        const result = data.toString()
        return JSON.parse(result)
    } catch (e) {
        console.log('ERRORE file non trovato', e.message)
        return []
    }
}

app.get('/prova', function (req, res) {
    
    loadNotes()
    res.send('fatto')
})

app.listen(port || 3000)


