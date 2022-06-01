import express, { response } from "express";
import 'dotenv/config';
import authMiddleware from "./middlewares/auth.middleware.js";
import logMiddleware from "./middlewares/log.middleware.js";
import * as fs from "fs";

const port=process.env.port
const app = express()
const data=fs.readFileSync('database/githubnotes.json');
const result=data.toString();
//console.log(result)

app.get('/', authMiddleware,  function (req, res) {

    console.log(`Faccio modifica senza fare restart`)
    res.send('notes')
  })


  app.get('/api/notes',  function (req, res) {

    res.send('https://its.dbdevelopment.tech/notes');
  })




  app.get('/api/notes/:uuid',  function (req, res) {

    console.log(`uuid`)
    res.send('uuid')
  })
  


  app.get('/api/notes?date=2023-10-01', authMiddleware, function (req, res) {

    console.log(`data`)
    res.send('data')
  })


  app.get('/api/notes?limit=2', authMiddleware,  function (req, res) {

    console.log(`note limitate`)
    res.send('note limitate')
  })


  app.post('/api/notes', authMiddleware,  function (req, res) {

    console.log(`aggiungi nota`)
    res.send('aggiungi nota')
  })


  app.put('/api/notes', authMiddleware, function (req, res) {

    console.log(`aggiorna nota`)
    res.send('aggiorna nota')
  })


  app.get('/api/admin/user-stats/:user',  function (req, res) {

    console.log(`note utente`)
    res.send('note utente')
  })



  app.get('/test', logMiddleware, (request,response)=> 
    response
    .status(200)
    .json ({
      'data':'Valore',
      'status':'Ok',
      "value": 1,
    })
    .response.send(result)

  )

  



  //per gestire tutto il resto
  app.all('*', (request, response)=>{
    response
    .status(500)
    .json ({
      "success": false,
    "code": 1001,
    "error": "Resource not found"
    })
  })


app.listen(port || 3000)

