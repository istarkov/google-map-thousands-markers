const express = require('express');
const compression = require('compression');
const path = require('path');
const { Server } = require('http');

const WS_PORT = 4000;

const app = express();
const server = Server(app);

app.use(compression());
app.use(express.static(path.join(__dirname, '../build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

server.listen(process.env.WS_PORT || WS_PORT);
