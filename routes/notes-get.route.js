//IMPORTS

// Packages
import express from 'express';
import { query, param, validationResult } from 'express-validator';

// Notes
import * as core from '../core-notes.js';

// Middlewares
import logMiddleware from '../middlewares/log.middleware.js';
import authMiddleware from '../middlewares/auth.middleware.js';




// HELPERS
const filterObject = function ( obj, ...propertiesToRemove ) { // Parses "obj" and returns a deep copy keeping only the properties not listed in "propertiesToRemove".
    const newEntries = [];
	Object.entries(obj).forEach(
	    function ([ key, val ]) {
            if (!propertiesToRemove.includes(key)) newEntries.push([ key, val ])
        }
    );
	return Object.fromEntries(newEntries);
}



// SETUP
const notesGetRoute = express.Router();



// ROUTES
notesGetRoute.get(
    '/',
    function (request, reply, next) {
        
        if (request.query.date || request.query.limit) {
            authMiddleware(request, reply, next);
        } else {
            next();
        }

    }
);



notesGetRoute.get(
    '/',
    
    // Validation middleware
    query('limit').optional().isInt({ min: 0 }).toInt(),
    query('date').optional().isDate().toDate(),
    
    function (request, reply) {
        
        // Check validation results
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
           return reply.status(400).json({ errors: errors.array() });
        }
        
		let filtered = false;
		
		let limit = -1;
		let sortByDate = false;
		
		if (request.query.limit !== undefined) {
			limit = request.query.limit;
			sortByDate = true;
			filtered = true;
		}
		
		let afterDate = undefined;
		
		if (request.query.date !== undefined) {
			afterDate = request.query.date;
			filtered = true;
		}
        
        //const notes = request.app.locals.noteboard.listNotes(limit, sortByDate, afterDate);
        const notes = core.listNotes(request.app.locals.noteboard, limit, sortByDate, afterDate);
        
        reply.status(200).json({
            success: true,
			filtered: filtered,
            list: true,
            data: filtered ? notes.map( note => filterObject(note, 'created_at') ) : notes
        });
    }
);



notesGetRoute.get(
    '/:uuid',
    
    // Validation middleware
    param('uuid').isUUID(),
    
    function (request, reply) {
        
        // Check validation results
        const errors = validationResult(request);
        if (!errors.isEmpty()) {
           return reply.status(400).json({ errors: errors.array() });
        }
        
        //const note = request.app.locals.noteboard.getNote(request.params.uuid);
        const note = core.getNote(request.app.locals.noteboard, request.params.uuid);
        
		const {created_at, ...strippedNote} = note;
		
        if (note === undefined) {
            reply.sendStatus(404);
        } else {
            reply.status(200).json({
                success: true,
                single: true,
                data: [
                    filterObject(note, 'created_at')
                ]
            });
        }
        
    }
);



// EXPORTS
export default notesGetRoute;
