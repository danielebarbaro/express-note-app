import express, { query } from "express";
import 'dotenv/config';
import logMiddleware from "./middlewares/log.middleware.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import axios from 'axios';
import fs from 'fs';
import { body, check } from "express-validator";


//Professore deve solo entrare sulla cartella express-note-app per vedere l'esercizio nel terminale

const port = process.env.PORT
const app = express()

app.use(express.json())
//app.use(logMiddleware);
//app.use(authMiddleware);



app.get('/',  logMiddleware, (request, response) => {
  
  response.send('Sei nel progetto forkato.');
})

app.get('/init',  logMiddleware, async(request, response) => {
    
        //https://its.dbdevelopment.tech/notes
        const options = {
            method: 'post',
            url: 'https://its.dbdevelopment.tech/notes',
            headers: {
                
                'token': process.env.API_KEY

            },
            data: {
                "user": "@Cat-Genova"
            }

        };
    
        try {
            const result = await axios.request(options)
           
            //scrittura file
            const notes = result.data;
            const dataJSON = JSON.stringify(notes.data)
            fs.writeFileSync('database/githubnotes.json', dataJSON)
           
        } catch (error) {
            console.error('ERRORE: ', error);
        }
    
    response.send('Sei nella init.');
  })
  


//1- richiesta [GET] - `api/notes` - Restituisce tutte le note
app.get('/api/notes',
   
    (request, response) => {
        
        
        //lettura  file
        const data = fs.readFileSync('database/githubnotes.json')
        const result = data.toString()
        const notes = JSON.parse(result)

        response
            .status(200)
            .json({
                "success": true,
                "list": true,
                "data": notes
        })
       
    })
//2- richiesta [GET] - `api/notes/:uuid` - Restituisce la nota con uuid passato come parametro
app.get('/api/notes/:uuid',function(req,res){

                const {uuid}=req.params
                const data = fs.readFileSync('database/githubnotes.json')
                const result = data.toString()
                const notes = JSON.parse(result)
                res
                    .status(200)
                    .contentType('application/json')
                    .json({
                        "success": true,
                        "single": true,
                        "data": notes
                                        
                })
        
       
           
        })
//3 - [GET] - `api/notes?date=2023-10-01` - Restituisce tutte le note con data maggiore di `date`
app.get('/api/data',[logMiddleware],
//nella url su postman la data che lei ci ha fornito non esiste e pertanto nelle note non c'è e allora ho provato ad inserire un'altra data e con questa funziona('2023-04-19')
//quando devo autenticare la chiamata mi dice che non è autorizzarita e mi da errore 403 allora ho lsciato solo logMiddleware
           (request, response) => {
                
            
                //lettura  file
                const data = fs.readFileSync('database/githubnotes.json')
                const result = data.toString()
                const notes=JSON.parse(result)
                console.log(result)
                
                const res=notes.filter(r => new Date(r.date)  > new Date(request.query.date))
                console.log(request.query.date)
                
               
                   response
                       .status(200)
                       .json({
                           "success": true,
                           "filtered": true,
                           "data": res                     
                   })      
        })
//4- [GET] - `api/notes?limit=2` - Restituisce un numero di `limit` note
app.get('/api/limit',[logMiddleware],
//quando devo autenticare la chiamata mi dice che non è autorizzarita e mi da errore 403 allora ho lsciato solo logMiddleware
            (request, response) => {
            
                
                //lettura  file
                const data = fs.readFileSync('database/githubnotes.json')
                const result = data.toString()
                const notes = JSON.parse(result)
                
                
                const limit = request.query.limit;
                console.log(limit)
                
        
                response
                    .status(200)
                    .json({
                        success: "true",
                        "data": notes 
                                        
                })
               
        })

        
//5- [POST] - `api/notes` - Aggiunge una nota
app.post('/api/notes',logMiddleware,
//quando devo autenticare la chiamata mi dice che non è autorizzarita e mi da errore 403 allora ho lsciato solo logMiddleware
        (request, response) => {
           
           const {uuid}=request.params
           const {id}=request.params
           
            //leggi nota
            const data = fs.readFileSync('database/githubnotes.json')
            const result = data.toString()
            const notess = JSON.parse(result)
            


            const addNote = function (title, body) {
                const notes = loadNotes();
                const noteExist = findNote(notes, title);
            
                if (!noteExist) {
                    notes.push({
                        title: title,
                        body: body
                    })
                    console.log(Math.random())
                    saveNotes(notes);
                    console.log(chalk.green('Nota aggiunta con successo', '\n'));
                } else {
                    console.log(chalk.red('Non puoi inserire la nota, esiste già.', '\n'));
                }
            }
           

            response
            .status(201)
            .json({
                "user": "spacex",
                "date": "2022-05-20",
                "title": "Corso Node",
                "body": "Crea app Note" 
            }) 
           
                     
    })
//6-[PUT] - `api/notes/:uuid` - Aggiorna la nota
app.put('/api/:uuid',[logMiddleware],
//quando devo autenticare la chiamata mi dice che non è autorizzarita e mi da errore 403 allora ho lsciato solo logMiddleware
        (request, response) => {
            
            
            const {uuid}=request.params
            const {id}=request.params
            const {Data}=request.params
            const {user}=request.params
            //aggirna note

                    const data = fs.readFileSync('database/githubnotes.json')
                    const result = data.toString()
                    const notes= JSON.parse(result)
                
            
           
        
            response
                .status(200)
                .json({
                    "success": true,
                    "list": true,
                    "data": notes,
                    "title": "Corso Node",
                    "body": "Crea app Note",
                  
                                    
            })
           
})
//7- [GET] - `api/admin/user-stats/:user` - Restituisce tutte le note di un determinato `user`
app.get('/api/admin/user-stats/:user',[authMiddleware,logMiddleware],
    (request, response) => {
        
        
        
        //lettura  file
        const data = fs.readFileSync('database/githubnotes.json')
        const result = data.toString()
        const notes = JSON.parse(result)

        response
            .status(200)
            .json({
                success: "true",
                "data": notes,
               
                                
        })
       
})
    



//risorsa non trovata in caso la chiamata non va a buon fine
app.all('*',  (request,response) => {
    console.error('sei in una risorsa non corretta.')
    response
    .status(500)
    .json({
        'success': false,
        'code':1001,
        'message':"Risorsa non disponibile"
    })
})



app.listen(port || 3000)