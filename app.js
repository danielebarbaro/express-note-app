
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

app.get('/api/notes', async function (req, res) {
    if(req.query['date']){
        await ns.retrieveDate(req.query['date']).then((value) => {
            res
                .status(200)
                .json({
                    success: 'true',
                    filtered: 'true',
                    data: 
                        value,
            });
        });
        return;
    }else if(req.query['limit']){
        console.log('limit');
    }else{
        res
            .status(200)
            .json({
                success: 'true',
                list: 'true',
                data: 
                    (ns.loadNotes())
        });
        return;
    }
});

app.get(`/api/notes/:uuid`, async function (req, res) {
        
    const uuid = req.params.uuid;

    var jsonUUID = {};
        
    await ns.UUIDln(uuid).then((value) => jsonUUID = value);

    res
        .status(200)
        .contentType('application/json')
        .json({
            success: 'success',
            single: 'true',
            data: jsonUUID,
        });
});

app.get(`/api/notes?date`, async function (req, res) {

    console.log('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
        
    /* const uuid = req.params.uuid;

    var jsonUUID = {};
        
    await ns.UUIDln(uuid).then((value) => jsonUUID = value);

    res
        .status(200)
        .contentType('application/json')
        .json({
            success: 'success',
            single: 'true',
            data: jsonUUID,
        }); */
});

app.listen(port || 3000)
