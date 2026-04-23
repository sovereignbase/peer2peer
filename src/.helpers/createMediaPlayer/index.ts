/**
 * Creates a muted inline-capable video element for local or remote media
 * playback.
 *
 * @returns A configured `HTMLVideoElement`.
 */
export function createMediaPlayer(): HTMLVideoElement {
  const mediaPlayer = document.createElement('video')

  mediaPlayer.autoplay = true
  mediaPlayer.playsInline = true

  void document.head.append(mediaPlayer)

  return mediaPlayer
}
