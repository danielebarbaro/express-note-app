import express from "express";
import 'dotenv/config';
import logMiddleware from "./middlewares/log.middleware.js";// ricordarsi di aggiungere .js (VS code non mette l'estensione)
import notesRoute from "./routes/notes.route.js";
import adminsRoute from "./routes/admins.route.js";
import fs from "fs";

/*
nodemon è un pacchetto scaricato da npm che permette di riavviare il server dopo aver fatto modifiche ai file. 
per bloccare il processo premere ctrl+c nel terminale e dovremmo farlo tutte le volte che facciamo modifiche al server se non avessimo nodemon. 

in package.json c'è una proprietà "start". A dx c'è il comando che viene eseguito se scriviamo star nel terminale. Es: start: ciao come va. 
Qua se scriviamo start lui inuptta nodemon app.js
l' indirizzo del server è http://localhost:5050 (rotte aggiuntive non incluse). NON pushare assolutamente sul repo il file .env (contiene password). Copiare .env.sample 
e rinominarlo in .env

Chiamare in GET quest' URL per ricevere la API key: https://its.dbdevelopment.tech/key/@Rdxv
Chiamare in POST quest' URL https://its.dbdevelopment.tech/notes per ricevere le note, passando nella request user: @Rdxv e token: laChiaveAPI
installare express-validator: npm install express-validator da qui: https://www.npmjs.com/package/express-validator per verificare che i parametri passati nella richiesta siano corretti 
installare uuid per autogenerare gli id delle note: https://www.npmjs.com/package/uuid
*/

const port = process.env.PORT // port è una variabile che viene dal file .env 
const app = express()

app.use(express.json())
app.use(notesRoute);
app.use(adminsRoute);
/*app.use(logMiddleware);
  app.use(authMiddleware); così diciamo all'app di usare sempre questi middleware, 
                           ma non lo facciamo perchè non tutte le rotte devono usare tutti i middleware, 
                           alcune non ne usano affatto.*/

// https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded#:~:text=b.-,express.,use(express.
app.use(express.urlencoded({extended : false}));
app.use(function(req, res, next)
{
    res.status(404).json
    ({
        "success": false,
        "code": 1001,
        "error": "Resource not found"
    });
});
app.get('/', logMiddleware, (request, response) => 
{
    response.send('Path iniziale del progetto forkato');
    
})
    
app.listen(port || 3000)// scegli tra la porta che viene dal .env o la 3000
