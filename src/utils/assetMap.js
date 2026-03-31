const GATE_IMG = {
  0: "/assets/master/esik.jpg",
  1: "/assets/master/ayna.jpg",
  2: "/assets/master/eros.jpg",
  4: "/assets/master/catisma.jpg",
  6: "/assets/master/kod.jpg",
  7: "/assets/master/golge.jpg",
  9: "/assets/master/oyun.jpg",
};

const CITY_IMG = {
  adana: "/assets/cities/adana.jpg",
};

const FIRE = new Set([
  "Ateş","Güneş","Sıcaklık","Enerji","Işık","Savaş","Başlangıç","Şenlik",
]);
const WATER = new Set([
  "Su","Deniz","Buz","Göl","Yağmur","Akış","Şeffaflık","Yansıma","Cam",
  "Soğuk","Kış","Şifa","Derinlik","Liman",
]);
const EARTH = new Set([
  "Toprak","Dağ","Merkez","Tohum","Kale","Dayanıklılık","Kültür","Mimari",
  "Gelenek","Sınır","Koruma","Savunma","Ticaret","Sanayi","Üretim","Değer",
  "Sadakat","Yükselme","Yükseklik","Desen","Beslenme","Koku",
]);
const AIR = new Set([
  "Hava","Rüya","Duman","Ether","Masal","Dil","Müzik","Sanat","Gece",
  "Döngü","Dönüşüm","Bilgi","Özgürlük","Barış","Geçit","Antik",
  "Tatlı","Tat","Şekil","Bağlantı","Orman","Yeşil","Yenilenme","Genişlik",
  "Yolculuk",
]);

const ELEMENT_IMG = {
  fire:  "/assets/elements/fire.jpg",
  water: "/assets/elements/water.jpg",
  earth: "/assets/elements/earth.jpg",
  air:   "/assets/elements/air.jpg",
};

export function getGateImage(gateIndex) {
  return GATE_IMG[Number(gateIndex)] || null;
}

export function getCityImage(cityName) {
  if (!cityName) return null;
  return CITY_IMG[cityName.toLowerCase()] || null;
}

export function getElementImage(elementName) {
  if (!elementName) return ELEMENT_IMG.earth;
  if (FIRE.has(elementName))  return ELEMENT_IMG.fire;
  if (WATER.has(elementName)) return ELEMENT_IMG.water;
  if (EARTH.has(elementName)) return ELEMENT_IMG.earth;
  if (AIR.has(elementName))   return ELEMENT_IMG.air;
  return ELEMENT_IMG.earth;
}

export function getElementGroup(elementName) {
  if (FIRE.has(elementName))  return "fire";
  if (WATER.has(elementName)) return "water";
  if (EARTH.has(elementName)) return "earth";
  if (AIR.has(elementName))   return "air";
  return "earth";
}
