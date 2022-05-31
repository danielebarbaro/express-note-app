import fs from 'fs';

const saveNote = (notes) => {
    fs.writeFileSync('./database/githubnotes.json', JSON.stringify(notes), "utf-8")
}

const notesLoader = () => {
    try {
        const data = fs.readFileSync('./database/githubnotes.json')
        const result = data.toString();
        return JSON.parse(result);
    } catch (e) {
        // console.log('ERRORE file non trovato', e.message)
        return [];
    }
} 

export{
    saveNote,
    notesLoader
}