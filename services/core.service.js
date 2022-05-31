import axios from 'axios';
import fs from 'fs';
import process from 'process';

// const apiKeyLoader = async function() {
//     try {
//         const res = await axios.request({
//             method: 'GET',
//             url: `https://its.dbdevelopment.tech/key/@${process.env.GITHUB_USER}`
//         });
//         process.env.API_KEY = res.data.data;
//     }catch(error){
//         console.log(error + `: errore caricamento api key`);
//     }
// }



const notesLoader = async function() {
    try{
        const res = await axios({
            method: 'post',
            url: process.env.API_HOST,
            headers: {
                token: process.env.API_KEY
            },
            data: {
                user: process.env.GITHUB_USER
            }
        });
        let notes = res.data.data;
    
        fs.writeFileSync('./database/githubnotes.json', JSON.stringify(notes));
    }catch(error){
        console.log(error);
    }
    
}

export {
    notesLoader
}