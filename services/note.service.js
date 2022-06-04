import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

// Restituisce tutte le note
const getAll = function () {
    try {
        const allNotes = fs.readFileSync('database/githubnotes.json')
        const result = allNotes.toString()
        return JSON.parse(result).data
    } catch (e) {
        return [];
    }
}

// Restituisce la nota con uuid passato come parametro
const getNoteByUuid = function (uuid) {
    try {
        const allNotes = fs.readFileSync('database/githubnotes.json')
        const result = allNotes.toString()
        return JSON.parse(result).data.find(note => note.id === uuid)
    } catch (e) {
        return []
    }
}

// Restituisce la nota con "?date="
const getNoteByDate = function (date) {
    try {
        const note = JSON.parse(fs.readFileSync('database/githubnotes.json'))
        return note.data.filter(note => new Date(note.date) > new Date(date))
    } catch (e) {
        return[]
    }
}

// Restituisce la nota con "?limit="
const getNoteByLimit = function (limit) {
    try {
        const note = JSON.parse(fs.readFileSync('database/githubnotes.json'))
        return note.data.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(-limit)
    } catch (e) {
        return []
    }
}

const newNote = function (body) {
    
    const note = {
        "id": uuidv4(),
        user: body.user,
        date: body.date,
        title: body.title,
        body: body.body,
        //created_at: body.created_at
    }

    return note
}

export default {
    getAll,
    getNoteByUuid,
    getNoteByDate,
    getNoteByLimit,
    newNote
}