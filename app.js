import express from "express";
import 'dotenv/config';
import logMiddleware from "./middlewares/log.middleware.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import axios from 'axios';
import fs from 'fs';

const port = process.env.PORT
const app = express()



app.use(express.json())

//app.use(logMiddleware);

//app.use(authMiddleware);

app.get('/', logMiddleware, (request, response) =>

    response.send('Sei nel progetto forkato.')
)


app.get('/init',  logMiddleware, async(request, response) => {
    
    //https://its.dbdevelopment.tech/notes
    const options = {
        method: 'post',
        url: 'https://its.dbdevelopment.tech/notes',
        headers: {
            
            'token': process.env.API_KEY

        },
        data: {
            "user": "@AssiaSam"
        }

    };

    try {
        const result = await axios.request(options)
       

        const notes = result.data;
        const dataJSON = JSON.stringify(notes.data)
        fs.writeFileSync('database/githubnotes.json', dataJSON)
       
    } catch (error) {
        console.error('ERRORE: ', error);
    }

response.send('Sei nella init.');
})


//[GET] - api/notes - Restituisce tutte le note
//La rotta NON deve essere Autenticata
        app.get(
            '/api/notes',
            (request, response) => {
                const data = fs.readFileSync('database/githubnotes.json')
                const result = data.toString()
                const notes = JSON.parse(result)
                response 
                .status(200)
                .json({
                    "succes": true,
                    "list": true,
                    "data": notes
                })
            })


 //[GET] - api/notes/:uuid - Restituisce la nota con uuid passato come parametro
//La rotta NON deve essere Autenticata
            app.get(
                '/api/notes/:uuid',
                function (request,response){

                const {uuid}= req.param 
                const data = fs.readFileSync('database/githubnotes.json')
                const result = data.toString()
                const notes = JSON.parse(result)

                response 
                .status(200)
                .json({
                    "succes": true,
                    "single": true,
                    "data": notes,
                })
            })
             
// [GET] - api/notes?date=2023-10-01 - Restituisce tutte le note con data maggiore di date
//La rotta DEVE essere Autenticata
            app.get(
            '/api/data',// nell'indirizzo ho tolto notes per evitare che influisca sul risultato stampando anche i risultati di notes
                            //la data della consegna non è esistente nelle note per tanto ho provato su postman con un'altra data (2023-05-01) e funziona
            [logMiddleware], //ho messo solo logMiddeleware in quanto autendicando da errore e non sono stata in grado di risolvere il problema 
             (request,response) =>{ 
                const data = fs.readFileSync('database/githubnotes.json')
                const result = data.toString()
                const notes = JSON.parse(result)
                console.log(result)
                const result1= notes.filter(q=> new Date(q.date) > new Date(request.query.date))
                console.log(request.query.date)


                response 
                .status(200)
                .json({
                    "succes": true,
                    "filtred": true,
                    "data": result1
                })
            })

//[GET] - api/notes?limit=2 - Restituisce un numero di limit note
//La rotta DEVE essere Autenticata   
            app.get(
                '/api/limit',//ho messo solo logMiddeleware in quanto autendicando da errore e non sono stata in grado di risolvere il problema
                [logMiddleware],
                (request,response) =>{
                const data = fs.readFileSync('database/githubnotes.json')
                const result = data.toString()
                const notes = JSON.parse(result)
                const limit = request.query.limit

                response 
                .status(200)
                .json({
                    "succes": true,
                    "data": notes
                })
             })
    

//* [POST] - `api/notes` - Aggiunge una nota
//* La rotta **DEVE** essere Autenticata
        app.post(
            '/api/notes',
            [logMiddleware],//ho messo solo logMiddeleware in quanto autendicando da errore e non sono stata in grado di risolvere il problema
            (request, response) => {
                
            const {uuid}=request.params
            const {id}=request.params
            const data = fs.readFileSync('database/githubnotes.json')
            const result = data.toString()
            const nota = JSON.parse(result)
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

//[PUT] - `api/notes/:uuid` - Aggiorna la nota
// La rotta **DEVE** essere Autenticata

        app.put(
            '/api/uuid',
            [logMiddleware],//ho messo solo logMiddeleware in quanto autendicando da errore e non sono stata in grado di risolvere il problema
            (request, response) => {
            const {uuid}=request.params
            const {id}=request.params
            const {Data}=request.params
            const {user}=request.params
    
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




        app.all('*',  (reqest, response) =>{
            console.error('sei in una risorsa non corretta.')
            response
                .status(500)
                .json({
                    'sucess':false,
                    'code':1001,
                    'message' : "Risorsa non disponibile"
                })
            })

        
            
        app.listen(port || 3000)
