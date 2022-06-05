import fs from 'fs';

const loadNotes = () => {
    try {
        const data = fs.readFileSync('database/githubnotes.json');
        const result = data.toString();
        return JSON.parse(result);
    } catch (e) {
        console.log('ERRORE file non trovato', e.message);
        return [];
    }
}

var UUIDln = async function (uuid)
{
    try {
        uuid = uuid.replace(':', '');
        var jsonFinal = {};
        const UUIDn = fs.readFileSync(`database/githubnotes.json`);
        var parsedUUIDn = JSON.parse(UUIDn);
        var objectUUIDn = Object.values(parsedUUIDn);
        objectUUIDn.forEach((element) => {
            if(element['id'] == uuid){
                jsonFinal = element;
            }
        })

        return jsonFinal;
    } catch (e) {
        return {};
    }
}

var retrieveDate = async function (date)
{
    try {
        var jsonFinal = [];

        while(date.includes('-')){
            date = date.replace('-', '');
        }
        var dateInteger = parseInt(date);
        
        const data = fs.readFileSync(`database/githubnotes.json`);
        var parsedDate = JSON.parse(data);
        var objectDate = Object.values(parsedDate);
        objectDate.forEach((element) => {
            var thisDate = element['date'].toString();
            while(thisDate.includes('-')){
                thisDate = thisDate.replace('-', '');
            }
            var thisDateInteger = parseInt(thisDate);
            if(thisDateInteger > dateInteger){
                jsonFinal.push(element);
            }
        });
        return jsonFinal;
    } catch (e) {
        return [];
    }
}

export{
    loadNotes,
    UUIDln,
    retrieveDate
}