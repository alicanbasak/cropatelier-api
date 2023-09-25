import http from "http";
import app from "./app/app.js";

//create a server
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

//start the server
server.listen(PORT, console.log(`Server is running on port ${PORT}`));
