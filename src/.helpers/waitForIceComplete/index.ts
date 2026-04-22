export async function waitForIceComplete(
  peerConnection: RTCPeerConnection
): Promise<void> {
  if (peerConnection.iceGatheringState === 'complete') return

  await new Promise<void>((resolve) => {
    const cleanup = (): void => {
      peerConnection.removeEventListener(
        'icegatheringstatechange',
        onIceGatheringStateChange
      )
      peerConnection.removeEventListener('icecandidate', onIceCandidate)
      resolve()
    }

    const onIceGatheringStateChange = (): void => {
      if (peerConnection.iceGatheringState === 'complete') cleanup()
    }

    const onIceCandidate = (event: RTCPeerConnectionIceEvent): void => {
      if (!event.candidate) cleanup()
    }

    peerConnection.addEventListener(
      'icegatheringstatechange',
      onIceGatheringStateChange
    )
    peerConnection.addEventListener('icecandidate', onIceCandidate)
  })
}
