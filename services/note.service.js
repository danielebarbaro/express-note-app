/* 
Dietro consiglio di Pietro Chiartano, ho messo i metodi per la lettura, scrittura e modifica in
un file separato, così da poterli usare in tutti gli altri file. Idem per le chiamate al server.
*/

import fs from 'fs';

// importa le note dal githubnotes.json, le trasforma in stringa e poi in oggetti, in extractedNotes
const importNotes = () => 
{
    try 
    {
        console.log("Notes file successfully imported! Awaiting requests...");
        const extractedNotes = fs.readFileSync('./database/githubnotes.json')
        const result = extractedNotes.toString();
        return JSON.parse(result);
    } 
    catch (e) 
    {
        console.log("Failed to read file!");
        return [];
    }
} 

// salva le note nel githubnotes.json quando viene inizializzato il server o dopo una modifica
const saveNotes = (notes) => 
{
    fs.writeFileSync('./database/githubnotes.json', JSON.stringify(notes), "utf-8")
}

export
{
    saveNotes,
    importNotes
}
