import * as fs from 'fs';

const findNote = function (notes, title) {
    return notes.find(note => note.title === title);
}

const displayNote = function (note) {
    console.log('Nota \n\t', `${chalk.red(note.title)}: ${chalk.green(note.body)}`, '\n')
}

const errorHelper = function () {
    console.log('\n\t', chalk.red('Nota non trovata.'), '\n');
}

const addNote = function (title, body) {
    const notes = loadNotes();
    const noteExist = findNote(notes, title);

    if (!noteExist) {
        notes.push({
            title: title,
            body: body
        })
        // console.log('posso inserire la nota', '\n')
        // console.log('ora le note sono state modificare: ', notes)
        saveNotes(notes);
        console.log(chalk.green('Nota aggiunta con successo', '\n'));
    } else {
        console.log(chalk.red('Non puoi inserire la nota, esiste già.', '\n'));
    }
}



const listNotes = function () {
    const notes = loadNotes();

    notes.map(note => {
        displayNote(note); // o in alternativa le righe seguenti:
        // const title = chalk.green(note.title);
        // const body = chalk.red(note.body);
        // console.log('\t', `${title} - ${body}`, '\n');
    })
    // console.log(notes, chalk('questo messaggio Lista note'), '\n');
}

const readNote = function (title) {
    const notes = loadNotes();
    const noteExist = findNote(notes, title);
    if (noteExist) {
        displayNote(noteExist);
    } else {
        errorHelper();
    }
}

const saveNotes = function (notes) {
    const dataJSON = JSON.stringify(notes)
    fs.writeFileSync('database/notes.json', dataJSON)
}

const loadNotes = function () {
    try {
        const data = fs.readFileSync('database/notes.json')
        const result = data.toString()
        return JSON.parse(result)
    } catch (e) {
        // console.log('ERRORE file non trovato', e.message)
        return []
    }
}

export {
    addNote,
    removeNote,
    listNotes,
    readNote
}