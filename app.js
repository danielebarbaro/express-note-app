import express from "express";
import 'dotenv/config';
import notes from "./routes/notes.route.js";
import admin from "./routes/admins.route.js";
import logMiddleware from './middlewares/log.middleware.js';
import notFoundMiddleware from "./middlewares/notFound.middleware.js";
import axios from "axios";
import * as fs from "fs";

const app = express()

const port = process.env.PORT;
const serverSecret = process.env.API_KEY;
const noteLink = process.env.API_NOTES_LINK;
const keyLink = process.env.API_KEY_LINK;
const gitHubUser = process.env.GITHUB_USER;

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

app.use(express.json())
app.use(logMiddleware)
app.use(notes);
app.use(admin);
app.use(notFoundMiddleware);





if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => console.log(`Server listening on port ${port}`));
}



export default app;
