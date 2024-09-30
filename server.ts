import http from "http";
import app from "./app";

const port = process.env.PORT || "4000";
app.set("port", port);
const server = http.createServer(app);

server.listen(port);

server.on("listening", () => {
    console.log(`Listening on ${port}`);
});
