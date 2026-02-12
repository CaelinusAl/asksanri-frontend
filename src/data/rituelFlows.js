// src/data/rituelFlows.js

export const rituelFlows = [
  {
    key: "rituel_60",
    title: { tr: "60 Saniye Ritüel", en: "60-Second Ritual" },
    desc: { tr: "Anında düzenleme protokolü.", en: "Instant regulation protocol." },
    prefill: {
      tr: "Şu an için 60 saniyelik bir ritüel yaz. Niyetim: ____",
      en: "Write a 60-second ritual for now. My intention: ____"
    },
    steps: {
      tr: [
        { t: "DUR", b: "Omuzlarını bırak.\nÇeneni yumuşat.\nBir nefes." },
        { t: "NİYET", b: "Niyetini tek cümle yaz:\n“Ben şimdi ____ seçiyorum.”" },
        { t: "NEFES", b: "4-2-6 nefes (1 tur):\n4 al • 2 tut • 6 ver." },
        { t: "MÜHÜR", b: "Mühür:\n“Oldu.”\n“Ben hissettim, o yüzden oldu.”" },
        { t: "TEŞEKKÜR", b: "Son cümle:\n“Teşekkür.”" }
      ],
      en: [
        { t: "PAUSE", b: "Drop your shoulders.\nSoften your jaw.\nOne breath." },
        { t: "INTENTION", b: "One sentence intention:\n“I choose ____ now.”" },
        { t: "BREATH", b: "4-2-6 breathing (1 round):\n4 in • 2 hold • 6 out." },
        { t: "SEAL", b: "Seal:\n“It is done.”\n“I felt it, therefore it is.”" },
        { t: "THANK YOU", b: "Final line:\n“Thank you.”" }
      ]
    }
  },

  {
    key: "su_arinma",
    title: { tr: "Su ile Arınma", en: "Water Cleansing" },
    desc: { tr: "30 saniyelik arınma.", en: "30-second cleanse." },
    prefill: {
      tr: "Su ile 30 saniyelik arınma ritüeli yaz. Niyetim: ____",
      en: "Write a 30-second water cleansing ritual. Intention: ____"
    },
    steps: {
      tr: [
        { t: "DUR", b: "Bir bardak su al.\nÖnünde tut." },
        { t: "YÜKLE", b: "Suyun içine şu cümleyi söyle:\n“Bu su beni temizliyor.”" },
        { t: "İÇ", b: "3 yudum.\nHer yudumda:\n“Arınıyorum.”" },
        { t: "MÜHÜR", b: "Mühür:\n“Yeni alan açıldı.”" }
      ],
      en: [
        { t: "PAUSE", b: "Hold a glass of water in front of you." },
        { t: "CHARGE", b: "Say into the water:\n“This water cleanses me.”" },
        { t: "DRINK", b: "3 sips.\nEach sip:\n“I cleanse.”" },
        { t: "SEAL", b: "Seal:\n“A new space is open.”" }
      ]
    }
  },

  {
    key: "nefes_7",
    title: { tr: "7 Döngü Nefes", en: "7-Breath Cycles" },
    desc: { tr: "Kısa reset ve hizalama.", en: "Quick reset & alignment." },
    prefill: {
      tr: "7 döngülük nefes ritüeli yaz. Niyetim: ____",
      en: "Write a 7-cycle breath ritual. My intention: ____"
    },
    steps: {
      tr: [
        { t: "DUR", b: "Gözlerini kapat.\nOmuzlarını bırak." },
        { t: "DÖNGÜ", b: "7 döngü:\n4 al • 2 tut • 6 ver\nHer döngüde “yumuşuyorum” de." },
        { t: "MÜHÜR", b: "Mühür:\n“Şimdi hizadayım.”" }
      ],
      en: [
        { t: "PAUSE", b: "Close your eyes.\nDrop your shoulders." },
        { t: "CYCLES", b: "7 cycles:\n4 in • 2 hold • 6 out\nEach cycle: “I soften.”" },
        { t: "SEAL", b: "Seal:\n“I am aligned now.”" }
      ]
    }
  }
];