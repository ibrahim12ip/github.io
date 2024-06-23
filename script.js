let localStream;
let remoteStream;
let peerConnection;
const config = {
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
};

const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const startButton = document.getElementById('startButton');
const endButton = document.getElementById('endButton');

startButton.addEventListener('click', startCall);
endButton.addEventListener('click', endCall);

async function startCall() {
    try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localVideo.srcObject = localStream;

        peerConnection = new RTCPeerConnection(config);
        localStream.getTracks().forEach(track => peerConnection.addTrack(track, localStream));

        peerConnection.onicecandidate = handleICECandidateEvent;
        peerConnection.ontrack = handleTrackEvent;

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        peerConnection.onnegotiationneeded = () => {
            // Handle negotiation if needed
        };

    } catch (error) {
        console.error('Error starting call:', error);
    }
}

function handleICECandidateEvent(event) {
    if (event.candidate) {
        // Send ICE candidate to other peer
    }
}

function handleTrackEvent(event) {
    remoteVideo.srcObject = event.streams[0];
    remoteStream = event.streams[0];
}

function endCall() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localVideo.srcObject = null;
    }
    if (remoteStream) {
        remoteVideo.srcObject = null;
    }
}
