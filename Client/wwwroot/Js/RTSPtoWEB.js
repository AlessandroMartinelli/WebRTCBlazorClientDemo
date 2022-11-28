const webrtc = new RTCPeerConnection({
    iceServers: [],
    sdpSemantics: 'unified-plan'
})

const webrtcSendChannel = webrtc.createDataChannel('rtsptowebSendChannel')

window.start_WebRTC_Player = (streamUrl, videoElementName) => {
    let videoElement = document.getElementById(videoElementName);
    startPlay(videoElement, streamUrl);
};


function startPlay(videoElement, streamUrl) {

    webrtc.ontrack = function (event) {
        console.log(event.streams.length + ' track has been delivered')
        videoElement.srcObject = event.streams[0]
        videoElement.play()
    }
    webrtc.addTransceiver('video', { direction: 'sendrecv' })
    webrtc.onnegotiationneeded = async function handleNegotiationNeeded() {
        const offer = await webrtc.createOffer()

        await webrtc.setLocalDescription(offer)

        fetch(streamUrl, {
            method: 'POST',
            body: new URLSearchParams({ data: btoa(webrtc.localDescription.sdp) })
        })
            .then(response => response.text())
            .then(data => {
                try {
                    webrtc.setRemoteDescription(
                        new RTCSessionDescription({ type: 'answer', sdp: atob(data) })
                    )
                } catch (e) {
                    console.warn(e)
                }
            })
    }

  
    webrtcSendChannel.onopen = (event) => {
        console.log(`${webrtcSendChannel.label} opened`)
        webrtcSendChannel.send('ping')
    }
    webrtcSendChannel.onclose = (_event) => {
        console.log(`${webrtcSendChannel.label} closed`)
        startPlay(videoElement, streamUrl)
    }
    webrtcSendChannel.onmessage = event => console.log(event.data)
}

window.stop_WebRTC_Player = () => {
    let videoElement = document.getElementById(videoElementName);
    debugger;
    webrtc.close();
    webrtcSendChannel.close();
    videoElement.close();

    console.log("window being closed")
}