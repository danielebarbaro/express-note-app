/*const axios = require('axios');
const fs= require('fs');

const getAllNotes = function () {
    try{
        const notes = JSON.parse(fs.readFileSync('githubnotes.json'));
        console.log(notes);
    }
    catch(error){
        console.log(error);
    }
};

const getNoteByUuid = function (uuid) {
    try {
        const notes = JSON.parse(fs.readFileSync('githubnotes.json'));
        return notes.data.find(note => note.id === uuid);
    } catch(error){
        console.log(error);
    }
};

const getNoteByDate = function (dateInput) {
    const date= new Date();  
    date.setFullYear(dateInput);
    try {
        const notes = JSON.parse(fs.readFileSync('githubnotes.json'));
        return notes.data.filter(note => new Date(note.date)  > new Date(date));
    } catch (error) {
        console.log(error);
    }
}

const getNoteByLimit = function (limit) {
    try {
        const notes = JSON.parse(fs.readFileSync('githubnotes.json'));
        return notes.data.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(-limit);
    } catch (error) {
        console.log(error);
    }
}

export default {
    getAllNotes,
    getNoteByUuid,
    getNoteByDate,
    getNoteByLimit,
}
*/