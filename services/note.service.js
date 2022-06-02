import fs from 'fs'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

let notes = null;

const writeNotes = async() => {
    let key = await axios.get(process.env.URL).then(resp => resp.data.data);
    let data = await axios({
        method: 'post',
        url: 'https://its.dbdevelopment.tech/notes',
        data: {
            "user": `${process.env.USER}`
        },
        headers: {
            'token': `${key}`
        }
    }).then(res => {
        return JSON.stringify(res.data)
    })
    fs.writeFileSync('database/githubnotes.json', data)
    await readNotes();
}

const readNotes = async () => {
    try{
        let notesJson = fs.readFileSync('./database/githubnotes.json')
        notes = JSON.parse(notesJson.toString()).data;
    }catch(err){
        await writeNotes()
    }
}

const getAll = async () => {
    if (notes === null || !notes)
        await readNotes();
    return notes
}

const getOneById = async (uuid) => {
    if (notes === null || !notes)
        await readNotes();
    return notes.find(x => x.id === uuid)
}

const getByUser = async (user) => {
    if (notes === null || !notes)
        await readNotes();
    return notes.filter(x => x.user === user)
}

const getFiltered = async (date, limit) => {
    if (notes === null || !notes)
        await readNotes();
    var data = null;
    var jsonReturn = {
        success: true
    }
    if (date) {
        jsonReturn.filtered = true;
        data = notes.filter(x => new Date(date) < new Date(x.date))
    }
    if (limit) {
        data = notes.sort((a, b) => new Date(b.date) - new Date(a.date))
        data = data.slice(- limit)
    }
    jsonReturn.data = data;
    return jsonReturn;
}

const getAdminUserStats = async (user) => {
    if (notes === null || !notes)
        await readNotes();
    let userNotes = await getByUser(user);
    let userNotesTrunk = getNotesTrunk(userNotes);
    let result = {};
    result.success = true
    let userData = {};
    userData[user] = userNotesTrunk;
    result.data = [userData]
    return result;
}

const getNotesTrunk = (userNotes) =>{
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
    if (notes === null || !notes)
        await readNotes();
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

const updateOneById = async (uuid, body) => {
    if (notes === null || !notes)
        await readNotes();
    var item = getOneById(uuid);
    var jsonReturn = {
        succes: true,
        single: true,
        data: [
            {
                id: item.id,
                user: item.user,
                date: item.date,
            }
        ]
    }
    if ('title' in body)
        jsonReturn.data[0].title = body.title
    else
        jsonReturn.data[0].title = item.title
    if ('body' in body)
        jsonReturn.data[0].body = body.body
    else
        jsonReturn.data[0].body = item.body
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
    getAdminUserStats
}