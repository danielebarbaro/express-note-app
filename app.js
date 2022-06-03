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

  let rawdata = fs.readFileSync('./database/githubnotes.json');
  let notes = JSON.parse(rawdata);


  let nuovenotes = notes.data.map((note) => {
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

})

app.get('/api/notes/:uuid', (req, res) => {

  const rawdata = fs.readFileSync('./database/githubnotes.json');
  const notes = JSON.parse(rawdata);
  const { uuid } = req.params;

  const nuovenotes = notes.data.map((note) => {
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
})



app.get('/api/notes?date=2023-10-01', (req, res) => {

})

app.get('/api/notes?limit=2', authMiddleware, function (req, res) {

  console.log(`note limitate`)
  res.send('note limitate')
})

app.post('/api/notes', authMiddleware, function (req, res) {
  //aggiungi nota da autenticare

  const rawdata = fs.readFileSync('./database/githubnotes.json');
  const notes = JSON.parse(rawdata).data;




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

  notes.push(obj)

  console.log(notes)



  if (!nota) {
    res.send(`errore`)
  } else {

    res.status(201).send(nota)

  }



})

app.put('/api/notes/:uuid', function (req, res) {
  const rawdata = fs.readFileSync('./database/githubnotes.json');
  const notes = JSON.parse(rawdata);
  const { id } = req.params;

  const nota = req.body
  notes[id] = nota

  res.status(200).json({ success: true, data: notes })



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

