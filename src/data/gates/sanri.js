// src/data/gates/sanri.js
export function getSanriGate(lang = "tr") {
  const tr = {
    title: "SANRI",
    subtitle: "Yansıma alanı",
    quickTitle: "BUGÜNÜN MİNİ PRATİĞİ",
    quick: [
      "30 saniye…",
      "“Şu an bedenimde en güçlü his nerede?”",
      "Oraya nefes gönder. Hiçbir şey çözme. Sadece tanık ol."
    ],
    startersTitle: "Başlatıcılar",
    starters: [
      "Şu an bende asıl olan duygu:",
      "Bugün beni tetikleyen yer:",
      "Aslında söylemek istediğim:",
      "Kendime itirafım:",
      "Bugün ihtiyacım olan:"
    ],
    promptsTitle: "Tek Cümle Prefill",
    prompts: [
      { id: "mirror", label: "Ayna", prefill: "Net bir cümleyle şu anki gerçeğimi söyle: " },
      { id: "dream", label: "Rüya", prefill: "Bu rüyayı sahne gibi anlat: " },
      { id: "shadow", label: "Gölge", prefill: "Beni rahatsız eden şey şu: " },
      { id: "light", label: "Işık", prefill: "Şu an içimdeki en saf his: " }
    ],
    note:
      "Not: Bu alan teşhis koymaz, kesinlik iddia etmez. Anlam sende şekillenir."
  };

  const en = {
    title: "SANRI",
    subtitle: "Reflection space",
    quickTitle: "TODAY’S MINI PRACTICE",
    quick: [
      "30 seconds…",
      "“Where is the strongest sensation in my body right now?”",
      "Breathe into it. Don’t fix anything. Just witness."
    ],
    startersTitle: "Starters",
    starters: [
      "The main feeling in me right now:",
      "What triggered me today:",
      "What I truly want to say:",
      "My honest confession:",
      "What I need today:"
    ],
    promptsTitle: "One-Line Prefill",
    prompts: [
      { id: "mirror", label: "Mirror", prefill: "In one clear sentence, my truth is: " },
      { id: "dream", label: "Dream", prefill: "Describe this dream like a scene: " },
      { id: "shadow", label: "Shadow", prefill: "What disturbs me is: " },
      { id: "light", label: "Light", prefill: "My purest feeling right now is: " }
    ],
    note:
      "Note: This space doesn’t diagnose or claim certainty. Meaning is shaped within you."
  };

  return lang === "en" ? en : tr;
}