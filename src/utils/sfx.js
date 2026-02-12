// src/utils/sfx.js

export function unlockAudio() {
  // boş bırakabiliriz şimdilik
}

export function playSfx(src, { volume = 0.7 } = {}) {
  try {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.currentTime = 0;
    audio.play().catch(() => {});
    return audio;
  } catch (e) {
    console.warn("SFX error:", e);
    return null;
  }
}