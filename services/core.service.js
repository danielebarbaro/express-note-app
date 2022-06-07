import axios from 'axios';
import fs from 'fs';
import process from 'process';


const notesLoader = async function() {
    try{
        const res = await axios({
            method: 'post',
            url: process.env.API_NOTES_LINK,
            headers: {
                token: process.env.API_NOTES_KEY
            },
            data: {
                user: process.env.GITHUB_USER
            }
        });
        let notes = res.data;
    
        fs.writeFileSync('./database/githubnotes.json', JSON.stringify(notes));
    }catch(error){
        console.log(error);
    }
    
}



export {
    notesLoader
}