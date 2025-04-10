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

// Helper functions
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
};

//
// Cart Endpoints Tests
//

test("GET /cart without being logged in returns 401", async () => {
  await request(app)
    .get("/cart")
    .expect(401);
});

test("POST /cart without being logged in returns 401", async () => {
  await request(app)
    .post("/cart")
    .send({ productId: 1 })
    .expect(401);
});

test("DELETE /cart without being logged in returns 401", async () => {
  await request(app)
    .delete("/cart")
    .send({ productId: 1 })
    .expect(401);
});

test("GET /cart returns 200 and an empty list when cart is empty", async () => {
  await createTestUser("cartUser1", "password");
  const token = await loginTestUser("cartUser1", "password");

  await request(app)
    .get("/cart")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .then(({ body }) => {
      // Assuming the response is of the form: { products: [] }
      expect(Array.isArray(body.products)).toBe(true);
      expect(body.products).toHaveLength(0);
    });
});

test("POST /cart while logged in adds a product to the cart", async () => {
  // Create and log in a test user.
  await createTestUser("cartUser2", "password");
  const token = await loginTestUser("cartUser2", "password");
  
  // Create a product to add to the cart.
  const product = await createProduct("cartTestProduct", 500);
  
  // Add product to the cart.
  await request(app)
    .post("/cart")
    .set("Authorization", `Bearer ${token}`)
    .send({ productId: product.id })
    .expect(201)
    .then(({ body }) => {
      // Expect a confirmation message indicating addition or quantity update.
      expect(body.message).toMatch(/added|incremented/i);
    });
  
  // Verify that the product appears on GET /cart.
  await request(app)
    .get("/cart")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .then(({ body }) => {
      // Expect the response to contain a products array with our product.
      expect(Array.isArray(body.products)).toBe(true);
      const addedProduct = body.products.find((p) => p.id === product.id);
      expect(addedProduct).toBeDefined();
    });
});

test("POST /cart multiple products increments quantity correctly", async () => {
    // Create and log in a test user.
  await createTestUser("cartUser5", "password");
  const token = await loginTestUser("cartUser5", "password");
  
  // Create a product to add to the cart.
  const product = await createProduct("cartTestProduct", 800);
  
  // Add product to the cart.
  await request(app)
    .post("/cart")
    .set("Authorization", `Bearer ${token}`)
    .send({ productId: product.id })
    .expect(201)
    .then(({ body }) => {
      expect(body.message).toMatch(/added|incremented/i);
    });

  // add same product again
  await request(app)
    .post("/cart")
    .set("Authorization", `Bearer ${token}`)
    .send({ productId: product.id })
    .expect(200)
    .then(({ body }) => {
      expect(body.message).toMatch(/added|incremented/i);
    });

    // verify the correct quantity
    await request(app)
    .get("/cart")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .then(({ body }) => {
      expect(Array.isArray(body.products)).toBe(true);
        const addedProduct = body.products.find((p) => p.id === product.id);
        expect(addedProduct).toBeDefined();
        expect(addedProduct.quantity).toBe(2); 
    });
});

test("DELETE /cart while logged in removes a product from the cart", async () => {
  // Create and log in a test user.
  await createTestUser("cartUser3", "password");
  const token = await loginTestUser("cartUser3", "password");

  // Create a product and add it to the cart.
  const product = await createProduct("cartRemoveProduct", 600);
  await request(app)
    .post("/cart")
    .set("Authorization", `Bearer ${token}`)
    .send({ productId: product.id })
    .expect(201);

  // Remove the product from the cart.
  await request(app)
    .delete("/cart")
    .set("Authorization", `Bearer ${token}`)
    .send({ productId: product.id })
    .expect(200)
    .then(({ body }) => {
      expect(body.message).toMatch(/removed/i);
    });
  
  // Confirm the product has been removed from the cart.
  await request(app)
    .get("/cart")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .then(({ body }) => {
      expect(body.products.find((p) => p.id === product.id)).toBeUndefined();
    });
});

test("DELETE /cart for a product not in the cart returns 404", async () => {
  await createTestUser("cartUser4", "password");
  const token = await loginTestUser("cartUser4", "password");

  // Create a product but do not add it to the cart.
  const product = await createProduct("nonExistentCartProduct", 700);

  await request(app)
    .delete("/cart")
    .set("Authorization", `Bearer ${token}`)
    .send({ productId: product.id })
    .expect(404)
    .then(({ body }) => {
      expect(body).toHaveProperty("message", "Product not found in the cart.");
    });
});

test("DELETE /cart multiple products decrements the quantity correctly", async () => {
     // Create and log in a test user.
  await createTestUser("cartUser5", "password");
  const token = await loginTestUser("cartUser5", "password");
  
  // Create a product to add to the cart.
  const product = await createProduct("cartTestProduct", 800);
  
  // Add product to the cart.
  await request(app)
    .post("/cart")
    .set("Authorization", `Bearer ${token}`)
    .send({ productId: product.id })
    .expect(201)
    .then(({ body }) => {
      expect(body.message).toMatch(/added|incremented/i);
    });

  // add same product again
  await request(app)
    .post("/cart")
    .set("Authorization", `Bearer ${token}`)
    .send({ productId: product.id })
    .expect(200)
    .then(({ body }) => {
      expect(body.message).toMatch(/added|incremented/i);
    });

  // remove the product once
  await request(app)
    .delete("/cart")
    .set("Authorization", `Bearer ${token}`)
    .send({ productId: product.id })
    .expect(200)
    .then(({ body }) => {
      expect(body.message).toMatch(/removed|decremented/i);
    });

  // verify the correct quantity
  await request(app)
    .get("/cart")
    .set("Authorization", `Bearer ${token}`)
    .expect(200)
    .then(({ body }) => {
      expect(Array.isArray(body.products)).toBe(true);
        const addedProduct = body.products.find((p) => p.id === product.id);
        expect(addedProduct).toBeDefined();
        expect(addedProduct.quantity).toBe(1); 
    });
});