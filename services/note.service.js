import fs from 'fs'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

let notes = null;

const writeNotes = async () => {
    const noteLink = process.env.API_NOTES_LINK;
    const keyLink = process.env.API_KEY_LINK;
    const gitHubUser = process.env.GITHUB_USER;
    const apiSecretResponse = await axios.get(`${keyLink}/${gitHubUser}`).then(r => r.data);
    const apiSecret = apiSecretResponse.data;
    const note = await axios({
        method: 'post',
        url: noteLink,
        data: {"user": `${gitHubUser}`},
        headers: {'token': `${apiSecret}`}
    }).then(res => {
        return JSON.stringify(res.data)
    })
    fs.writeFileSync('database/githubnotes.json', note)
    await readNotes();
}

const readNotes = async () => {
    try {
        let notesJson = fs.readFileSync('./database/githubnotes.json')
        notes = JSON.parse(notesJson.toString()).data;
    } catch (err) {
        await writeNotes()
    }
}

const parseNotes = async(noteList) => {
    let list = [];
    noteList.forEach(note =>{
        list.push({
            id:note.id,
                        user:note.user,
                        date:note.date,
                        title:note.title,
                        body:note.body
        })
    })
    return list;
}

const getAll = async () => {
    if (notes === null || !notes) {
        await readNotes();
    }
    return notes
}

const getOneById = async (uuid) => {
    if (notes === null || !notes) {
        await readNotes();
    }
    return notes.find(x => x.id === uuid)
}

const getByUser = async (user) => {
    if (notes === null || !notes) {
        await readNotes();
    }
    return notes.filter(x => x.user === user)
}

const getFiltered = async (date, limit) => {
    if (notes === null || !notes) {
        await readNotes();
    }
    var data = null;
    var jsonReturn = {
        success: true
    }
    if (date) {
        jsonReturn.filtered = true;
        data = notes.filter(x => new Date(date) < new Date(x.date))
    }
    if (limit) {
        data = notes.sort((a, b) => new Date(a.date) - new Date(b.date))
        data = data.slice(- limit)
    }
    jsonReturn.data = await parseNotes(data);
    return jsonReturn;
}

const getAdminUserStats = async (user) => {
    if (notes === null || !notes) {
        await readNotes();
    }
    let userNotes = await getByUser(user);
    let userNotesTrunk = getNotesTrunk(userNotes);
    let result = {};
    result.success = true
    let userData = {};
    userData[user] = userNotesTrunk;
    result.data = [userData]
    return result;
}

const getNotesTrunk = (userNotes) => {
    let userNotesTrunk = []
    userNotes.forEach(element => {
        userNotesTrunk.push({
            date: element.date,
            title: element.title,
            body: element.body
        })
    })
    return userNotesTrunk;
}

const createOne = async (body) => {
    if (notes === null || !notes) {
        await readNotes();
    }
    let item = {
        id: uuidv4(),
        user: body.user,
        date: body.date,
        title: body.title,
        body: body.body,
        created_at: body.created_at
    }

    let data = JSON.parse(fs.readFileSync('./database/githubnotes.json'))
    data['data'].push(item);
    data['count'] = data['count'] + 1
    fs.writeFileSync('./database/githubnotes.json', JSON.stringify(data))
    return item;
}

const updateOneById = async (item, body) => {
    //aggiorno valori se presenti
    if ('title' in body) {
        item.title = body.title
    }
    if ('body' in body) {
        item.body = body.body
    }
    //creo json risposta
    var jsonReturn = {
        success: true,
        single: true,
        data: [
            {
                id: item.id,
                user: item.user,
                date: item.date,
                title: item.title,
                body: item.body,
                created_at: item.created_at
            }
        ]
    }
    //aggiorno database
    let data = JSON.parse(fs.readFileSync('./database/githubnotes.json'))
    let notesUpdate = await getAll();
    notesUpdate = notesUpdate.filter(x => item.id !== x.id);
    notesUpdate.push(item);
    data['data'] = notesUpdate;
    data['count'] = data['count'] + 1
    fs.writeFileSync('./database/githubnotes.json', JSON.stringify(data))
    return jsonReturn;
}

const badRequest = () => {
    return {
        success: false,
        code: 2000,
        error: "Bad request"
    };
}

export default {
    getAll,
    getOneById,
    getFiltered,
    createOne,
    updateOneById,
    badRequest,
    writeNotes,
    getAdminUserStats,
    parseNotes
}