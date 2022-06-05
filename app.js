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

const port = process.env.PORT


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

app.get('/api/notes', authMiddleware, (req, res) => {
  const dataFile = fs.readFileSync('database/githubnotes.json', 'utf8')
  const notes = JSON.parse(dataFile)
  let noteLimit = [...notes]
  let noteData = notes
  const {limit} = req.query
  const {data} = req.query
  

  if(!limit && !data){
    res.status(200).json({
      "succes": true,
      "list": true,
      "data": notes
    })
  } else if(!data && limit){
    noteLimit = noteLimit.slice(0, Number(limit))

    res.status(200).json({
      "succes": true,
      "data": noteLimit
    })
  } else(!limit && data)
   noteData = noteData.filter(note => new Date(note.date) > new Date(data)) 
   res.status(200).json({
     "succes": true,
     "filtered": true,
     "data": noteData

   })
})

app.get('/api/notes/:id', (req, res) => {
  const dataFile = fs.readFileSync('database/githubnotes.json', 'utf8')
  const notes = JSON.parse(dataFile)
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

app.post('/api/notes', authMiddleware, (req, res) => {
  const dataFile = fs.readFileSync('database/githubnotes.json', 'utf8')
  const notes = JSON.parse(dataFile)
  const note = req.body
  notes.push(note)

  res.status(201).json({
    "success": true,
    "data": ''

  })

})

app.put('api/notes/:id', authMiddleware, (req, res) => {
  const dataFile = fs.readFileSync('database/githubnotes.json', 'utf8')
  const notes = JSON.parse(dataFile)
  const{id} = req.params
  const title = req.body.title
  const body = req.body.body

  notes[notes.length - 1].title = title
  notes[notes.length - 1].body = body

  res.status(200).json({
    "succes": true,
    "title": title,
    "body": body

  })
})








app.listen(port || 3000)