import { P2PConnectionError } from '../../.errors/class.js'

export function waitForChannelOpen(channel: RTCDataChannel): Promise<void> {
  if (channel.readyState === 'open') return Promise.resolve()

  return new Promise<void>((resolve, reject) => {
    const cleanup = (): void => {
      void channel.removeEventListener('open', onOpen)
      void channel.removeEventListener('close', onClose)
      void channel.removeEventListener('error', onError)
    }

    const onOpen = (): void => {
      void cleanup()
      void resolve()
    }

    const onClose = (): void => {
      void cleanup()
      void reject(new P2PConnectionError('CHANNEL_CLOSED'))
    }

    const onError = (): void => {
      void cleanup()
      void reject(new P2PConnectionError('CHANNEL_ERROR'))
    }

    void channel.addEventListener('open', onOpen)
    void channel.addEventListener('close', onClose)
    void channel.addEventListener('error', onError)
  })
}
