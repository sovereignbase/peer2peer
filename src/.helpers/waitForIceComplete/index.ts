export async function waitForIceComplete(
  peerConnection: RTCPeerConnection
): Promise<void> {
  if (peerConnection.iceGatheringState === 'complete') return

  await new Promise<void>((resolve) => {
    const cleanup = (): void => {
      void peerConnection.removeEventListener(
        'icegatheringstatechange',
        onIceGatheringStateChange
      )
      void peerConnection.removeEventListener('icecandidate', onIceCandidate)
      void resolve()
    }

    const onIceGatheringStateChange = (): void => {
      if (peerConnection.iceGatheringState === 'complete') void cleanup()
    }

    const onIceCandidate = (event: RTCPeerConnectionIceEvent): void => {
      if (!event.candidate) void cleanup()
    }

    void peerConnection.addEventListener(
      'icegatheringstatechange',
      onIceGatheringStateChange
    )
    void peerConnection.addEventListener('icecandidate', onIceCandidate)
  })
}
