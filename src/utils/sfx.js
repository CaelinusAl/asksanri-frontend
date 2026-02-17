import { stopSfx } from "../utils/sfx";

useEffect(() => {
  return () => {
    stopSfx();
  };
}, []);

let audioUnlocked = false;
let currentAudio = null; // aktif çalan ses

export function unlockAudio() {
  if (!audioUnlocked) {
    const dummy = new Audio();
    dummy.play().catch(() => {});
    audioUnlocked = true;
  }
}

export function playSfx(src, options = {}) {
  // Eğer başka bir ses çalıyorsa durdur
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
