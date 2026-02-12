export const bilincGate = {
  title: "Bilinç Alanı",
  subtitle: "Derin sorgu alanı",
  quick: [
    "Tek konu seç.",
    "3 katman: Bedende his / Düşünce / Kök ihtiyaç.",
    "Sonunda tek cümle niyet."
  ],
  starters: [
    "Bedenimde en güçlü yer:",
    "Aklımın ürettiği hikâye:",
    "Bunun altındaki korku:",
    "Asıl ihtiyacım:",
    "Bugün seçtiğim niyet:"
  ],
  prompts: [
    { id: "scan", label: "Beden Taraması", prefill: "Şu an bedenimde en güçlü his nerede? Orayı tarif ediyorum: " },
    { id: "belief", label: "İnanç", prefill: "Bu durumla ilgili temel inancım şu: " },
    { id: "need", label: "İhtiyaç", prefill: "Bu inancın altında aslında ihtiyacım olan: " },
    { id: "choice", label: "Seçim", prefill: "Şimdi yeni bir seçim yapıyorum. Seçimim: " }
  ],
  safetyNote:
    "Bilinç Alanı bir terapi yerine geçmez; yön verir, düzen kurar, farkındalık açar."
};