let audioUnlocked = false;

export function unlockAudio() {
  if (!audioUnlocked) {
    const dummy = new Audio();
    dummy.play().catch(() => {});
    audioUnlocked = true;
  }
}

export function playSfx(src, options = {}) {
  const audio = new Audio(src);
  audio.volume = options.volume ?? 0.3;
  audio.play().catch(() => {});
}