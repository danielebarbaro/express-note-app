import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import axios from 'axios';
import fs from 'fs';

const adminsRoute = express.Router();

const writeNotes = function (notes) {
    const data = JSON.stringify(notes)
    fs.readFileSync('database/githubnotes.json', data)
}

adminsRoute.get(
    '/admin/init',
    async (req, res) => {

        // https://its.dbdevelopment.tech/notes
        const options = {
            method: 'post',
            url: 'https://its.dbdevelopment.tech/notes',
            headers: {
                "token": "v623qo-882097-cpo"
            },
            data: {
                "user": "@Wayde2112"
            }
        };
         
        try {
            const ris = await axios.request(options)
            const notes = ris
            writeNotes(notes.data)
        } catch (e) {
            console.error("ERRORE: ", e)
        }
    }
)

export default adminsRoute;