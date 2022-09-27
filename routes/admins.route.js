
import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import axios from 'axios';
import fs from 'fs';
import 'dotenv/config';

const adminsRoute = express.Router();

adminsRoute.get('/init',(request, response) => 
    {
        try {
            axios.get("https://its.dbdevelopment.tech/key" + process.env.GITHUB_USER)
            .then(res=> {
                const secretKey= res.data.data;
                const config = {
                    headers: { token: `${secretKey}`}
                };
                const body = {
                    user: `${process.env.GITHUB_USER}`
                };
                axios.post("https://its.dbdevelopment.tech/notes",body,config)    
                .then(res=> fs.writeFileSync('database/githubnotes.json', JSON.stringify(res.data)))
                .catch(err => console.log(err));
                })
            .catch(err => {
                console.log(err);
            });
        }
        catch (error) {
            console.error(error);
        }
    }
);

export default adminsRoute;
