import { P2PConnectionError } from '../../.errors/class.js'
import { waitForIceComplete } from '../waitForIceComplete/index.js'

export async function createLocalOffer(
  peerConnection: RTCPeerConnection
): Promise<RTCSessionDescription> {
  await peerConnection.setLocalDescription(await peerConnection.createOffer())
  await waitForIceComplete(peerConnection)

  if (!peerConnection.localDescription)
    throw new P2PConnectionError('MISSING_LOCAL_DESCRIPTION')

  return peerConnection.localDescription
}
