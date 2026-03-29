// data/awakenedCities.ts
export const AWAKENED_CITIES = {
  meta: {
    language: "tr",
    flow: [
      "01-16: Uyanış kıvılcımı (wake up)",
      "17-32: Desen/tekrar/işaret okuma",
      "33-48: Gölge + arınma + karar",
      "49-64: Sistem haritası + rol/aktör",
      "65-81: Code Eye + yaratıcı mod",
    ],
    instruction:
      "Kullanıcı plaka kodu seçtiğinde ilgili metni göster. En alta kullanıcı cümlesi eklenebilir ve 'Şimdi...' ile bağlanır.",
  },
  cities: {
    "01": { city: "Adana", prompt: "01. İlk kıvılcım. Sıcaklık değil—uyanış başlıyor.\\nBurada sistem seni hızla test eder.\\nSoru: Bugün hangi gerçeği erteledin?" },
    "02": { city: "Adıyaman", prompt: "02. Hafıza kapısı açılır.\\nSessiz olan şey konuşmak ister.\\nSoru: İçinde sakladığı…
 import { CityCode } from "./awakenedCities";

type LangBlock = {
  title: string;
  story: string;
  reflection: string;
};

export const AWAKENED_CONTENT: Record<
  CityCode,
  { tr: LangBlock; en: LangBlock }
> = {
  "01": {
    tr: {
      title: "01 · Ateşin Çağrısı",
      story:
        "Adana ateştir. Sıcaklık yalnızca hava değildir. İçinde yanmak isteyen bir kıvılcım vardır.",
      reflection:
        "Bugün seni yakan şey aslında hangi dönüşümü başlatmak istiyor?",
    },
    en: {
      title: "01 · Call of Fire",
      story:
        "Adana is fire. Heat is not temperature. A spark inside you wants to ignite.",
      reflection:
        "What is burning in you that wants to become transformation?",
    },
  },

  "02": {
    tr: {
      title: "02 · Taş Hafıza",
      story:
        "Nemrut’un taş yüzleri zamanı bekler. Hafıza sandığın şey aslında sistem kaydıdır.",
      reflection:
        "Hangi eski cümle bilinçaltında hâlâ çalışıyor?",
    },
    en: {
      title: "02 · Stone Memory",
      story:
        "The stone faces wait through time. What you call memory is archived code.",
      reflection:
        "What old sentence is still running your system?",
    },
  },
};