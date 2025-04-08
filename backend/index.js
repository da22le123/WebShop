import "dotenv/config";
import http from "node:http";

import { createServerApp } from "./server.js";
import { connectToDatabase } from "./data/database.js";

const app = createServerApp();

// HTTP server creation
const server = http.createServer(app);

async function startServer() {
    await connectToDatabase();

    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
}

startServer();