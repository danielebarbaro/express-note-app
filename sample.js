import express from "express";
import adminsRoute from "./routes/admins.route.js";
import notesRoute from "./routes/notes.route.js";
import {body, check, validationResult} from "express-validator";
import logMiddleware from "./middlewares/log.middleware.js";

const authMiddleware = (request, response, next) => {
    const {headers} = request;

    if (headers['secret'] === process.env.API_KEY) {
        next();
    } else {
        response
            .status(401)
            .contentType('application/json')
            .json({
                status: 'fail',
                code: 403,
                error: 'Unauthorized'
            });
    }
}


app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/api/admin', adminsRoute)
app.use('/api/notes', notesRoute)


app.post('/gigi',
    body('username').isString().isLength({min: 5}),
    body('date').isDate(),
    (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()});
        }
        console.log(request.body)
        response.send('Hello World')
    })

app.get('/banana',
    check('limit').isLength({ max: 2 }),
    (request, response) => {
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
            return response.status(400).json({errors: errors.array()});
        }
        console.log(request.body)
        response.send('Hello World')
    })
//
//
app.get('/', (request, response) =>
    response.send('Hello World')
)
//
// app.get('/notes/:uuid', logMiddleware, function (req, res) {
//     const {uuid} = req.params
//     res
//         .status(200)
//         .contentType('application/json')
//         .json({
//             status: 'success',
//             code: 123,
//             data: []
//         });
// })
//
app.all('*', logMiddleware, (req, res) => {
    res
        .status(404)
        .contentType('application/json')
        .json({
            status: 'fail',
            code: 123,
            error: 'Resource not found'
        });
})