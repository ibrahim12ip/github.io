const ws = new WebSocket('ws://localhost:8080');

let localStream;
let remoteStream;
let peerConnection;
const config = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

ws.onmessage = (message) => {
    const data = JSON.parse(message.data);

    switch(data.type) {
        case 'offer':
            handleOffer(data.offer);
            break;
        case 'answer':
            handleAnswer(data.answer);
            break;
        case 'candidate':
            handleCandidate(data.candidate);
            break;
        case 'disconnect':
            handleDisconnect();
            break;
        case 'next':
            handleNext();
            break;
        default:
            break;
    }
};

async function startCall() {
    localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    document.getElementById('localVideo').srcObject = localStream;

    peerConnection = new RTCPeerConnection(config);
    peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
            ws.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
        }
    };
    peerConnection.ontrack = (event) => {
        document.getElementById('remoteVideo').srcObject = event.streams[0];
    };

    localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    ws.send(JSON.stringify({ type: 'offer', offer: offer }));
}

async function handleOffer(offer) {
    if (!peerConnection) {
        peerConnection = new RTCPeerConnection(config);
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                ws.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
            }
        };
        peerConnection.ontrack = (event) => {
            document.getElementById('remoteVideo').srcObject = event.streams[0];
        };

        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));
    }

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    ws.send(JSON.stringify({ type: 'answer', answer: answer }));
}

async function handleAnswer(answer) {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
}

function handleCandidate(candidate) {
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
}

function handleDisconnect() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        document.getElementById('localVideo').srcObject = null;
    }
    if (remoteStream) {
        document.getElementById('remoteVideo').srcObject = null;
    }
}

function handleNext() {
    handleDisconnect();
    startCall();
}

function nextUser() {
    ws.send(JSON.stringify({ type: 'next' }));
    handleNext();
}

function endCall() {
    ws.send(JSON.stringify({ type: 'disconnect' }));
    handleDisconnect();
}
