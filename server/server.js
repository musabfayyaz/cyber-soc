
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");
const { initSocket } = require("./lib/socket");

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        handle(req, res, parse(req.url, true));
    });

    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    initSocket(io);

    httpServer.once("error", (err) => {
        console.error(err);
        process.exit(1);
    }).listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
}).catch((err) => {
    console.error("Error starting Next.js app:", err);
    process.exit(1);
});
