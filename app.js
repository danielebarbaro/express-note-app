import express from "express";
import 'dotenv/config';
import logMiddleware from"./middlewares/log.middleware.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import{param, validationResult}  from"express-validator";
import axios from 'axios'
import * as fs from 'fs';
import * as nn from "./services/note.service.js"; 
import { request } from "http";
import { response } from "express";


const port=process.env.PORT
const app = express()
app.use(express.json())
//app.use(logMiddleware);
//app.use(authMiddleware);

app.get(
    '/start', 
    [logMiddleware],
    async(request, response)=> {
        const  chiamata ={
            method:'post',
            url: ' https://its.dbdevelopment.tech/notes',
            headers: {
                token:'n620uu-058817-lug'
            }
            ,data:
            {

                user:'@Matteo29-mar'
            }
        }
        const res = await axios.request(chiamata)
        fs.writeFileSync('database/githubnotes.json', JSON.stringify(res.data.data))
        response.send('ciao server')
    })

    // [GET] - api/notes - Restituisce tutte le note
    app.get(
        '/api/notes',
        [logMiddleware],
    (request, response)=> {
        const notegeneral = function () {
           return fs.readFileSync('database/githubnotes.json')
        }
        response.json(JSON.parse(note()))       //parse trasforma il bit in dato
       
    })

//[GET] - api/notes/:uuid - Restituisce la nota con uuid passato come parametro
app.get(
    '/api/notes/:uuid',
    param('uuid').isUUID(),
    [ logMiddleware],
async (request, response)=> {
const find = function(){
    validationResult(request).throw()
    const uuid= nn.loadnote(request.params.uuid);
}
if(uuid)
response.status(200)
.json({
    "success": true,
    "single": true,
    "data" : uuid
})     
else{
    response.status(403)
    .json(nn.badrequest())
}
})

//[GET] - api/notes?date=2023-10-01 - Restituisce tutte le note con data maggiore di date
//ho provato a farlo, ho guaradto un po su internet ma non riesco a farlo
app.get(
    'api/notes?date=2023-10-01',
    [ logMiddleware],
(request, response)=> {

    const data = function(){
        const data= (nn.loadnote());
    }
    response.json(JSON.parse(data()));      

})

//[GET] - api/notes?limit=2 - Restituisce un numero di limit note
app.get(
    'api/notes?limit=2',
    [authMiddleware],
    (request, response)=> {
        
        const limit = function(){
            const datalimit= (nn.loadnote());
            const limit = request.query.limit;
            console.log(limit);
            
        }
        response.json(JSON.parse(limit()));


})

//[GET] - api/admin/user-stats/:user - Restituisce tutte le note di un determinato user
app.get(
    '/api/admin/user-stats/:user',
    [authMiddleware],
    async( requ, resp) =>{

    }
)


//[POST] - api/notes - Aggiunge una nota
app.post(
    '/api/notes',
    [authMiddleware],
    (req, res)=>{
        const add = function(){

            try {
                const uuid=request.params
                const dataadd= (nn.loadnote(uuid));
                response
                .status(201)
                
            } catch (error) {
                response.status(401)
                .json(nn.badrequest())
            }
      
        }
    }
);

//[PUT] - api/notes/:uuid - Aggiorna la nota

app.put(
    '/api/notes/:uuid',
    [authMiddleware],
    async (request, response)=> {

        const updatedata = function(){

            const dataput= (nn.loadnote());
            const id=request.params;
            const note = request.body = {
                title: 'Corso Node',
                body: 'Crea app Note',
            }
           if(note.title!=notegeneral.title)
           nn.savenote();
        }
        response.status(200)
        json({
            success: true,
            data : note
        });

    }
)



app.all('*',(request, response)=> {
    console.error(" sei una risorsa non corretta")
    response
    .status(500)
    .json({
        'success':'false',
        'code': 1001,
        'message' : "risorsa non disponibile"
    })
})
app.listen(port|| 3000)

