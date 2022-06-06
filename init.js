// IMPORTS

// Built-in
import https from 'https';
import path from 'path';
import * as fs from 'fs';

// Packages
import 'dotenv/config';



// PARSE ENV
const envUrl = process.env.REMOTE_URL;
const envUser = process.env.REMOTE_USER;
const envToken = process.env.REMOTE_TOKEN;

const envPath = process.env.NOTES_DATABASE_PATH;


// CONFIG
const parsedUrl = new URL(envUrl);

/*
const requestBody = JSON.stringify({
    user: `@${envUser}`
});
*/

const requestBody = '{"user": "@D4n13l3Q"}';

const requestOptions = {
    hostname: parsedUrl.hostname,
    port: parsedUrl.port,
    path: `${parsedUrl.pathname}${parsedUrl.search}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': requestBody.length,
        'token': envToken
    }
};



// REQUEST FUNCTION
function doRequest() {
    
    return new Promise(
        
        function (resolve, reject) {
            
            const request = https.request(
                requestOptions,
                function (response) {
                    
                    //console.log('statusCode:', response.statusCode);
                    //console.log('headers:', response.headers);
                    
                    response.setEncoding('utf8');
                    
                    let returnData = '';
                    response.on('data', (chunk) => returnData += chunk );
                    
                    response.on('end', () => resolve(returnData) );
                    
                    response.on('error', (error) => reject(error) );
                    
                }
            );
            
            request.write(requestBody);
            
            request.end();
            
        }
        
    );
    
}




// RENAME ID TO UUID
const noteID2noteUUID = function (note) {
    
    const newNote = {
        uuid: note.uuid || note.id,
        user: note.user,
        date: note.date,
        title: note.title,
        body: note.body,
        created_at: note.created_at
    };
    
    return newNote;
    
}



// RETRIEVE NOTES FUNCTION
const retrieveNotes = async function () {

    const responseBody = await doRequest();
    
    let responseJSON;
    
    try {
        responseJSON = JSON.parse(responseBody);
    } catch {
        responseJSON = undefined;
    }
    
    const notesList = responseJSON.data.map( note => noteID2noteUUID(note) ) || undefined;
    
    if (notesList !== undefined) {
        
        const databasePath = path.resolve(path.normalize(envPath));
        
        const dataJSON = JSON.stringify(notesList);
        
        try {
            
            fs.writeFileSync(databasePath, dataJSON);
            
            console.log(`Notes list updated from "${envUrl}"`);
            
        } catch (error) {
            
            console.error(`ERROR: Could not write to "${envPath}"`);
            //console.error(error);
            
        }
        
    } else {
        
        console.error(`ERROR: Could not retrieve notes from "${envUrl}"`);
        
    }
    
}



// RETRIEVE NOTES
retrieveNotes();
