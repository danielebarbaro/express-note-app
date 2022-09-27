import express from 'express';
import noteService from '../services/note.service.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const noteRoute = express.Router();

noteRoute.get('/api/notes',function (req, res) {
    res
        .status(200)
        .contentType('application/json')
        .json({
            "success": true,
            "list": true,
            "data": (noteService.getAllNotes())
        })
});


noteRoute.get('/api/notes/:uuid',function(req, res) {

    const { uuid } = req.params
        res
            .status(200)
            .contentType('application/json')
            .json({
                "status": 'success',
                "single": true,
                "data": (console.log(notes.data.find(note => note.id === uuid))
            })
    }
);


noteRoute.get('/api/notes/:date',function(req, res) {

    const { date } = req.params
        res
            .status(200)
            .contentType('application/json')
            .json({
                "status": 'success',
                "single": true,
                "data": (noteService.getNoteByDate(date))
        })
});


noteRoute.get('/api/notes/:limit',function(req, res) {

    const { limit } = req.params
    res
        .status(200)
        .contentType('application/json')
        .json({
            "status": 'success',
            "single": true,
            "data": (noteService.getNoteByLimit(limit))
        })
});

export default noteRoute;