import { P2PConnectionError } from '../../.errors/class.js'

/**
 * Resolves when an `RTCDataChannel` reaches the `"open"` state.
 *
 * @param channel The channel to observe.
 * @throws {P2PConnectionError} Throws `CHANNEL_CLOSED` or `CHANNEL_ERROR`
 * when the channel fails before opening.
 */
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
      void reject(
        new P2PConnectionError(
          'CHANNEL_CLOSED',
          'The RTCDataChannel closed before it reached the "open" state.'
        )
      )
    }

    const onError = (): void => {
      void cleanup()
      void reject(
        new P2PConnectionError(
          'CHANNEL_ERROR',
          'The RTCDataChannel fired an "error" event before it reached the "open" state.'
        )
      )
    }

    void channel.addEventListener('open', onOpen)
    void channel.addEventListener('close', onClose)
    void channel.addEventListener('error', onError)
  })
}
