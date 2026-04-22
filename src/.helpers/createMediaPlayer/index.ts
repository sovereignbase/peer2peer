export function createMediaPlayer(): HTMLVideoElement {
  const mediaPlayer = document.createElement('video')

  mediaPlayer.autoplay = true
  mediaPlayer.playsInline = true

  document.head.append(mediaPlayer)

  return mediaPlayer
}
