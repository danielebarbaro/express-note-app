import express from "express";
import authMiddleware from '.././middlewares/auth.middleware.js';
import axios from 'axios';
import noteService from '.././services/note.service.js';
import fs from 'fs';

const noteRoute = express.Router();


///api/notes - GET
noteRoute.get('/api/notes', function (req, res, next) {
    if (!req.query.date && !req.query.limit) {
        res
            .status(200)
            .contentType('application/json')
            .json({
                "success": true,
                "list": true,
                "data": (noteService.loadNotes())
            })
    } else { next() }
}, authMiddleware, function (req, res) {
    if (req.query.date) {
        res
            .status(200)
            .contentType('application/json')
            .json({
                "status": 'success',
                "single": true,
                "data": (noteService.getByDate(req.query.date))
            })
    }
    if (req.query.limit) {
        res
            .status(200)
            .send({
                "success": true,
                "list": true,
                "data": (noteService.getByLimit(req.query.limit))
            })
    }
})

///api/nodes/:uuid - GET
noteRoute.get('/api/notes/:uuid', function(req, res)
{
    const {uuid} = req.params
    res
    .status(200)
    .contentType('application/json')
    .json({
        status: 'success',
        single: true,
        data: (noteService.loadNotesUuid(uuid))
    })
})



///api/notes - POST


///api/notes/:uuid - PUT


export default noteRoute