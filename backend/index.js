import "dotenv/config";

import { createServerApp } from "./server.js";

const app = createServerApp();

// HTTP server creation
const server = http.createServer(app);

async function startServer() {
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
}

startServer();