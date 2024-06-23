const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

let users = [];

wss.on('connection', (ws) => {
    users.push(ws);

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        switch(data.type) {
            case 'offer':
                handleOffer(data.offer, ws);
                break;
            case 'answer':
                handleAnswer(data.answer, ws);
                break;
            case 'candidate':
                handleCandidate(data.candidate, ws);
                break;
            case 'disconnect':
                handleDisconnect(ws);
                break;
            case 'next':
                handleNext(ws);
                break;
            default:
                break;
        }
    });

    ws.on('close', () => {
        users = users.filter(user => user !== ws);
    });
});

function handleOffer(offer, ws) {
    const otherUser = getOtherUser(ws);
    if (otherUser) {
        otherUser.send(JSON.stringify({ type: 'offer', offer: offer }));
    }
}

function handleAnswer(answer, ws) {
    const otherUser = getOtherUser(ws);
    if (otherUser) {
        otherUser.send(JSON.stringify({ type: 'answer', answer: answer }));
    }
}

function handleCandidate(candidate, ws) {
    const otherUser = getOtherUser(ws);
    if (otherUser) {
        otherUser.send(JSON.stringify({ type: 'candidate', candidate: candidate }));
    }
}

function handleDisconnect(ws) {
    const otherUser = getOtherUser(ws);
    if (otherUser) {
        otherUser.send(JSON.stringify({ type: 'disconnect' }));
    }
}

function handleNext(ws) {
    handleDisconnect(ws);
    const otherUser = getOtherUser(ws);
    if (otherUser) {
        otherUser.send(JSON.stringify({ type: 'next' }));
    }
}

function getOtherUser(ws) {
    return users.find(user => user !== ws);
}

console.log('WebSocket server is running on ws://localhost:8080');
