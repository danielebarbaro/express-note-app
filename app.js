import express from "express";
import 'dotenv/config';
import req from "express/lib/request.js";
import res from "express/lib/response.js";
import fs from "fs"
import { count } from "console";
import { nextTick } from "process";
import authMiddleware from "./middlewares/auth.middleware.js";
import logMiddleware from "./middlewares/auth.middleware.js";
import axios from "axios";
import { query } from "express";


const app = express()

app.use(express.json())

app.get('/', async(req, res) => {

  const options = {
      method: 'post',
      url: 'https://its.dbdevelopment.tech/notes',
      headers: {

          'token': "x014am-667340-hem"

      },
      data: {
          "user": "@M4tt3-0"
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

  res.send('Homepage')

})

const data = fs.readFileSync('database/githubnotes.json', 'utf8')
const notes = JSON.parse(data)

app.get('/api/notes', (req, res) => {
  
  res.status(200).json({
    "succes": true,
    "list": true,
    "data": notes
  })

})

app.get('/api/notes/:id', (req, res) => {
  const {id} = req.params

  const noteById = notes.find((note) => note.id === id)

  res
    .status(200)
    .contentType('application/json')
    .json({
      "success": true,
      "single": true,
      "data": noteById

    })
})


app.get('/api/notes', (req, res) => {
  const {query} = req.query
  let noteFilterDate = notes

  let dataQueryParsed = Date.parse(query)

  if(query){
    noteFilterDate = noteFilterDate.filter((note) => {
      let dataNota = Date.parse(note.data)
      if(dataQueryParsed < dataNota)
      return note
    })
  }

  res.status(200).json({
    "succes": true,
    "filtered": true,
    "data": noteFilterDate
  })



})

app.get('/api/notes', (req, res) => {

  const {limit} = req.query
  let noteLimite = notes

  if(limit){
    noteLimite = noteLimite.slice(0, Number(limit))
  }

  res.status(200).json({
    "succes": true,
    "data": noteLimite
  })

})

app.post('/api/notes', (req, res) => {
  const note = req.body
  notes.push(note)

  res.status(201).json({
    "success": true,
    "data": ''

  })

})

app.put('api/notes/:id', (req, res) => {
  const{id} = req.params
  const title = req.body.title
  const body = req.body.body

  notes[notes.length - 1] = title
  notes[notes.length - 1] = body
  res.status(200).json({
    "succes": true,
    "title": title,
    "body": body

  })
})








app.listen(3000)