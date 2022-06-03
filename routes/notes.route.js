import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import axios from 'axios';
import noteService from '../services/note.service.js';
import fs from 'fs';

const noteRoute = express.Router();

// [GET] - api/notes - Restituisce tutte le note
noteRoute.get(
    '/api/notes',
    function (req, res, next) {

        if (!req.query.date && req.query.limit) {
            
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

export default noteRoute