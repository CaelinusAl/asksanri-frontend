[10:31, 12.02.2026] Celine River: export const bilincGate = {
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
    { id: "choice", label: "Seçim", prefill: "Şimdi yeni bir seçim yapıyorum. Seçimim:…
[10:32, 12.02.2026] Celine River: export const frekansGate = {
  title: "Frekans Alanı",
  subtitle: "Enerji katmanı",
  quick: [
    "Bugün 1 frekans seç.",
    "3 davranış: yap / yapma / yerine koy.",
    "Gün sonu kısa check-in."
  ],
  starters: [
    "Bugünün frekansı:",
    "Bu frekansın bedendeki hali:",
    "Bugün bunu büyüten 1 şey:",
    "Bugün bunu düşüren 1 şey:",
    "Gün sonu kapanış cümlem:"
  ],
  prompts: [
    { id: "clarify", label: "Netleştir", prefill: "Bugün hangi frekansta kalmalıyım ve bunu tek cümleyle netleştir: " },
    { id: "act", label: "Davranış", prefill: "Bu frekansı yükselten 3 davranış: " },
    { id: "stop", label: "Kes", prefill: "Bu frekansı düşüren 3 şeyi kesiyorum: " },
    { id: "seal", label: "Mühür", prefill: "Bu frekansı mühürleyen kısa niyetim: " }
  ],
  safetyNote:
    "Frekans Alanı hedef değil; yön. Küçük seçimler büyük akışa dönüşür."
};