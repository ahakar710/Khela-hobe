// Voice chat client scaffold.
// Requires secure HTTPS, signaling service and TURN credentials.

export async function createVoicePeer({
  iceServers,
  onTrack,
  sendSignal
}) {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error(
      "Microphone is unavailable or HTTPS is required."
    );
  }

  if (typeof sendSignal !== "function") {
    throw new Error("A signaling function is required.");
  }

  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: false
  });

  const pc = new RTCPeerConnection({
    iceServers: Array.isArray(iceServers) ? iceServers : []
  });

  stream.getTracks().forEach(track => {
    pc.addTrack(track, stream);
  });

  pc.ontrack = event => {
    if (typeof onTrack === "function") {
      onTrack(event);
    }
  };

  pc.onicecandidate = event => {
    if (event.candidate) {
      sendSignal({
        type: "candidate",
        candidate: event.candidate
      });
    }
  };

  return {
    pc,
    stream,

    async offer() {
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      sendSignal({
        type: "offer",
        sdp: offer
      });
    },

    mute(value) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !value;
      });
    },

    close() {
      stream.getTracks().forEach(track => {
        track.stop();
      });

      pc.close();
    }
  };
}
