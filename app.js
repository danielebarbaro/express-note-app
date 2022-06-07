import express, { response } from "express";
import 'dotenv/config';
import axios from "axios";
import * as fs from "fs";

const port = process.env.PORT;
const serverSecret = process.env.API_KEY;
const noteLink = process.env.API_NOTES_LINK;
const keyLink = process.env.API_KEY_LINK;
const gitHubUser = process.env.GITHUB_USER;

//const port = process.env.PORT
const app = express()
app.use(express.json())







const note = () => {
  try {
    
    let rawdata = fs.readFileSync('./database/githubnotes.json');
    let notes = JSON.parse(rawdata).data;
    return notes
  } catch (error) {
    return []
  }
}

//funzione che ordina le note per data dalla più recente
const ordinamentoData = (a, b) => {
  try {
    
    return new Date(b.date).valueOf() - new Date(a.date).valueOf();
  } catch (error) {
    return []
  }
}

const noteOrdinate = () => {
  try {
    
    const noteOrdinate = note().sort(ordinamentoData)
    return noteOrdinate
  } catch (error) {
    return []
  }
}

const n = noteOrdinate()

let nuoveNotes = n.map((n) => {
  try {
    const { id, user, date, title, body } = n
    return { id, user, date, title, body }
    
  } catch (error) {
    return []
  }

})











//rotta che prende il file json
app.get('/init', async (req, res) => {

  const options = {
    method: 'post',
    url: "https://its.dbdevelopment.tech/notes",
    headers: { 'token': 'g277lc-342332-avi' },
    data: { 'user': "@MrcllBo" }
  }

  try {
    const notes = await axios.request(options)
    fs.writeFileSync(`database/githubnotes.json`, JSON.stringify(notes.data))
  } catch (error) {
    console.error('ERRORE: ', error.response.data.message);
  }

  res.send(`Hai preso il file json contenente le note`)
})




app.get('/api/notes', (req, res) => {

  const note = nuoveNotes
  const { limit } = req.query
  const { date } = req.query //2023-10-01


  //stampa le note
  if (!limit && !date) {
    res.status(200)
      .json({
        "success": true,
        "list": true,
        "data": note
      });
    }
  //stampa le note limitate 
  // api/notes?limit?=2
  else if (limit && !date) {
    let noteFiltrate = [...note]
    noteFiltrate = noteFiltrate.slice(0, Number(limit))
    res.status(200)
      .json({
        "success": true,
        "data": noteFiltrate
      });
      }
  /*Stampa le note maggiore di una certa data (2023-10-01).
    Non ho nessuna nota con una data maggiore a quella data per l'esercizio,
    quindi non stampa nessuna nota, ma cambiando data (ad esempio 2022-10-01)
    vengono stampate le note con la data maggiore di quella scelta.
    /api/notes?date=2023-10-01 */
  else if (!limit && date) {
    let arrayNoteDate = []
    for (let i in note) {
      if (note[i].date > date) {
        arrayNoteDate.push(note[i])
      }
    }
    res.status(200)
      .json({
        "success": true,
        "filtered": true,
        "data": arrayNoteDate
      });
  }

})


app.get('/api/notes/:uuid', (req, res) => {
  const note = nuoveNotes
  const { uuid } = req.params

  const nota = note.find(notaUuid => notaUuid.id === uuid)

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


app.post('/api/notes', authMiddleware, logMiddleware, (req, res) => {
  const note = nuoveNotes

  const uuidGenerato = randomUUID();
  const data = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')

  /* 
  Ho fatto l'id e la data in un body separato perchè nell'esercizio
  c'è scritto che l'id non deve essere passato nel body.
  Da quello che ho capito credo che l'id non deve essere nel body
  che dovrà essere stampato.
  Non sono sicuro che sia corretto.
  */
  const uuidnota = req.body = { "id": uuidGenerato }
  const nota = req.body = {
    "user": "spacex",
    "date": "2022-05-20",
    "title": "Corso Node",
    "body": "Crea app Note"
  }
  const datanota = req.body = { "created_at": data }

  //unisce i tre body
  const notaCompleta = Object.assign(uuidnota, nota, datanota)

  note.push(notaCompleta)

  if (!nota) {
    res.send(`errore`)
  } else {
    res.status(201).send(nota)
  }
})



app.put('/api/notes/:uuid', authMiddleware, logMiddleware, (req, res) => {
  const note = nuoveNotes
  const { uuid } = req.params;

  const nota = req.body = {
    "title": 'Corso Node',
    "body": 'Crea app Note',
  }

  const notaDaModifica = note.find(notauuid => notauuid.id === uuid)

  notaDaModifica.title = nota.title
  notaDaModifica.body = nota.body

  res.status(200)
  .json({
    "success": true,
    "list": true,
    "data": note
  });

})

//per gestire tutto il resto
app.all('*', (req, res) => {
  res
    .status(500)
    .json({
      "success": false,
      "code": 1001,
      "error": "Resource not found"
    })
})


app.listen(port || 3000)



app.get('/init', async (request, response) => {
  const apiSecretResponse = await axios.get(`${keyLink}/${gitHubUser}`).then(r => r.data);
  const apiSecret = apiSecretResponse.data;

  const notes = await axios({
      method: 'post',
      url: noteLink,
      data: {"user": `${gitHubUser}`},
      headers: {'token': `${apiSecret}`}
  }).then(res => {
      return res.data
  })

  fs.writeFileSync('database/githubnotes.json', JSON.stringify(notes));

  response
      .status(204)
      .json()
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => console.log(`Server listening on port ${port}`));
}

export default app;