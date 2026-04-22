import { P2PConnectionError } from '../../.errors/class.js'
import { waitForIceComplete } from '../waitForIceComplete/index.js'

export async function createLocalAnswer(
  peerConnection: RTCPeerConnection
): Promise<RTCSessionDescription> {
  await peerConnection.setLocalDescription(await peerConnection.createAnswer())
  await waitForIceComplete(peerConnection)

  if (!peerConnection.localDescription)
    throw new P2PConnectionError('MISSING_LOCAL_DESCRIPTION')

  return peerConnection.localDescription
}
