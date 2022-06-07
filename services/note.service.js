import fs from 'fs'

const loadNotes = function ()
{
    try
    {
        const notes = fs.readFileSync(`database/githubnotes.json`)
        const result = notes.toString()
        return JSON.parse(result).data
    }
    catch (e)
    {
        return[]
    }
}


const loadNotesUuid = function (uuid)
{
    try
    {
        const notes = fs.readFileSync(`database/githubnotes.json`)
        const result = notes.toString()
        return JSON.parse(result).data.find(item => item.id === uuid)
    }
    catch (e)
    {
        return[]
    }
}

    
const getByDate = function (date) 
{
    try{
        const notes = fs.readFileSync(`database/githubnotes.json`)
        const result = notes.toString()
        
        let data = JSON.parse(result).data
        data = data.filter(item => new Date(item.date) > new Date(date))
        return data;
    } 
    catch (e) 
    {
        return []
    }
}


const getByLimit = function (limit) 
{
    try {
        const note = JSON.parse(fs.readFileSync('database/githubnotes.json'))
        return note.data.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(-limit)
    } catch (e) {
        return []
    }
}




export default {
    loadNotes, 
    loadNotesUuid, 
    getByDate, 
    getByLimit
}