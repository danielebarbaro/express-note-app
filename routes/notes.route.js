import express from 'express';
import logMiddleware from "../middlewares/log.middleware.js";
import authMiddleware from '../middlewares/auth.middleware.js';
import * as core from "../services/core.service.js";
import {v4 as generateUUID} from 'uuid';
import {saveNotes, importNotes} from '../services/note.service.js';
import {oneOf, param, query, validationResult, check} from 'express-validator';

const notesRoute = express.Router(); 

/* 
Si ringrazia Simone Oliva per il contributo dato sulla gestione delle rotte con la data e il limite di note 
e Lorenzo Avondo per aver aiutato a risolvere il problema delle rotte /notes?=parametro non funzionante
*/

// Inizializza la lista delle note con i dati del file json
notesRoute.get('/initialize', logMiddleware,(req, res) => 
{
    try
    {
        core.importNotes();
    }
    catch(error)
    {
        console.log(error)
        res.status(500)
        .json
        ({
            "error" : error,
        })
    }
})

// Read: Restituisce tutte le note. Se viene specificato anche il parametro date, restituisce le note create dopo tale data
// mentre il parametro limit il numero di note da restituire, ordinate dalla più recente.
notesRoute.get('/api/notes', logMiddleware,async (req, res, next) =>
{
    // controllo del path. Caso 1: nessun parametro. /api/notes
    if(!req.query.date && !req.query.limit)
    {
        res.status(200)
        .json
        ({
            "success" : true,
            "list" : true,
            "data":importNotes()
        })
    }
    else 
    { 
        next();
    }
    // Usato il metodo trim per rimuovere gli spazi iniziali e finali
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim
    // oneOf: metodo di express-validator che permette di controllare che sia presente almeno uno degli elementi specificati all'interno
}, 
authMiddleware, oneOf([query('date').trim().isDate(),query('limit').isNumeric()]), logMiddleware, async (req, res) => 
    {
        // validazione dei parametri. Se invalidi -> bad request
    const error = validationResult(req);
    if(!error.isEmpty())
    {
        res.status(400)
        .json
        ({
            success: false,
            error: error.array()
        })
    }
    // Caso 2: parametro date.controlla la presenza di ?date=aaaa-mm-gg
    if(req.query.date && !req.query.limit)
    {
        let date = req.query.date;
        console.log("Notes created after this date: ",date);
        let filterByDate = importNotes().filter(note => new Date(note.date) > new Date(date))
        console.log()
        res.status(200)
        .json
        ({
            "success" : true,
            "filtered" : true,
            "data" : [filterByDate]
        })
    }
    // Caso 3: parametro limit.controlla la presenza di ?limit=numeroIntero
    else if (req.query.limit && !req.query.date)
    {
        let limit = req.query.limit;
        console.log("Returned notes, sorted by most recent: ",limit)
        let notesByLimit = importNotes().sort((a,b) =>
        {
            // ordina le note in ordine decrescente. preso da: https://www.codegrepper.com/code-examples/javascript/
            //                                                 sort+of+array+in+descending+order+in+nodejs
            new Date(b.date) - new Date(a.date)
        });
        res.status(200)
        .json
        ({
            success: true,
            // lascia solo il numero di note richiesto. Fonte: https://developer.mozilla.org/en-US/docs/Web/JavaScript/
            //                                                 Reference/Global_Objects/Array/slice?retiredLocale=it
            data : notesByLimit.slice(-limit)
        })
    }
    else 
    {
        res.status(400)
        .json
        ({// errore bad request se i parametri non sono validi

            success: false,
            error: 'Bad request'
        })
    }
})

    
    // Create: Crea una nuova nota
notesRoute.route('/api/notes') // aggiunta la parte di validazione e il bail per interrompere i test se uno fallisce.
.post(authMiddleware, logMiddleware,[check('body').isLength(100).bail().isString().bail(), check('title').isLength(100).bail().isString().bail()],
(req, res) => 
    {
        // generateUUID consente di generare un UUID al momento della creazione. E' stato preso da https://www.npmjs.com/package/uuid
        const newUUID = generateUUID()
        const newUser = req.body.user;
        const newDate = req.body.date;
        const newTitle = req.body.title;
        const newBody = req.body.body;
        const error = validationResult(req);
        if(!error.isEmpty())
        {
            res.status(400)
            .json
            ({
                success: false,
                error: error.array()
            })
        }
        // Reg Ex vista in classe
        const createdAt = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')
        const structNote = 
        {
            // crea nuovo oggetto nota
            "id": newUUID,
            "user" : newUser,
            "date" : newDate,
            "title" : newTitle,
            "body" : newBody,
            "created_at" : createdAt
        }
    
        let notesList = importNotes()
        
        // Inserisce la nuova nota in fondo alla lista
        notesList.push(structNote)
        
        // Salva la lista aggiornata
        //saveNotes(notesList)
    
        // nella risposta mostra la nuova nota creata e il codice 201
        res.status(201).json
        ({
            "id": newUUID,
            "user" : newUser,
            "date" : newDate,
            "title" : newTitle,
            "body" : newBody
        })
    })

    // Read: cerca una nota, prendendo lo UUID dalla request. Importante: scrivere lo UUID subito dopo lo / senza mettere i :
notesRoute.route('/api/notes/:uuid').get(param('uuid').isLength({min: 36, max:36}), logMiddleware,(req, res) => // controlla la lunghezza dell'uuid
    {
        let uuid = req.params.uuid;
        const error = validationResult(req); // verifica errori nei parametri passatti nella richiesta
        let notesList = importNotes();
        if(!error.isEmpty())
        { // Se express-validator trova un errore, ritorna una bad request
            res.status(400).json
            ({
                success: false,
                error: error.array()
            })
        } 
        const nota = listNotes.find(note => note.id === uuid)
        delete nota.created_at // visto in classe. Elimina la data di creazione dal body della nota nella response
        res.status(200)
            .json
            ({
            "success" : true,
            "single" : true,
            "data" : nota
            });
    })
    
    // Update: Modifica una nota
    .put(param('uuid').isLength({min: 36, max:36}), authMiddleware, logMiddleware,(req, res) => 
    {

        let notesList = importNotes();
        let uuid = req.params.uuid;
        let title = req.body.title;
        let body = req.body.body;

        // memorizza i dati della nota che si sta modificando, li recupera cercando l'uuid corrispondente
        let selectedNote = notesList.find(note => note.id === uuid)

        const error = validationResult(req); 
        if(!error.isEmpty())
        {
            res.status(400).json
            ({
                success: false,
                error: error.array()
            })
        }
        
        let modifiedNote;
    
        // errore se si cerca di modificare una nota che non esiste
        if(selectedNote === undefined)
        {
            res.status(404).json
            ({
                "success" : false,
                "error": "Note does not exist" 
            })
        }
        else
        {
            modifiedNote = 
            {
                "id": uuid,
                "user" : selectedNote.user,
                "date" : selectedNote.date,
                "title" : title,
                "body" : body,
                "created_at": selectedNote.created_at
            }
        }
        // la nota da modificare viene rimossa dalla lista delle altre note
        let modifiedNoteList = notesList.filter( note => note.id !== uuid); 
        // la nota modificata viene aggiunta alla lista delle altre note
        modifiedNoteList.push(modifiedNote);
        //saveNotes(modifiedNoteList)
        res.status(200).json
        ({
            "title" : modifiedNote.title,
            "body": modifiedNote.body,
            "data": modifiedNoteList
        })
    
    })


export default notesRoute;