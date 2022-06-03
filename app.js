import express from "express";
import 'dotenv/config';
import admin from "./routes/admins.route.js";
import logMiddleware from "./middlewares/log.middleware.js";
import noteService from "./services/note.service.js";
import authMiddleware from "./middlewares/auth.middleware.js";
import notFoundMiddleweare from "./middlewares/notFound.middleweare.js";
const app = express()

app.listen(process.env.PORT || 3000)
app.use(logMiddleware)

app.use(express.json())
app.use(admin)

// /api/notes/:uuid GET
app.get('/api/notes/:uuid', function (request, response) {
    const { uuid } = request.params
    response
        .status(200)
        .contentType('application/json')
        .send({
            "success": true,
            "single": true,
            "data": [(noteService.getById(uuid))]
        });
})

// /api/notes?date=2023-10-01 GET

// /api/notes?limit=2 GET 
app.get('/api/notes', function (request, response, next) {
    if (!request.query.date && !request.query.limit) {
        response
            .status(200)
            .send({
                "success": true,
                "list": true,
                "data": (noteService.getAllNotes())
            })
    } else {
        next()
    }
}, authMiddleware, function (request, response) {
    if (request.query.date) {
        response
            .status(200)
            .send({
                "success": true,
                "list": true,
                "data": (noteService.getByDate(request.query.date))
            })

    }
    if (request.query.limit) {
        response
            .status(200)
            .send({
                "success": true,
                "list": true,
                "data": (noteService.getByLimit(request.query.limit))
            })

    }
})





// /api/notes POST
.post(authMiddleware,logMiddleware, function (request, response)
{
    let newId = generateUUID()
    let newUser = request.body.user;
    let newDate = request.body.date;
    let newTitle = reques.body.title;
    let newBody = request.body.body;
    let newNote= {
        "id":newId,
        "user":newUser,
        "date": newDate,
        "title":newTitle,
        "body":newBody

    }

    let notes = getAllNotes().data

    notes.push(newNote)

})


// /api/notes/:uuid PUT

// /api/admin/user-stats/:user GET

app.use(notFoundMiddleweare)
