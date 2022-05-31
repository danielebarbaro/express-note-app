import express from "express";
import authMiddleware from '.././middlewares/auth.middleware.js';
import axios from 'axios';
import fs from 'fs';

const adminsRoute = express.Router();

adminsRoute.get('/admin/init',authMiddleware,
    async (req, res) => {
        let key = await axios.get(process.env.URL).then(resp=>resp.data.data);
        let data = await axios({
            method:'post',
            url:'https://its.dbdevelopment.tech/notes',
            data:{
                "user": `${process.env.USER}`
            },
            headers:{
                'token':`${key}`
            }
        }).then(res=>{
            return JSON.stringify(res.data)
        })
        fs.writeFileSync('database/githubnotes.json',data.toString())
    }
)

/*adminsRoute.get('api/admin/user-stats/:user',authMiddleware,
    async (req,res)=>{

    }
)*/

export default adminsRoute;