import React, { useMemo, useState } from "react";

export default function BilincAlaniField({ language = "tr", onInsert }) {
  const isTR = language === "tr";

  const doors = useMemo(() => {
    return [
      {
        id: "kalp",
        title: isTR ? "Kalp" : "Heart",
        hint: isTR ? "Duygunun kökü nerede?" : "Where is the root of the feeling?",
        prompt: isTR
          ? "Şu an kalbimde hangi duygu var? Bu duygu bana ne öğretmek istiyor?"
          : "What emotion is in my heart right now? What is it trying to teach me?",
      },
      {
        id: "zihin",
        title: isTR ? "Zihin" : "Mind",
        hint: isTR ? "Düşünce döngüsü ne söylüyor?" : "What is the thought loop saying?",
        prompt: isTR
          ? "Zihnim hangi cümleyi tekrar ediyor? Bu cümle hangi korkuyu koruyor?"
          : "What sentence is my mind repeating? What fear is it protecting?",
      },
      {
        id: "beden",
        title: isTR ? "Beden" : "Body",
        hint: isTR ? "Bedenin nerede sıkışıyor?" : "Where is it stuck in the body?",
        prompt: isTR
          ? "Bu soru bedenimde nerede yankılanıyor? Oraya nefes gönderince ne değişiyor?"
          : "Where does this question resonate in my body? What changes when I breathe into it?",
      },
      {
        id: "nefes",
        title: isTR ? "Nefes" : "Breath",
        hint: isTR ? "Ritim neye çağırıyor?" : "What is the rhythm calling for?",
        prompt: isTR
          ? "3 nefeslik bir ritüel yaz: nefes al—tut—ver. Her aşamada neyi bırakıyorum?"
          : "Write a 3-breath ritual: inhale—hold—exhale. What do I release in each phase?",
      },
    ];
  }, [isTR]);

  const [active, setActive] = useState(doors[0].id);
  const current = doors.find((d) => d.id === active) || doors[0];

  return (
    <div style={{ display: "grid", gap: 10 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {doors.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setActive(d.id)}
            style={{
              padding: "8px 10px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,.12)",
              background: d.id === active ? "rgba(170,90,255,.20)" : "rgba(255,255,255,.06)",
              color: "rgba(245,240,255,.92)",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            {d.title}
          </button>
        ))}
      </div>

      <div
        style={{
          border: "1px solid rgba(255,255,255,.12)",
          background: "rgba(255,255,255,.06)",
          borderRadius: 14,
          padding: 12,
        }}
      >
        <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 6 }}>{current.hint}</div>
        <div style={{ fontSize: 12, lineHeight: 1.5, opacity: 0.95 }}>{current.prompt}</div>
      </div>

      <button
        type="button"
        onClick={() => onInsert?.(current.prompt)}
        style={{
          padding: "10px 12px",
          borderRadius: 999,
          border: "1px solid rgba(170,90,255,.55)",
          background: "rgba(170,90,255,.20)",
          color: "rgba(245,240,255,.95)",
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        {isTR ? "Promptu ekle" : "Insert prompt"}
      </button>
    </div>
  );
}