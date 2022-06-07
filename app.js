import express from "express";
import 'dotenv/config';
import axios from "axios";
import * as fs from "fs";

const port = process.env.PORT;
const serverSecret = process.env.API_KEY;
const noteLink = process.env.API_NOTES_LINK;
const keyLink = process.env.API_KEY_LINK;
const gitHubUser = process.env.GITHUB_USER;

const app = express()

app.get('/init', async (request, response) => {
    const apiSecretResponse = await axios.get(`${keyLink}/${gitHubUser}`).then(r => r.data);
    const apiSecret = apiSecretResponse.data;

    const notes = await axios({
        method: 'post',
        url: noteLink,
        data: {"user": `${gitHubUser}`},
        headers: {'token': `${apiSecret}`}
    }).then(res => {
        return res.data
    })

    fs.writeFileSync('database/githubnotes.json', JSON.stringify(notes));

    response
        .status(204)
        .json()
});

if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => console.log(`Server listening on port ${port}`));
}



export default app;
