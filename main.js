const express = require('express');
const http = require('http');
const app = express();
app.use(express.static('public'));

const port = 80;
const server = http.createServer(app).listen(process.env.PORT || port);

const io = require("socket.io")(server);
require("./server")(io);