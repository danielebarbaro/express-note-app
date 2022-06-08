import app from "./app.js";
import supertest from "supertest";

it('Testing to see if Jest works', () => {
    expect(true).toBe(true)
})

it("[GET] - Call /init with success", async () => {
    await supertest(app)
        .get("/init")
        .expect(204);
});

it("[GET] - Call /api/notes with success", async () => {
    await supertest(app).get("/api/notes")
        .expect(200)
        .then((response) => {
            const result = response.body;
            expect(result.list).toBeTruthy();
            expect(result.success).toBeTruthy();
            expect(result.data.length).toBeGreaterThan(1);
            expect(Array.isArray(result.data)).toBeTruthy();

            const note = result.data.shift();
            expect(note).toHaveProperty('id');
            expect(note).toHaveProperty('user');
            expect(note).toHaveProperty('date');
            expect(note).toHaveProperty('title');
            expect(note).toHaveProperty('body');
            expect(note).toHaveProperty('created_at');
        });
});

it("[GET] - Call with a parameter /api/notes/:uuid with success ", async () => {
    const notes = await supertest(app).get("/api/notes");
    const note = notes?.body.data.shift();
    await supertest(app).get(`/api/notes/${note.id}`)
        .expect(200)
        .then((response) => {
            const result = response.body;

            expect(result.single).toBeTruthy();
            expect(result.success).toBeTruthy();
            expect(result.data.length).toBe(1);
            expect(Array.isArray(result.data)).toBeTruthy();

            const note = result.data.shift();
            expect(note).toHaveProperty('id');
            expect(note).toHaveProperty('user');
            expect(note).toHaveProperty('date');
            expect(note).toHaveProperty('title');
            expect(note).toHaveProperty('body');
            expect(note).not.toHaveProperty('created_at');
        });
});

it("[GET] - Received an error calling /api/notes/:uuid with a wrong parameter ", async () => {
    await supertest(app).get(`/api/notes/hello`)
        .expect(500)
        .then((response) => {
            const result = response.body;
            expect(result.code).toBe(1001);
            expect(result.success).toBeFalsy();
            expect(result.error).toBe('Resource not found');
        });
});

it("[GET] - Received an Unauthorized error calling /api/notes?date=2023-10-01", async () => {
    await supertest(app).get("/api/notes?date=2021-10-01")
        .expect(401)
        .then((response) => {
            const result = response.body;
            expect(result.code).toBe(2001);
            expect(result.success).toBeFalsy();
            expect(result.error).toBe('Unauthorized');
        });
});

it("[GET] - Received an empty result with a date filter /api/notes?date=2093-10-01", async () => {
    await supertest(app).get("/api/notes?date=2093-10-01")
        .set({secret: process.env.API_KEY})
        .expect(200)
        .then((response) => {
            const result = response.body;
            expect(result.filtered).toBeTruthy();
            expect(result.success).toBeTruthy();
            expect(result.data.length).toBe(0);
            expect(Array.isArray(result.data)).toBeTruthy();
        });
});

it("[GET] - Received data values from /api/notes?date=2023-10-01", async () => {
    await supertest(app).get("/api/notes?date=2021-10-01")
        .set({secret: process.env.API_KEY})
        .expect(200)
        .then((response) => {
            const result = response.body;
            expect(result.filtered).toBeTruthy();
            expect(result.success).toBeTruthy();
            expect(result.data.length).toBeGreaterThan(1);
            expect(Array.isArray(result.data)).toBeTruthy();

            const note = result.data.shift();
            expect(note).toHaveProperty('id');
            expect(note).toHaveProperty('user');
            expect(note).toHaveProperty('date');
            expect(note).toHaveProperty('title');
            expect(note).toHaveProperty('body');
            expect(note).not.toHaveProperty('created_at');
        });
});

it("[GET] - Received an Unauthorized error calling /api/notes?limit=2", async () => {
    await supertest(app).get("/api/notes?limit=2")
        .expect(401)
        .then((response) => {
            const result = response.body;
            expect(result.code).toBe(2001);
            expect(result.success).toBeFalsy();
            expect(result.error).toBe('Unauthorized');
        });
});

