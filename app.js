import express from "express";
import 'dotenv/config';
import logMiddleware from "./middlewares/log.middleware.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import axios from 'axios';
import fs from 'fs';

const port = process.env.PORT
const app = express()

app.use(express.json())



app.get('/', logMiddleware, (request, response) =>
    response.send('Sei nel progetto forkato')
)



//1. AXIOS-SOLUTION, accedere https://its.dbdevelopment.tech/notes
app.get ('/accessdata', logMiddleware, async (request, response) => 
{
     
    const options = {
        method: 'post',
        url: ' https://its.dbdevelopment.tech/notes',
        
        headers:
        {
           
            'token': process.env.API_KEY
        },

        data: 
        {
            "user": "@LoisITS"
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

response.send('You are accessing data.');
})
   

//2. GET `api/notes`. Non autenticata
//http://localhost:5005/api/notes
app.get( '/api/notes', (request, response) => {
       
        const data = fs.readFileSync('database/githubnotes.json')
        const result = data.toString()
        const notes = JSON.parse(result)

        response
            .status(200)
            .json({
                'success': true,
                'list': true,
                'data': notes
        })

       
})



//3. GET `api/notes/:uuid`. Non autenticata
//http://localhost:5005/api/notes/:uuid
app.get('/api/notes/:uuid',
  function (request,response) 
{
    const {uuid} = request.params
    const data = fs.readFileSync('database/githubnotes.json')
    const result = data.toString()
    const notes = JSON.parse(result)
    response 

        .status(200)
        .json({
            'success': true,
            'single': true,
            'data': notes
    })
    
})

/*4. GET `api/notes?date=2023-10-01`
Viene applicato il filter() Method. 
Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter?retiredLocale=it
 
 Tra le note disponibili sul githubnotes.json non esiste una nota con la date maggiore al 2023-10-01.
 Pertanto, ho controllato la funzione con la data "2022-10-06"


Api: http://localhost:5005/api/data?date=2023-10-01
     http://localhost:5005/api/data?date=2022-10-06
*/

app.get('/api/data',
  logMiddleware, (request,response) =>
{
    const data = fs.readFileSync('database/githubnotes.json')
    const result = data.toString()
    const notes = JSON.parse(result)

    console.log(result)
    // const datafilter = data.filter(filtered => filtered.Date > '2023-10-01');
     const datafiltered=notes.filter(change => new Date(change.date) > new Date (request.query.date))
    
   console.log(request.query.date)
  
    
    response 
    .status(200)
        .json({
            'success': true,
            'filtered': true,
            'data': datafiltered

        })
    
})

/*5. [GET] - `api/notes?limit=2`
authMiddleware non è stato implementato perché la chiamata risponde con l'errore di "unathorized"

API: http://localhost:5005/api/limit?limit=2 

*/

app.get('/api/limit',
  logMiddleware, 
  function (request,response) 
{
    const data = fs.readFileSync('database/githubnotes.json')
    const result = data.toString()
    const notes = JSON.parse(result)

    const limit = request.query.limit;
    console.log(limit)
    
    response 
    .status(200)
        .json({
            'success': true,
            'data': notes

        })
    
})

/*6. [POST] - `api/notes` - Aggiunge una nota
authMiddleware non è stato implementato perché la chiamata risponde con l'errore di "unathorized"

API: http://localhost:5005/api/notes

*/

app.post('/api/notes',
logMiddleware,
function (request, response)
{
           
     const {uuid}=request.params
     const {id}=request.params
    
     const data = fs.readFileSync('database/githubnotes.json')
     const result = data.toString()
     const notes = JSON.parse(result)
     


     const addNote = function (title, body) {
         const note = loadNotes();
         const noteExist = findNote(note, title);
     
         if (!noteExist) {
             note.push({
                 title: title,
                 body: body
             })
             console.log(Math.random())
             saveNotes(note);
             console.log('Nota aggiunta con successo', '\n');
         } else {
             console.log('La nota esiste già!', '\n');
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


/*7.  [PUT] - `api/notes/:uuid` - Aggiorna la nota
authMiddleware non è stato implementato perché la chiamata risponde con l'errore di "unathorized"

API: http://localhost:5005/api/notes/:uuid

*/
app.put('/api/notes/:uuid',
logMiddleware,
function (request, response) 
{

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


app.all('*', (request, response) => {
    console.error('sei in una risorsa non corretta.')
    response
        .status(500)
        .json({
            'success': false,
            'code': 1001,
            'error': "Resource not found"
        })
})

app.listen(port || 3000)