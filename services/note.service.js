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

export{
    loadNotes
}