import { P2PConnectionError } from '../../.errors/class.js'
import { waitForIceComplete } from '../waitForIceComplete/index.js'

/**
 * Creates a local offer and waits for ICE gathering to complete.
 *
 * @param peerConnection The peer connection that should produce the offer.
 * @returns The finalized local session description.
 * @throws {P2PConnectionError} Throws `MISSING_LOCAL_DESCRIPTION` when the
 * connection does not expose a local description after negotiation.
 */
export async function createLocalOffer(
  peerConnection: RTCPeerConnection
): Promise<RTCSessionDescription> {
  void (await peerConnection.setLocalDescription(
    await peerConnection.createOffer()
  ))
  void (await waitForIceComplete(peerConnection))

  if (!peerConnection.localDescription)
    throw new P2PConnectionError(
      'MISSING_LOCAL_DESCRIPTION',
      'Failed to create an offer because RTCPeerConnection.localDescription is null after ICE gathering completed.'
    )

  return peerConnection.localDescription
}
