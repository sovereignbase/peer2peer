import { P2PConnectionError } from '../../.errors/class.js'

export function waitForChannelOpen(channel: RTCDataChannel): Promise<void> {
  if (channel.readyState === 'open') return Promise.resolve()

  return new Promise<void>((resolve, reject) => {
    const cleanup = (): void => {
      channel.removeEventListener('open', onOpen)
      channel.removeEventListener('close', onClose)
      channel.removeEventListener('error', onError)
    }

    const onOpen = (): void => {
      cleanup()
      resolve()
    }

    const onClose = (): void => {
      cleanup()
      reject(new P2PConnectionError('CHANNEL_CLOSED'))
    }

    const onError = (): void => {
      cleanup()
      reject(new P2PConnectionError('CHANNEL_ERROR'))
    }

    channel.addEventListener('open', onOpen)
    channel.addEventListener('close', onClose)
    channel.addEventListener('error', onError)
  })
}
