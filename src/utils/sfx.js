let unlocked = false;

export function unlockAudio() {
  unlocked = true;
}

export async function playSfx(src, { volume = 0.8 } = {}) {
  try {
    if (!unlocked) unlocked = true;

    const audio = new Audio(src);
    audio.volume = volume;
    audio.currentTime = 0;

    await audio.play().catch(() => {});
    return audio;
  } catch (err) {
    console.warn("SFX error:", err);
    return null;
  }
}