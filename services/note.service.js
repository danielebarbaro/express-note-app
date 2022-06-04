import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// In caso di badRequest
const badRequest = () => {
    return {
        success: false,
        code: 2000,
        error: "Bad request"
    }
}

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

// Crea una nuova nota
const newNote = async function (body) {
    
    let note = {
        id: uuidv4(),
        user: body.user,
        date: body.date,
        title: body.title,
        body: body.body,
        created_at: body.created_at
    }

    let data = JSON.parse(fs.readFileSync('./database/githubnotes.json'))
    fs.writeFileSync('database/githubnotes.json', JSON.stringify(data))
    return note
}

// Modifica una nota
const updateNote = async function (note, body) {

    // Modifica il title
    if (('title' in body)) {
        note.title = body.title
    }
    // Modifica il body
    if (('body' in body)) {
        note.body = body.body
    }

    let result = {
        success: true,
        single: true,
        data: [
            {
                id: note.id,
                user: note.user,
                date: note.date,
                title: note.title,
                body: note.body,
                created_at: note.created_at
            }
        ]
    }

    let updated = await getAll()
    updated = updated.filter(a => a.id !== note.id)
    updated.push(note)

    fs.writeFileSync('./database/githubnotes.json', JSON.stringify(updated))

    return result
}

export default {
    badRequest,
    getAll,
    getNoteByUuid,
    getNoteByDate,
    getNoteByLimit,
    newNote,
    updateNote
}