import express, { query } from "express";
import 'dotenv/config';
import logMiddleware from "./middlewares/log.middleware.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import axios from 'axios';
import fs from 'fs';
import { body, check } from "express-validator";

const port = process.env.PORT
const app = express()

app.use(express.json())

app.get('/',  logMiddleware, (request, response) => {

  response.send('Sei nel progetto forkato.');
})

app.get('/init',  logMiddleware, async(request, response) => {

        const options = {
            method: 'post',
            url: 'https://its.dbdevelopment.tech/notes',
            headers: {

                'token': process.env.API_KEY
            },
            data: {

                "user": "@Simo-stella-31"
            }
        };

        try {
            const result = await axios.request(options);
            const notes = result.data;
            const dataJSON = JSON.stringify(notes.data);

            fs.writeFileSync('database/githubnotes.json', dataJSON);

        } catch (error) {

            console.error('ERRORE: ', error);
        }

    response.send('Sei in /init');
})

app.get('/api/notes', (request, response) => {

        const data = fs.readFileSync('database/githubnotes.json');
        const result = data.toString();
        const notes = JSON.parse(result);

        response
            .status(200)
            .json({
                "success": true,
                "list": true,
                "data": notes
        })
})

app.get('/api/notes/:uuid', function(request, response) {
	
	const uuid = request.params;
	const data = fs.readFileSync('database/githubnotes.json');
	const result = data.toString();
	const notes = JSON.parse(result);

	//const idScelto = notes.filter(i => new Id(i.date) > new Id(request.query.date));
	const idScelto = notes.filter(listaNote.find(n => n.id === n.uuid));

	response
		.status(200)
		.json({
			"success": true,
			"single": true,
			"data": idScelto
		})
})

/*Controllando le note non avevo nessuna data maggiore di 2023-10-01*/
app.get('/api/data', logMiddleware, (request, response) => {
	
	const data = fs.readFileSync('database/githubnotes.json');
	const result = data.toString();
	const notes = JSON.parse(result);
	
	console.log(result);
	
	const dataScelta = notes.filter(d => new Date(d.date) > new Date(request.query.date));
	
	console.log(request.query.date);
	
	response
		.status(200)
		.json({
			"success": true,
			"filtered": true,
			"data": dataScelta
		})
})

app.get('/api/limit', logMiddleware, (request, response) => {
	
	const data = fs.readFileSync('database/githubnotes.json');
	const result = data.toString();
	const notes = JSON.parse(result);
	const limit = request.query.limit;
	
	console.log(limit);
	
	response.
		status(200)
		.json({
			"success": true,
			"data": notes
		})
})

app.post('/api/notes', logMiddleware, (request, response) => {
	
	const {uuid} = request.params;
	const {id} = request.params;
	const data = fs.readFileSync('database/githubnotes.json');
	const result = data.toString();
	const notes = JSON.parse(result);
	
	const addNote = function (title, body) {
		
		const notaAggiunta = loadNotes();
		const noteExist = findNote(notaAggiunta, title);
		
		if (!noteExist)
		{
			notaAggiunta.push({
				title: title,
				body: body
			})
			
			console.log(Math.random());
			
			saveNotes(notaAggiunta);
			
			console.log('Nota aggiunta con successo');
		}
		else
		{
			console.log('Nota esistente');
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

app.put('/api/:uuid', logMiddleware, (request, response) => {
	
	const {uuid} = request.params;
	const {id} = request.params;
	const {Data} = request.params;
	const {user} = request.params;
	const data = fs.readFileSync('database/githubnotes.json');
	const result = data.toString();
	const notes= JSON.parse(result);
	
	response
		.status(200)
		.json({
			"success": true,
			"list": true,
			"data": notes,
			"title": "Corso Node",
			"body": "Crea app Note"
		})
})

app.get('/api/admin/user-stats/:user', [authMiddleware, logMiddleware], (request, response) => {
	
	const data = fs.readFileSync('database/githubnotes.json');
	const result = data.toString();
	const notes = JSON.parse(result);
	
	response
		.status(200)
		.json({
			"success": true,
			"data": notes
		})
})

app.all('*', (request,response) => {
	
	console.error('Sei in una risorsa non corretta');
	
	response
		.status(500)
		.json({
			"success": false,
			"code": 1001,
			"message": "Risorsa non disponibile"
		})
})

app.listen(port || 3000)