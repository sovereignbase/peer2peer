import { P2PConnectionError } from '../../.errors/class.js'

/**
 * Resolves with the next incoming `RTCDataChannel`.
 *
 * @param peerConnection The peer connection that is expected to receive a data
 * channel.
 * @throws {P2PConnectionError} Throws `CHANNEL_NOT_AVAILABLE` when the peer
 * connection closes or fails first.
 */
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
        void reject(
          new P2PConnectionError(
            'CHANNEL_NOT_AVAILABLE',
            `The RTCPeerConnection entered the "${peerConnection.connectionState}" state before it emitted a "datachannel" event.`
          )
        )
      }
    }

    void peerConnection.addEventListener('datachannel', onDataChannel)
    void peerConnection.addEventListener(
      'connectionstatechange',
      onConnectionStateChange
    )
  })
}
