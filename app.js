import express, { response } from "express";
import 'dotenv/config';
import authMiddleware from "./middlewares/auth.middleware.js";
import logMiddleware from "./middlewares/log.middleware.js";
import * as fs from "fs";
import axios from "axios";
import { json } from "express";

const port = process.env.port
const app = express()


app.get('/', function (req, res) {

  console.log(`Faccio modifica senza fare restart`)
  res.send('notes')
})


app.get('/dati', async (req, res) => {

  const options = {
    method: 'POST',
    url: 'https://its.dbdevelopment.tech/notes',
    headers: { 'token': 'g277lc-342332-avi' },
    data: { 'user': '@MrcllBo' }
  }

  try{
    const notes = await axios.request(options)
    fs.writeFileSync(`database/githubnotes.json`, JSON.stringify(notes.data))
  }catch(error){
    console.error('ERRORE: ', error.response.data.message);
  }

  res.send(`ce l'hai fatta`)

})



app.get('/api/notes',  (req, res)=> {
  
  let rawdata=fs.readFileSync('./database/githubnotes.json');
  let notes=JSON.parse(rawdata);

  res.status(200).json({"success": true,
  "list": true, "data":notes})
})




app.get('/api/notes/:uuid',(req, res)=> {

const {uuid}=req.params
const persona=persona.find((persona) => persona.id===uuid)

if(!persona){
  return res.status(404).json({messaggio:"non trovato"})
}

res.json(persona)


/*
  const getUser=function(uuid){
    let user=users.find(user=>uuid===user.uuid);
    return user;
}*/

})



app.get('/api/notes?date=2023-10-01', authMiddleware, (req, res)=> {








  console.log(`data`)
  res.send('data')
})


app.get('/api/notes?limit=2', authMiddleware, function (req, res) {

  console.log(`note limitate`)
  res.send('note limitate')
})


app.post('/api/notes', authMiddleware, function (req, res) {

  //const crypto = require('crypto');
  //const randomUuid=crypto;

  //console.log(randomUuid)
 // res.send(randomUuid)

 res.send(`ciao`)
 console.log(req.body)
})


app.put('/api/notes/:uuid', authMiddleware, function (req, res) {

  const crypto = require('crypto');
  const randomUuid=crypto;

  console.log(`aggiorna nota`)
  res.send(`ciao`)
})





app.get('/test', logMiddleware, (request, response) =>
  response
    .status(200)
    .json({
      'data': 'Valore',
      'status': 'Ok',
      "value": 1,
    })
    .response.send(result)

)





//per gestire tutto il resto
app.all('*', (request, response) => {
  response
    .status(500)
    .json({
      "success": false,
      "code": 1001,
      "error": "Resource not found"
    })
})


app.listen(port || 3000)

