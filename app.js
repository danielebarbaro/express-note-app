import express from "express";
import 'dotenv/config';

const port = process.env.port
const app = express()

app.get('/', function (req, res) {
    res.header("Content-Type",'application/json');
    res.json()
  })

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

app.listen(process.env.port || 3000)