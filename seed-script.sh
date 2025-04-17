#!/bin/bash

# Seed a user
echo "Seeding a user..."
curl -X POST http://localhost:3000/users \
    -H "Content-Type: application/json" \
    -d '{"username": "user1", "password": "password1"}'
echo ""

# Seed 10 products
echo "Seeding products..."
for i in {1..10}; do
    curl -X POST http://localhost:3000/products \
        -H "Content-Type: application/json" \
        -d "{\"name\": \"Product $i\", \"price\": $((i * 10))}"
    echo ""
done