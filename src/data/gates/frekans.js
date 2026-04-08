export const frekansGate = {
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
