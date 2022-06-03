import fs from 'fs';

const loadnote = (uuid) => {
    try {
        const data = fs.readFileSync('database/githubnotes.json');
        const result = data.toString();
        return JSON.parse(result);
    } catch (a) {
        console.log('ERRORE file non trovato', a.message);
        writenote();
        return [];
    }
}


const findnote = function (notes, title) {
    return notes.find(note => note.title === title);
}

const savenote = function (notes) {
    const dataJSON = JSON.stringify(notes)
    fs.writeFileSync('database/githubnotes.json', dataJSON)
}

const writenote = function (title, body) {
    const noteExist = findnote(notes, title);

    if (!noteExist) {
        notes.push({
            title: title,
            body: body
        })
        savenote(notes);
        console.log(chalk.green('Nota aggiunta con successo', '\n'));
    } else {
        console.log(chalk.red('Non puoi inserire la nota, esiste già.', '\n'));
    }
}

const badrequest = function() {
    return {
        success: false,
        code: 403,
        error: "Bad request"
    };
}


    
export{
    loadnote,
    findnote,
    writenote,
    savenote,
    badrequest,
} 