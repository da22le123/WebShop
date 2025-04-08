import bcrypt from "bcrypt";
import { test, beforeAll, expect } from "vitest";
import { connectToDatabase, User } from "../data/database.js";
import request from "supertest";
import { createServerApp } from "../server.js";

const app = createServerApp();

const createUser = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    return await User.create({
        username,
        password: hashedPassword,
    });
};

beforeAll(async () => {
    await connectToDatabase();
});

test("Logging in without body returns 400", async () => {
    await request(app).post("/tokens").expect(400);
});

test("Logging in with non-existent credentials returns 401", async () => {
    await request(app)
        .post("/tokens")
        .send({ username: "TestUser", password: "test" })
        .expect(401);
});
test("Logging in with invalid password returns 401", async ({
    onTestFinished,
}) => {
    await createUser("TestUser", "test");
    onTestFinished(() =>
        User.destroy({
            where: {},
            truncate: true,
        }),
    );

    await request(app)
        .post("/tokens")
        .send({ username: "TestUser", password: "test123" })
        .expect(401);
});
test("Logging in with valid credentials returns 200 and token", async ({
    onTestFinished,
}) => {
    await createUser("TestUser", "test");
    onTestFinished(() =>
        User.destroy({
            where: {},
            truncate: true,
        }),
    );

    await request(app)
        .post("/tokens")
        .send({ username: "TestUser", password: "test" })
        .expect(200)
        .then(({ body }) => {
            expect(body.token).toBeDefined();
        });
});
