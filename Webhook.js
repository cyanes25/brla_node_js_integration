const express = require('express');
const http = require('http');

const app = express();
const port = 7890;

app.post('/', receiveWebhookNotification);

const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server up on port ${port}`);
});

process.on('SIGINT', () => {
    console.log('Server shutting down');
    server.close(() => {
        process.exit(0);
    });
});

function receiveWebhookNotification(req, res) {
    let bodyData = '';

    req.on('data', (chunk) => {
        bodyData += chunk.toString();
    });

    req.on('end', () => {
        console.log('Received message:', bodyData);
        res.status(200).send();
    });

    req.on('error', (err) => {
        console.error('Error reading body:', err.message);
        res.status(500).send('body corrupted');
    });
}
