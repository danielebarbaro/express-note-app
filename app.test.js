import app from "./app.js";
import supertest from "supertest";

it('Testing to see if Jest works', () => {
    expect(true).toBe(true)
})

it("GET hello", async () => {
    await supertest(app).get("/hello")
        .expect(200)
});

it("GET init", async () => {
    await supertest(app).get("/init")
        .expect(201)
        .then((response) => {
            const result = response.body;
            expect(result.status).toBe('success');
            expect(parseInt(result.data.notesCount)).toBeGreaterThan(1);
            expect(Array.isArray(result.data.notes)).toBeTruthy();
        });

});

describe('GET api/notes', () => {
    // Restituisce tutte le note
    it.todo('not implemented');
});

describe('GET api/notes/:uuid', () => {
    // Restituisce la nota con uuid passato come parametro
    it.todo('not implemented');
});

describe('GET api/notes?date=2023-10-01', () => {
    // Restituisce tutte le note con data maggiore di `date`
    it.todo('not implemented');
});

describe('GET api/notes?limit=2', () => {
    // Restituisce un numero di `limit` note
    it.todo('not implemented');
});

describe('PUT api/notes/:uuid', () => {
    // Aggiorna la nota
    it.todo('not implemented');
});

describe('POST api/notes/', () => {
    // Aggiunge una nota
    it.todo('not implemented');
});