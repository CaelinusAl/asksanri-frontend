import { useEffect, useRef, useState } from "react";

export default function RitualAudioPlayer({ src }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggle = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.onended = () => setIsPlaying(false);
  }, []);

  return (
    <div style={{ marginTop: 20 }}>
      <audio ref={audioRef} src={src} />
      <button onClick={toggle} style={{
        padding: "10px 20px",
        borderRadius: 12,
        background: "#7a4dff",
        color: "white",
        border: "none",
        cursor: "pointer"
      }}>
        {isPlaying ? "Dur" : "Ritüeli Başlat"}
      </button>
    </div>
  );
}