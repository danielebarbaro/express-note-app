import fs from 'fs';

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

const getNoteByDate = function (date) {
    try {
        const note = JSON.parse(fs.readFileSync('database/githubnotes.json'))
        const result = note.toString()

        let data = JSON.parse(result).data;
        data = data.filter(note => new Date(note.date) > new Date(date))
        
        return data;
    } catch (e) {
        return[]
    }
}

const getNoteByLimit = function (limit) {
    try {
        const note = fs.readFileSync('database/githubnotes.json')
        const result = JSON.parse(note.toString()).data
        const data = result.sort((a, b) => new Date(b.date) - new Date(a.date))
        data = data.slice(-limit)
        return data
    } catch (e) {
        return []
    }
}

export default {
    getAll,
    getNoteByUuid,
    getNoteByDate,
    getNoteByLimit
}