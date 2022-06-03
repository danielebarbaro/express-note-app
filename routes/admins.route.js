import express from "express";
import authMiddleware from '.././middlewares/auth.middleware.js';
import axios from 'axios';
import fs from 'fs';

const adminsRoute = express.Router();

const saveNotes = function (notes) {
    const dataJSON = JSON.stringify(notes)
    fs.writeFileSync('database/githubnotes.json', dataJSON)
}

adminsRoute.get('/admin/init', async function(req, res) {
        let key = await axios.get(process.env.URL).then(resp=>resp.data.data);
        const options = {
            method: 'post',
            url: 'https://its.dbdevelopment.tech/notes',
            headers: {
                'token':`${key}`
            },
            data: {
                "user": `${process.env.USER}`
            }
        };
    
        try {
            const response = await axios.request(options)
            const notes= response;
            saveNotes(notes.data);
        } catch (error) {
            console.error('ERRORE: ', error);
        }
    }
)

export default adminsRoute;