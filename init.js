// IMPORTS

// Built-in
import https from 'https';

// Packages
import 'dotenv/config';
import isPort from 'validator/lib/isPort.js';



// PARSE ENV
const envUrl = process.env.REMOTE_URL;
const envUser = process.env.REMOTE_USER;
const envToken = process.env.REMOTE_TOKEN;



// CONFIG
const parsedUrl = new URL(envUrl);

/*
const requestBody = JSON.stringify({
    user: `@${envUser}`
});
*/

const requestBody = '{"user": "@D4n13l3Q"}';

console.log(requestBody);

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




const request = https.request(
    requestOptions,
    function (response) {
        
        console.log('statusCode:', response.statusCode);
        console.log('headers:', response.headers);
        
        response.setEncoding('utf8');
        
        let returnData = '';
        response.on('data', (chunk) => returnData += chunk );
        
        response.on('end', () => {
            console.log(JSON.parse(returnData));
        });
        
        response.on('error', (error) => console.error(error) );
        
    }
);



request.on('error', (error) => console.error(error) );



request.write(requestBody);
request.end();

console.log("FINE");



function doRequest() {
    
    return new Promise(
        
        function (resolve, reject) {
            
            const request = https.request(
                requestOptions,
                function (response) {
                    
                    console.log('statusCode:', response.statusCode);
                    console.log('headers:', response.headers);
                    
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



const getJSON = async function () {

    const responseBody = await doRequest();

    

}
