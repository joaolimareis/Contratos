import request from "supertest";
import express from "express";

import router from "../routes/locadorRoutes.js";

const app = express();

app.use(express.json());
app.use("/api", router);

describe("Locador Routes", () => {

test("GET /api/locador deve retornar 200", async () => {

    const response = await request(app)
        .get("/api/locador");

    console.log("STATUS:", response.statusCode);
    console.log("BODY:", response.body);

    expect(response.statusCode).toBe(200);
});

});