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

app.get('/', authMiddleware, function (req, res) {

    console.log(`Faccio modifica senza fare restart`)
    res.send('notes')
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

  
  app.get('/p', logMiddleware, (request,response)=> 
  response
  .send(result)
  
  
  
)

  app.get('/api/notes', (request,response)=> 
  response
  .status(200)
  .json ({
    "success": true,
  "list": true,
  "data": 1
})
)


app.get('/api/prova', (request,response)=> 
  response
  .status(200)
  .json ({
    "success": true,
  "list": true,
  "data": 1,
  
})

)

app.get('/api/notes/:uuid', (request,response)=> 
    response
    .status(200)
    .json ({
      'data':'Valore',
      'status':'Ok',
      "value": 1,
    })
  )


  //per gestire tutto il resto
  app.all('*', (request, response)=>{
    console.log(`sei in una risorsa non corretta`)
    response
    .status(500)
    .json ({
      'success':'False',
      'code':'1001',
      "message": 'Risorsa non disponbiile',
    })
  })


app.listen(port || 3000)

