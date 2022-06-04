import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import axios from 'axios';
import noteService from '../services/note.service.js';
import fs from 'fs';
import { body, check, oneOf, param, query, validationResult } from 'express-validator';

const noteRoute = express.Router();

// [GET] - api/notes - Restituisce tutte le note
noteRoute.get(
    '/api/notes',
    function (req, res, next) {

        if (!req.query.date && !req.query.limit) {
            
            res
                .status(200)
                .contentType('application/json')
                .json({
                    "success": true,
                    "list": true,
                    "data": (noteService.getAll())
                })
        } else { next() } 
    }, authMiddleware, function (req, res) {
        if (req.query.date) {
            res
                .status(200)
                .contentType('application/json')
                .json({
                    "status": "success",
                    "single": true,
                    "data": (noteService.getNoteByDate(req.query.date))
                })
        }
        if (req.query.limit) {
            res
                .status(200)
                .send({
                    "success": true,
                    "list": true,
                    "data": (noteService.getNoteByLimit(req.query.limit))
                })
        }
    }
)

// [GET] - api/notes/:uuid - Restituisce la nota con uuid passato come parametro
noteRoute.get(
    '/api/notes/:uuid',
    function(req, res) {

        const { uuid } = req.params
        res
            .status(200)
            .contentType('application/json')
            .json({
                "status": 'success',
                "single": true,
                "data": (noteService.getNoteByUuid(uuid))
            })
    }
)

// [POST] - api/notes - Aggiunge una nota
noteRoute.post(
    '/api/notes',
    authMiddleware,

    body('user').isAlphanumeric(),
    body('date').isDate(),
    body('title').isString(),
    body('body').isString(),

    async (req, res) => {

        res
            .status(201)
            .json(noteService.newNote(body))
    }
)

export default noteRoute