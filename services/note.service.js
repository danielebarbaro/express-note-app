import fs from 'fs';

const getAllNotes = function () {
    try {
        const data = fs.readFileSync('database/githubnotes.json')
        const result = data.toString()
        return JSON.parse(result).data
    } catch (e) {
        return []
    }
}

const getById = function (uuid) {
    try {

        const notes = fs.readFileSync('database/githubnotes.json')
        const resoult = notes.toString()
        return JSON.parse(resoult).data.find(item => item.id === uuid)
    } catch (e) {
        return []
    }

}
const getByDate = function (date) {
    try {
        const notes = fs.readFileSync('database/githubnotes.json')
        const resoult = JSON.parse(notes.toString()).data
        let data = resoult.filter(item => new Date(item.date) > new Date(date))
        return data;
    } catch (e) {
        return []
    }

}
const getByLimit = function (limit) {
    try {
        const notes = fs.readFileSync('database/githubnotes.json')
        const resoult = JSON.parse(notes.toString()).data
        let data = resoult.sort((a, b) => new Date(b.date) - new Date(a.date))
        data = data.slice(-limit);
        return data
    } catch (e) {
        return []
    }

}


export default {
    getAllNotes,
    getById,
    getByDate,
    getByLimit
}