import { P2PConnectionError } from '../../.errors/class.js'

export function waitForIncomingDataChannel(
  peerConnection: RTCPeerConnection
): Promise<RTCDataChannel> {
  return new Promise<RTCDataChannel>((resolve, reject) => {
    const cleanup = (): void => {
      peerConnection.removeEventListener('datachannel', onDataChannel)
      peerConnection.removeEventListener(
        'connectionstatechange',
        onConnectionStateChange
      )
    }

    const onDataChannel = (event: RTCDataChannelEvent): void => {
      cleanup()
      resolve(event.channel)
    }

    const onConnectionStateChange = (): void => {
      if (
        peerConnection.connectionState === 'failed' ||
        peerConnection.connectionState === 'closed'
      ) {
        cleanup()
        reject(new P2PConnectionError('CHANNEL_NOT_AVAILABLE'))
      }
    }

    peerConnection.addEventListener('datachannel', onDataChannel)
    peerConnection.addEventListener(
      'connectionstatechange',
      onConnectionStateChange
    )
  })
}
