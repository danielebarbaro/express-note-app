import express from "express";
import 'dotenv/config';
import logMiddleware from "./middlewares/log.middleware.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import {param, query, validationResult} from 'express-validator';
import axios from "axios";
import * as fs from 'fs';
import * as ns from "./services/note.service.js"; 
import { noMiddleware } from "./middlewares/no.middleware.js";
var note = ns.loadNotes();

const port = process.env.PORT;
const app = express()
app.use(express.json())
app.use(noMiddleware);

const saveNotes = function (notes) {
    const dataJSON = JSON.stringify(notes)
    fs.writeFileSync('database/githubnotes.json', dataJSON)
}

app.get('/init', async function(res) {
     
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

app.get('/api/notes', logMiddleware, async function (req, res) {
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
        console.log(res, req);
    await ns.retriveLimit(req.query['limit']).then((value) => {
        res
            .status(200)
            .json({
                success: 'true',
                filtered: 'true',
                data: 
                    value,
        });
    });
    authMiddleware;
    return;
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

app.get(`/api/notes/:uuid`, logMiddleware, async function (req, res) {
        
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


app.post('/api/notes',logMiddleware, authMiddleware,(req,res)=>{

    const PostNotes = req.body;
    note.push(PostNotes);
    res
    .status(201)
    .json({
        "success": true,
        "data": ''
    })


})



app.listen(port || 3000)
