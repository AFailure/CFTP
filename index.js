import CFTPServer from './cftp_server.js';
import express from 'express';
import http from 'http';
import path from 'path';

const __dir__ = import.meta.dirname;

const port = 8080;

const app = new express();

new CFTPServer(8081);

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dir__, 'index.html'));
});

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
})