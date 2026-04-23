import { P2PConnectionError } from '../../.errors/class.js'

export function waitForIncomingDataChannel(
  peerConnection: RTCPeerConnection
): Promise<RTCDataChannel> {
  return new Promise<RTCDataChannel>((resolve, reject) => {
    const cleanup = (): void => {
      void peerConnection.removeEventListener('datachannel', onDataChannel)
      void peerConnection.removeEventListener(
        'connectionstatechange',
        onConnectionStateChange
      )
    }

    const onDataChannel = (event: RTCDataChannelEvent): void => {
      void cleanup()
      void resolve(event.channel)
    }

    const onConnectionStateChange = (): void => {
      if (
        peerConnection.connectionState === 'failed' ||
        peerConnection.connectionState === 'closed'
      ) {
        void cleanup()
        void reject(new P2PConnectionError('CHANNEL_NOT_AVAILABLE'))
      }
    }

    void peerConnection.addEventListener('datachannel', onDataChannel)
    void peerConnection.addEventListener(
      'connectionstatechange',
      onConnectionStateChange
    )
  })
}
