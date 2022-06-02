import express from "express";
import authMiddleware from '.././middlewares/auth.middleware.js';
import notesService from '.././services/note.service.js';
import { body,check,oneOf,param,query, validationResult } from 'express-validator';

const notesRouter = express.Router();

notesRouter.get('/api/notes',
    async (req,res,next)=>{
        //request non autenticata
        //Se la query string non contiene filtri 
        if(!req.query.date & !req.query.limit)
            res.status(200)
            .json({'success' : true,
                'list' : true,
                'data' : await notesService.getAll()})
        else
            next();
    },
    authMiddleware,
    oneOf([query('limit').exists(),query('date').exists()]),
    async (req,res,next)=>{
        //request autenticata
        //Se la query string contiene i filtri date and/or limit
        try{
            validationResult(req).throw()
            res.status(200)
            .json(await notesService.getFiltered(req.query.date,
                                        req.query.limit)
                                        )
        }catch(err){
            res.status(400)
            .json(notesService.badRequest())
        }
        
    }
);

notesRouter.get('/api/notes/:uuid',param('uuid').isUUID(),async (req,res)=>{
    try{
        validationResult(req).throw()
        let note = await notesService.getOneById(req.params.uuid)
        if(note)
            res.status(200)
            .json({
                "success": true,
                "single": true,
                "data" : note
            })
        else
            res.status(400)
            .json(notesService.badRequest())
    }catch(err){
        res.status(400)
            .json(notesService.badRequest())
    }
    
})

notesRouter.post('/api/notes',authMiddleware,
    body('user').isAlphanumeric(),
    body('date').isDate(),
    body('title').isString(),
    body('body').isString(),
async (req,res)=>{
    try{
        validationResult(req).throw()
        //Se body contiene uuid = bad request
        if(('uuid' in req.body))
            res.status(400)
            .json(notesService.badRequest())
        //Se body non contiene tutti i dati = bad request
        if(!(('user') in req.body) ||
        (!('date') in req.body) ||
        (!('title') in req.body) ||
        (!('body') in req.body) ||
        !('created_at') in req.body)
            res.status(400)
            .json(notesService.badRequest())
        //Se il body contiene i dati esatti viene creato il nuovo oggetto
        res.status(201)
        .json(await notesService.createOne(req.body))
    }catch(err){
        res.status(400)
            .json(notesService.badRequest())
    }
    
})

notesRouter.put('/api/notes/:uuid',
    authMiddleware,
    async (req,res)=>{
            //Se body contiene uuid or user or date = bad request
            if(('uuid' in req.body) || ('user' in req.body) || ('date' in req.body) || ('created_at') in req.body)
                res.status(400)
                .json(notesService.badRequest())
            var item = await getOneById(uuid);
            if(!item)
                res.status(404).json({success:false});
            //Se il body contiene solo title and/or body viene aggiornato oggetto
            res.status(200)
            .json(await notesService.updateOneById(req.params.uuid,req.body))  
    }
)

export default notesRouter;