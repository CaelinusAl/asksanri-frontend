const DAILY_QUESTIONS = [
  { tr: "Bugün seni en çok ne durdurdu?", en: "What stopped you most today?" },
  { tr: "Şu an bedeninde nereyi hissediyorsun?", en: "Where in your body do you feel right now?" },
  { tr: "Bugün hangi duyguyu bastırdın?", en: "Which emotion did you suppress today?" },
  { tr: "Son bir haftada en çok tekrar eden düşüncen ne?", en: "What's your most recurring thought this week?" },
  { tr: "Korktuğun ama istediğin şey ne?", en: "What do you fear but desire?" },
  { tr: "Bugün kime teşekkür etmedin?", en: "Who didn't you thank today?" },
  { tr: "Şu an bırakman gereken şey ne?", en: "What do you need to let go of right now?" },
  { tr: "Son gördüğün rüyada ne vardı?", en: "What was in your last dream?" },
  { tr: "Seni en çok ne yoruyor?", en: "What exhausts you the most?" },
  { tr: "Bugün kendine ne söyledin?", en: "What did you tell yourself today?" },
  { tr: "Hayatında sessizce değişen ne var?", en: "What is quietly changing in your life?" },
  { tr: "Hangi alışkanlığın seni tutuyor?", en: "Which habit holds you back?" },
  { tr: "Bugün neyi ertelemeden yaptın?", en: "What did you do without procrastinating today?" },
  { tr: "İçindeki çocuk şu an ne istiyor?", en: "What does your inner child want right now?" },
  { tr: "Sana en son ne ilham verdi?", en: "What last inspired you?" },
  { tr: "Bugün hangi sesi duymadın?", en: "Which voice did you ignore today?" },
  { tr: "Gerçekten dinlediğin son kişi kimdi?", en: "Who was the last person you truly listened to?" },
  { tr: "Neyin değişmesini bekliyorsun?", en: "What are you waiting to change?" },
  { tr: "Bugün en dürüst anın hangisiydi?", en: "What was your most honest moment today?" },
  { tr: "Sessizlikte ne duyuyorsun?", en: "What do you hear in silence?" },
  { tr: "Hangi ilişkin sana ayna tutuyor?", en: "Which relationship mirrors you?" },
  { tr: "Bugün hangi maskeyi taktın?", en: "Which mask did you wear today?" },
  { tr: "Seni en çok kızdıran şeyin altında ne var?", en: "What lies beneath what angers you most?" },
  { tr: "Bugün neyi ilk kez fark ettin?", en: "What did you notice for the first time today?" },
  { tr: "Hangi anda tamamen kendin oldun?", en: "In which moment were you fully yourself?" },
  { tr: "Beden ne söylüyor, zihin ne söylüyor?", en: "What does the body say vs. the mind?" },
  { tr: "Bugün sana gelen işaret ne?", en: "What sign came to you today?" },
  { tr: "Neye inanmayı bıraktın?", en: "What did you stop believing in?" },
  { tr: "Seni tutan tek düşünce ne?", en: "What single thought holds you?" },
  { tr: "Bugün kalbin ne istedi?", en: "What did your heart want today?" },
  { tr: "Hayatında fazla olan ne, eksik olan ne?", en: "What's in excess, what's missing in your life?" },
];

export function getDailyQuestion() {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  return DAILY_QUESTIONS[dayOfYear % DAILY_QUESTIONS.length];
}

export default DAILY_QUESTIONS;
