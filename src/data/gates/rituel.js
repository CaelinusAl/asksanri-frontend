export const rituelGate = {
  title: "Ritüel Alanı",
  subtitle: "Özel kapı",
  quick: [
    "60 saniyelik mini ritüel",
    "Niyet + 1 hareket + 1 cümle mühür",
    "Bitince teşekkür"
  ],
  starters: [
    "Niyetim:",
    "Şu an bıraktığım şey:",
    "Şu an çağırdığım şey:",
    "Bunu mühürleyen cümlem:",
    "Teşekkür:"
  ],
  prompts: [
    { id: "60s", label: "60sn Ritüel", prefill: "Şu an için 60 saniyelik bir ritüel yaz. Niyetim: " },
    { id: "water", label: "Su", prefill: "Su ile yapılacak 30 saniyelik arınma ritüeli yaz. Niyetim: " },
    { id: "breath", label: "Nefes", prefill: "Nefes ile 7 döngülük mini ritüel yaz. Niyetim: " },
    { id: "seal", label: "Mühür", prefill: "Bu ritüelin mühür cümlesi tek satır: " }
  ],
  safetyNote:
    "Ritüel Alanı güvenli, kısa ve uygulanabilir pratikler üretir. Tıbbi iddia içermez."
};