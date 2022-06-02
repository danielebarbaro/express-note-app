import * as fs from 'fs';
import path from 'path';

import * as uuid from 'uuid';



// Utils
const subtractDates = (dateA, dateB) => new Date(dateA) - new Date(dateB);



class NoteBoard {
    
    // Attributes
    #databasePath = '';
    #notesList = [];
    
    
    
    // Methods
    getNoteByUuid (uuid) {
        const note = this.#notesList.find( note => note && note.uuid === uuid );        
        return note;        
    }
        
    getNote (uuid) { // Alias for getNoteByUuid()
        return this.getNoteByUuid(uuid);
    }
    
    
    
    getNotesByUser (user) {
        
        const notes = this.#notesList.filter( note => note && note.user === user );
        return notes;
    }
    
    
    
    addNote (user, date, title, body) {
        
        //const noteAlreadyExist = this.#notesList.some( note => note && note.title === title );
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
            
            this.#notesList.push(newNote);
            
            //this.saveNotes();
            
            return newNote;
                
        }
        
        return undefined;
        
    }
    
    
    
     updateNote (uuid, title, body) {

        //const noteAlreadyExist = this.#notesList.some( note => note && note.title === title );
        const note = this.getNoteByUuid(uuid);

        if (note) {
            
            note.title = title;
            note.body = body;
                        
            //this.saveNotes();

            return note;

        }

        return undefined;

    }
    
    
    
    removeNote (uuid) {
        
        const noteIndex = this.#notesList.findIndex( note => note && note.uuid === uuid );
        
        if ( noteIndex != -1 ) {
            
            this.#notesList[noteIndex] = false;
            
            //this.saveNotes();
            
            return true;
            
        } else {
            
            return false;
            
        }    
    }
    
    
    
    listNotes ( limit = -1, sortByDate = false, afterDate, beforeDate ) {
        
        let list = [];
        
        if (afterDate !== undefined && beforeDate !== undefined) {
            list = this.#notesList.filter(note => note && subtractDates(note.date, afterDate) >= 0 && subtractDates(note.date, beforeDate) <= 0 );
        } else if (afterDate !== undefined) {
            list = this.#notesList.filter( note => note && subtractDates(note.date, afterDate) >= 0 );
        } else if (beforeDate !== undefined) {
            list = this.#notesList.filter( note => note && subtractDates(note.date, beforeDate) <= 0 );
        } else {
            list = this.#notesList.filter( note => note );
        }
        
        if (sortByDate) {
            list.sort( (noteA, noteB) => subtractDates(noteA.date, noteB.date) );
        }
        
        if (limit >= 0) {
            return list.slice(0, limit);
        } else {
            return list;
        }
        
    }
    
    
    
    saveNotes () {
        
        const dataJSON = JSON.stringify(this.#notesList.filter( note => note ));
        
        try {
            
            fs.writeFileSync(this.#databasePath, dataJSON);
            
            return true;
            
        } catch {
            
            return false;
            
        }
        
    }
    
    
    
    // Private methods
    /*
    // Node.js doesn't support private methods yet, so we need an ugly hack!
    loadNotes () {
        
        try {
            
            // If directory doesn't exist, create it.
            if (!fs.existsSync(this.#databasePath)) {
                
                fs.mkdirSync(this.#databasePath);
                
            } else {
                
                fs.readdirSync(this.#databasePath); // fs.existsSync non distingue tra cartelle e file. Se this.#databasePath dovesse essere un file tentare di leggere il suo contenuto come cartella causerà un eccezione (che è quello che vogliamo in questo caso).
                
            }
            
            
            // If file doesn't exist, set notesList as empty.
            if (!fs.existsSync(this.#notesListPath)) {
                
                //this.#notesList = [];
                return [];
                
            } else {
                
                const data = fs.readFileSync(this.#notesListPath);
                //this.#notesList = JSON.parse(data);
                return JSON.parse(data);
                
            }
            
        } catch (exception) {
            
            console.error(exception.message);
            process.exit(1);
            
        }
    }
    */
    #loadNotes; // Ugly hack - Part 1.
    
    
    // Constructor
    constructor(databasePath = './database/noteslist.json') {
        
        // Ugly hack - Part 2 (define private methods here).
        this.#loadNotes = function() {
            try {
                
                // If file doesn't exist, set notesList as empty.
                if (!fs.existsSync(this.#databasePath)) {
                    return [];
                } else {
                    const data = fs.readFileSync(this.#databasePath);
                    return JSON.parse(data);
                }
                
            } catch (exception) {
                
                console.error(exception.message);
                process.exit(1);
                
            }
        };
        
        
        // Initialize attributes
        this.#databasePath = path.resolve(path.normalize(databasePath));
        
        this.#notesList = this.#loadNotes();
        
    }
        
}



export {
    NoteBoard
}
