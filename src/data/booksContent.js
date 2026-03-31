export const booksMetadata = [
  {
    id: "kitap_112",
    title: "112. Kitap: Kendini Yaratan Tanrıça",
    author: "Celine River",
    description:
      "İlahi hatırlayış ve bilinç uyanışı metni. Her bölüm bir 'Kapı' gibi açılır.",
    cover: "/assets/gates/kutuphane.jpg",
    color: "#c8a0ff",
    jsonFile: "/books/kitap_112.json",
    chapters: [
      "Kitabın Niyeti",
      "Zihnin Oyunu",
      "Zaman-Para-Ölüm Üçgeni",
      "Kendini Yaratan",
      "Dişilin Geri Dönüşü",
      "Caelinus: Cennete Ait Olan",
      "Tanrı İçeriden Konuşur",
      "Uyanıştan Sonra Ne Olur?",
      "Boşluk ve Birleşme",
    ],
  },
  {
    id: "matrix_code",
    title: "Matrix Code: İkra",
    author: "Celine River & Rahmi Ergün",
    description:
      "Seçilmişlerin yolculuğu. Kodların öğretisi, evrensel semboller ve bilinç yükselişi.",
    cover: "/assets/gates/bilinc.jpg",
    color: "#48BB78",
    jsonFile: "/books/matrix_code.json",
    chapters: [
      "Giriş: Seçilmişlerin Yolculuğu",
      "Ruhsal Uyanış: Benim Hikâyem",
      "Kodların Öğretisi",
      "Evren, Bilinç ve Cehennemden Geçiş",
      "Kurban Edilen Dişil Enerji",
      "Simülasyonun Sesi",
      "Ay, Güneş ve Bilinç Yükselişi",
      "Yazı, Yazgı ve Gizli Mesajlar",
      "Matrix Sayı Kodları",
      "Metatronik Izgara",
      "Dünya: Bir Aşk Hikâyesi",
      "Cehennem, Kuyu ve Bilgelik",
      "Gözyaşı ve Ruhun Arınması",
    ],
  },
  {
    id: "nurun_frekansi",
    title: "Nurun Frekansı",
    author: "Celine River",
    description:
      "Âl-i İmrân Suresi — Işık, soy, rahim ve sırrın frekansla açılışı.",
    cover: "/assets/gates/frekans.jpg",
    color: "#ED8936",
    jsonFile: "/books/nurun_frekansi.json",
    chapters: [
      "Hayy'dan İmrân'a",
      "Elif. Lâm. Mîm.",
      "Ölçüyü Koyan",
      "Işığın Rahminde",
      "Nurun Sebebi",
    ],
  },
  {
    id: "oku",
    title: "OKU",
    author: "Celine River",
    description:
      "İkra — Oku demek değil, Hatırla demek. Bakara Suresi: Bilincin Aynası.",
    cover: "/assets/gates/sanri.jpg",
    color: "#E53E3E",
    jsonFile: "/books/oku.json",
    chapters: [
      "İkra – Hatırla",
      "Fâtiha – Bilincin Kapısı",
      "Bakara – Benliğin İmtihanı",
      "Nuru Satmak",
      "Yaradan'ı Hatırlayan",
      "Dua Mührü",
    ],
  },
];

export async function loadBookPages(bookId) {
  const meta = booksMetadata.find((b) => b.id === bookId);
  if (!meta) return [];
  const res = await fetch(meta.jsonFile);
  const pages = await res.json();
  return pages;
}
