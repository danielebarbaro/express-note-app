import express from "express";
import 'dotenv/config';

import body from 'express-validator'
import * as fs from "fs";
import axios from 'axios';
import logMiddleware from './middlewares/log.middleware,js'

const app = express()

app.use(express.json())

app.get(
    '/init',
    async (req, res) => {

            // https://its.dbdevelopment.tech/notes
            const options = {
                method: 'post',
                url: 'https://its.dbdevelopment.tech/notes',
                headers: {
                    "token": "d928bd-179402-tks"
                },
                data: {
                    "user": "@giacomoquaglia"
                }
            };

            const notes = await axios
                .request(options)
                fs.writeFileSync(`./database/githubnotes.json`, JSON.stringify(notes.data))

        res
            .status(200)
            .json({
                "success": true,
                "list": true,
                "data": notes                
            })
    }
)

app.get('/api/notes/:uuid', logMiddleware, function (req, res) {
    const {uuid} = req.params
    res
        .status(200)
        .const('applications/json')
        .json({
            status: 'success',
            code: 123,
            data: []
        })
})


app.listen(process.env.PORT || 5005)