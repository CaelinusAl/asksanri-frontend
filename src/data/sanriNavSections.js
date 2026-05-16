/**
 * Drawer ve footer «Tüm Alanlar» bileşenleri için ortak link grupları.
 * URL'ler değişmez; tekrarlayan navigasyon tek kaynakta tutulur.
 */
export function buildSanriNavSections(isAuthenticated) {
  return [
    {
      titleTr: "Sanrı dünyası",
      titleEn: "SANRI world",
      items: [
        { to: "/sanriya-sor", tr: "Sanrı'ya Sor", en: "Ask SANRI" },
        { to: "/", tr: "Ana sayfa", en: "Home", end: true },
        { to: "/rol-okuma", tr: "Rol Okuma", en: "Role Reading" },
      ],
    },
    {
      titleTr: "Alanlar",
      titleEn: "Fields",
      items: [
        { to: "/frekans", tr: "Frekans", en: "Frequency" },
        { to: "/yanki", tr: "Yankı Alanı", en: "Echo Field" },
        { to: "/bilinc-alani", tr: "Bilinç Alanı", en: "Consciousness Field" },
        { to: "/rituel-alani", tr: "Ritüel Alanı", en: "Ritual Field" },
        { to: "/kapilar", tr: "Kapılar (tüm alanlar)", en: "Gates (all areas)" },
      ],
    },
    {
      titleTr: "İçerikler",
      titleEn: "Content",
      items: [
        { to: "/okuma-alani", tr: "Okumalar", en: "Readings" },
        { to: "/library", tr: "Kütüphane", en: "Library" },
        { to: "/blog", tr: "Blog", en: "Blog" },
        { to: "/uyanan-sehirler", tr: "Uyanan Şehirler", en: "Awakened Cities" },
      ],
    },
    {
      titleTr: "Kod & matrix",
      titleEn: "Code & matrix",
      items: [
        { to: "/kod-egitmeni", tr: "Kod Eğitmeni", en: "Code Tutor" },
        { to: "/an-kod", tr: "AN-KOD", en: "AN-KOD" },
        { to: "/goz-acik-gunes", tr: "Göz Açık Güneş", en: "Open-Eye Sun" },
      ],
    },
    {
      titleTr: "Topluluk & mağaza",
      titleEn: "Community & shop",
      items: [
        { to: "/sanri-ag", tr: "Sanrı Ağı", en: "Sanrı Mesh" },
        { to: "/art-gallery", tr: "Sanat Galerisi", en: "Art Gallery" },
      ],
    },
    {
      titleTr: "Hesap",
      titleEn: "Account",
      items: isAuthenticated
        ? [
            { to: "/benim-alanim", tr: "Benim Alanım", en: "My Space" },
            { to: "/profil", tr: "Profil", en: "Profile" },
            { to: "/subscription", tr: "Abonelik", en: "Subscription" },
          ]
        : [{ to: "/giris", tr: "Giriş yap", en: "Sign in" }],
    },
    {
      titleTr: "Hakkında",
      titleEn: "About",
      items: [
        { to: "/hakkimizda", tr: "Hakkımızda", en: "About" },
        { to: "/gizlilik-politikasi", tr: "Gizlilik", en: "Privacy" },
        { to: "/mesafeli-satis", tr: "Mesafeli Satış", en: "Distance Sales" },
        { to: "/iade-kosullari", tr: "İade Koşulları", en: "Refund Policy" },
      ],
    },
  ];
}
