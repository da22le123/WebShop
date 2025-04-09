import { test, beforeAll, afterAll, expect } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import { connectToDatabase, closeConnection, User, Product } from "../data/database.js";
import { createServerApp } from "../server.js";

const app = createServerApp();

beforeAll(async () => {
    await connectToDatabase();
  });
  
afterAll(async () => {
await closeConnection();
});

export const createTestUser = async (username, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    return User.create({
        username,
        password: hashedPassword,
    });
};

export const loginTestUser = async (username, password) => {
    const res = await request(app)
        .post("/tokens")
        .send({ username, password });

    if (res.status !== 200) {
        throw new Error("Failed to log in test user. Check credentials and endpoint.");
    }

    return res.body.token;
};

export const createProduct = async (name, price) => {
    return Product.create({
        name,
        price,
    });
}

test("GET /products returns 200 and a list of products", async () => {
    createProduct("product1", 100);
    createProduct("product2", 200);

    await request(app)
        .get("/products")
        .expect(200)
        .then(({body}) => {
            expect(body).toHaveLength(2);
            expect(body[0]).toHaveProperty("name", "product1");
            expect(body[1]).toHaveProperty("name", "product2");
        });
});

test("POST /products while not logged in returns 401", async () => {
    await request(app)
        .post("/products")
        .send({
            name: "product1",
            price: 100,
        })
        .expect(401);
});

test("POST /products while logged in returns 201 and the created product", async () => {
    await createTestUser("testuser", "password");
    const token = await loginTestUser("testuser", "password");

    await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "product1",
            price: 100,
        })
        .expect(201)
        .then(({body}) => {
            expect(body).toHaveProperty("name", "product1");
            expect(body).toHaveProperty("price", 100);
        });
});

test("POST /products with invalid data returns 400", async () => {
    await createTestUser("testuser", "password");
    const token = await loginTestUser("testuser", "password");

    await request(app)
        .post("/products")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: "",
            price: 10.5,
        })
        .expect(400)
        .then(({body}) => {
            expect(body).toHaveProperty("errors", ["Name is required", "Price must be an integer"]);
        });
});