it("[GET] - Received two values calling /api/notes?limit=2", async () => {
    await supertest(app).get("/api/notes?limit=2")
        .set({secret: process.env.API_KEY})
        .expect(200)
        .then((response) => {
            const result = response.body;
            expect(result.success).toBeTruthy();
            expect(result.data.length).toBe(2);
            expect(Array.isArray(result.data)).toBeTruthy();

            const note = result.data.shift();
            expect(note).toHaveProperty('id');
            expect(note).toHaveProperty('user');
            expect(note).toHaveProperty('date');
            expect(note).toHaveProperty('title');
            expect(note).toHaveProperty('body');
            expect(note).not.toHaveProperty('created_at');
        });
});

it("[POST] - Received an Unauthorized error calling /api/notes", async () => {
    await supertest(app).post("/api/notes")
        .expect(401)
        .then((response) => {
            const result = response.body;
            expect(result.code).toBe(2001);
            expect(result.success).toBeFalsy();
            expect(result.error).toBe('Unauthorized');
        });
});

it("[POST] - Create a new resource using /api/notes", async () => {
    await supertest(app)
        .post("/api/notes")
        .set({secret: process.env.API_KEY})
        .send({
            "user": "spacex",
            "date": "2022-05-20",
            "title": "Corso Node",
            "body": "Crea app Note"
        })
        .expect(201)
        .then((response) => {
            const note = response.body;
            expect(note).toHaveProperty('id');
            expect(note).toHaveProperty('user');
            expect(note).toHaveProperty('date');
            expect(note).toHaveProperty('title');
            expect(note).toHaveProperty('body');
            // expect(note).toHaveProperty('created_at'); // Opinabile
        });
});

it("[PUT] - Received an Unauthorized error calling /api/notes/:uuid", async () => {
    const notes = await supertest(app).get("/api/notes");
    const note = notes?.body.data.shift();
    await supertest(app).put(`/api/notes/${note.id}`)
        .expect(401)
        .then((response) => {
            const result = response.body;
            expect(result.code).toBe(2001);
            expect(result.success).toBeFalsy();
            expect(result.error).toBe('Unauthorized');
        });
});

it("[PUT] - Update an existing resource using /api/notes/:uuid", async () => {
    const notes = await supertest(app).get("/api/notes");
    const note = notes?.body.data.shift();
    await supertest(app)
        .put(`/api/notes/${note.id}`)
        .set({secret: process.env.API_KEY})
        .send({
            "title": "modificato",
            "body": "modificato"
        })
        .expect(200)
        .then((response) => {
            const result = response.body;
            expect(result.single).toBeTruthy();
            expect(result.success).toBeTruthy();
            expect(result.data.length).toBe(1);
            expect(Array.isArray(result.data)).toBeTruthy();

            const note = result.data.shift();
            expect(note).toHaveProperty('id');
            expect(note).toHaveProperty('user');
            expect(note).toHaveProperty('date');
            expect(note).toHaveProperty('title');
            expect(note).toHaveProperty('body');
            expect(note).toHaveProperty('created_at');
        });
});

it("[PUT] - Fail to update a wrong note /api/whatever", async () => {
    await supertest(app).put(`/api/whatever`)
        .expect(500)
        .then((response) => {
            const result = response.body;
            expect(result.code).toBe(1001);
            expect(result.success).toBeFalsy();
            expect(result.error).toBe('Resource not found');
        });
});

it("[GET] - Fail to call note filtered with wrong api-key /api/notes?date=2023-10-01", async () => {
    await supertest(app).get("/api/notes?date=2021-10-01")
        .set({secret: 'dummy-key-wrong'})
        .expect(403)
        .then((response) => {
            const result = response.body;
            expect(result.code).toBe(2002);
            expect(result.success).toBeFalsy();
            expect(result.error).toBe('Forbidden');
        });
});