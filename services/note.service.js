import fs from 'fs'
import {v4 as uuidv4} from 'uuid';

let notesJson = fs.readFileSync('./database/githubnotes.json')
const notes = JSON.parse(notesJson.toString()).data;

const getAll = () => notes;

const getOneById = (uuid) => notes.find(x=>x.id===uuid);

//const getByUser = (user) => notes.filter(x=>x.user===user);

const getFiltered = (date,limit) =>{
    var data = notes;
    var jsonReturn = {
        success: true
    }
    if(date){
        jsonReturn.filtered = true;
        data = data.filter(x=> new Date(date)<new Date(x.date))
    }
    if(limit){
        data = data.sort((a,b)=>new Date(b.date) - new Date(a.date))
        data = data.slice(data.length-limit,data.length)
    }
    jsonReturn.data = data;
    return jsonReturn;
}

/*const getAdminUserStats = (user) =>{
    let data = getByUser(user);
    let datas = data.array.forEach(element => {
        return {
            date: element.date,
            title: element.title,
            body: element.body
        }
    });
    return {
        success: true,
        data: [
            {
                user: datas
            }
        ]
    }
}*/

const createOne = (body) =>{
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
    data['count']=data['count']+1
    fs.writeFileSync('./database/githubnotes.json',JSON.stringify(data))
    return item;
}

const updateOneById = (uuid,body) =>{
    var item = getOneById(uuid);
    var jsonReturn = {
        succes:true,
        single:true,
        data:[
            {
                id: item.id,
                user: item.user,
                date: item.date,
            }
        ]
    }
    if('title' in body)
        jsonReturn.data[0].title = body.title
    else
        jsonReturn.data[0].title = item.title
    if('body' in body)
        jsonReturn.data[0].body = body.body
    else
        jsonReturn.data[0].body = item.body
    return jsonReturn;
}

const badRequest = () =>{
    return {
        success: false,
        code: 2000,
        error: "Bad request"
    };
}

export default{
    getAll,
    getOneById,
    getFiltered,
    createOne,
    updateOneById,
    badRequest
}