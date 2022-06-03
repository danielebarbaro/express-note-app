import express, { response } from "express";
import 'dotenv/config';
import authMiddleware from "./middlewares/auth.middleware.js";
import logMiddleware from "./middlewares/log.middleware.js";
import * as fs from "fs";
import axios from "axios";
import { json } from "express";
import { raw } from "express";
import { randomUUID } from 'crypto'

const port = process.env.PORT
const app = express()
app.use(express.json())


const noteee = () => {
  let rawdata = fs.readFileSync('./database/githubnotes.json');
  let notes = JSON.parse(rawdata).data;
  return notes
}









app.get('/init', async (req, res) => {

  const options = {
    method: 'POST',
    url: 'https://its.dbdevelopment.tech/notes',
    headers: { 'token': 'g277lc-342332-avi' },
    data: { 'user': '@MrcllBo' }
  }

  try {
    const notes = await axios.request(options)
    fs.writeFileSync(`database/githubnotes.json`, JSON.stringify(notes.data))
  } catch (error) {
    console.error('ERRORE: ', error.response.data.message);
  }

  res.send(`ce l'hai fatta`)

})



app.get('/api/notes', (req, res) => {

  const notess = noteee()
  const {limit}=req.query
  const {date}=req.query




  /*console.log(date)

  const dataJson=notess.date
  //2023-10-01
  if(dataJson>date){
    res.status(200).json(notess)
  }*/
  
  if(!limit){
    let nuovenotes = notess.map((note) => {
      const { id, user, date, title, body } = note
      return { id, user, date, title, body }
    })
  
    if (!nuovenotes) {
      res.send(`errore`)
    } else {
      res.status(200).json({
        "success": true,
        "list": true, "data": nuovenotes
      })
  
    }
  }else{
    let noteFiltrate=[...notess]
    if(limit){
      noteFiltrate=noteFiltrate.slice(0,Number(limit))
    }
    res.status(200).json(noteFiltrate)

  }

})

app.get('/api/notes/:uuid', (req, res) => {

  const notess = noteee()
  const { uuid } = req.params;

  const nuovenotes = notess.map((note) => {
    const { id, user, date, title, body } = note
    return { id, user, date, title, body }
  })

  const nota = nuovenotes.find(notauuid => notauuid.id === uuid)

  if (!nota) {
    res.send(`errore`)
  } else {
    res.status(200)
      .json({
        "success": true,
        "single": true,
        "data": nota
      });

  }

  console.log(req.params)
})



app.post('/api/notes', authMiddleware, function (req, res) {
  //aggiungi nota da autenticare

  


  const notess = noteee()


  const uuidGenerato = randomUUID();

  const uuidnota = req.body = { "id": uuidGenerato }

  const nota = req.body = {
    "user": "spacex",
    "date": "2022-05-20",
    "title": "Corso Node",
    "body": "Crea app Note"
  }

  const data = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
  const datanota = req.body = { "created_at": data }

  //unisce i tre
  var obj = Object.assign(uuidnota, nota, datanota)

  notess.push(obj)

  console.log(notess)



  if (!nota) {
    res.send(`errore`)
  } else {

    res.status(201).send(nota)

  }



})

app.put('/api/notes/:uuid', function (req, res) {
 const note=noteee()
  const { id } = req.params;

  const nota = req.body = {
    title: 'Corso Node',
    body: 'Crea app Note',
  }
  note[id] = nota

  res.status(200).json({ success: true, data: note })

  //non aggiorna la nota, ma la mette in fondo

})


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

