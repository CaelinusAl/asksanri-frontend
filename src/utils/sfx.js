let audioUnlocked = false;
let currentAudio = null;

export function unlockAudio() {
  if (!audioUnlocked) {
    const dummy = new Audio();
    dummy.play().catch(() => {});
    audioUnlocked = true;
  }
}

export function playSfx(src, options = {}) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  const audio = new Audio(src);
  audio.volume = options.volume ?? 0.3;

  currentAudio = audio;

  audio.play().catch(() => {});
}

export function stopSfx() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}
