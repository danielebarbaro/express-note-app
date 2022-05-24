import express from "express";

const adminsRoute = express.Router();

adminsRoute.get('/',
    (request, response) => response.send('Hello admin')
)

export default adminsRoute;