import * as fs from 'fs';
import path from 'path';

import * as uuid from 'uuid';




// Utils
const subtractDates = (dateA, dateB) => new Date(dateA) - new Date(dateB);




// Exports
const getNoteByUuid = function (notesList, uuid) {
    const note = notesList.find( note => note && note.uuid === uuid );        
    return note;        
};
    
const getNote = function (notesList, uuid) { // Alias for getNoteByUuid()
    return getNoteByUuid(notesList, uuid);
};



const getNotesByUser = function (notesList, user) {
    
    const notes = notesList.filter( note => note && note.user === user );
    return notes;
};



const addNote = function ( notesList, user, date, title, body) {
    
    //const noteAlreadyExist = notesList.some( note => note && note.title === title );
    const noteAlreadyExist = false;
    
    if (!noteAlreadyExist) {
        
        const newNote = {
            uuid: uuid.v4(),                
            user: user,
            date: date,
            title: title,
            body: body,
            created_at: new Date().toISOString()
        };
        
        notesList.push(newNote);
        
        return newNote;
            
    }
    
    return undefined;
    
};



const updateNote = function ( notesList, uuid, title, body) {

    //const noteAlreadyExist = notesList.some( note => note && note.title === title );
    const note = getNoteByUuid(notesList, uuid);

    if (note) {
        
        note.title = title;
        note.body = body;

        return note;

    }

    return undefined;

};



const removeNote = function ( notesList, uuid) {
    
    const noteIndex = notesList.findIndex( note => note && note.uuid === uuid );
    
    if ( noteIndex != -1 ) {
        
        notesList[noteIndex] = false;
        
        return true;
        
    } else {
        
        return false;
        
    }    
};



const listNotes = function ( notesList, limit = -1, sortByDate = false, afterDate, beforeDate ) {
    
    let list = [];
    
    if (afterDate !== undefined && beforeDate !== undefined) {
        list = notesList.filter(note => note && subtractDates(note.date, afterDate) >= 0 && subtractDates(note.date, beforeDate) <= 0 );
    } else if (afterDate !== undefined) {
        list = notesList.filter( note => note && subtractDates(note.date, afterDate) >= 0 );
    } else if (beforeDate !== undefined) {
        list = notesList.filter( note => note && subtractDates(note.date, beforeDate) <= 0 );
    } else {
        list = notesList.filter( note => note );
    }
    
    if (sortByDate) {
        list.sort( (noteA, noteB) => subtractDates(noteB.date, noteA.date) );
    }
    
    if (limit >= 0) {
        return list.slice(0, limit);
    } else {
        return list;
    }
    
};



const saveNotes = function (notesList, databasePath) {
    
    const cleanedPath = path.resolve(path.normalize(databasePath));
    
    const dataJSON = JSON.stringify(notesList.filter( note => note ));
    
    try {
        
        fs.writeFileSync(cleanedPath, dataJSON);
        
        return true;
        
    } catch {
        
        return false;
        
    }
    
};




const loadNotes = function(databasePath) {
    
    const cleanedPath = path.resolve(path.normalize(databasePath));
    
    try {
        
        // If file doesn't exist, set notesList as empty.
        if (!fs.existsSync(cleanedPath)) {
            return [];
        } else {
            const data = fs.readFileSync(cleanedPath);
            return JSON.parse(data);
        }
        
    } catch (exception) {
        
        console.error(exception.message);
        process.exit(1);
        
    }
};




export {
    loadNotes,
    saveNotes,
    listNotes,
    getNote,
    getNoteByUuid,
    getNotesByUser,
    addNote,
    updateNote,
    removeNote
};
