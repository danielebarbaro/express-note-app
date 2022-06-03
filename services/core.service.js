import axios from 'axios';
import process from 'process'; 
import fs from 'fs';


const importNotes = async function() 
{
    try
    { // parametri per importare le note
        const options = await axios
        ({
            method: 'POST',
            url: process.env.API_HOST,
            headers: 
            {
                token: process.env.API_KEY
            },
            data: 
            {
                user: process.env.USER_GITHUB
            }
        });
        let notes = options.data.data;
    
        // Importa le note dal secondo server, converte in una stringa il JSON e la scrive su un file
        fs.writeFileSync('./database/githubnotes.json', JSON.stringify(notes));
    }
    catch(error)
    {
        console.log(error);
    }
    
}

export 
{
    importNotes
}