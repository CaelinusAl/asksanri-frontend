import React from "react";
import { Link } from "react-router-dom";
import styles from "./LegalPages.module.css";

function LegalLayout({ title, children }) {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <Link to="/" className={styles.backLink}>← Ana Sayfa</Link>
        </div>
        <h1 className={styles.h1}>{title}</h1>
        <div className={styles.content}>{children}</div>
        <div className={styles.footerNote}>
          © {new Date().getFullYear()} CR YAPIM TEKNOLOJİLERİ REKLAM AJANSI TİC.LTD.ŞTİ. — CaelinusAI / SANRI
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HAKKIMIZDA
   ═══════════════════════════════════════════════════════════════ */

export function HakkimizdaPage() {
  return (
    <LegalLayout title="Hakkımızda">
      <section className={styles.section}>
        <h2>CAELINUS AI — SANRI Platformu</h2>
        <p>
          SANRI, bilinç uyanışı ve kişisel dönüşüm alanında dijital içerik sunan bir platformdur.
          Kullanıcılarına kitaplar, okumalar, ritüeller, frekans deneyimleri ve yapay zekâ destekli
          bilinç araçları sağlar.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Şirket Bilgileri</h2>
        <table className={styles.infoTable}>
          <tbody>
            <tr><td>Ticari Unvan</td><td>CR YAPIM TEKNOLOJİLERİ REKLAM AJANSI TİC.LTD.ŞTİ.</td></tr>
            <tr><td>Mersis No</td><td>—</td></tr>
            <tr><td>Vergi Dairesi</td><td>Kadıköy Rasimpaşa Vergi Dairesi</td></tr>
            <tr><td>Adres</td><td>Kadıköy, İstanbul, Türkiye</td></tr>
            <tr><td>E-posta</td><td><a href="mailto:caelinus@caelinus.co">caelinus@caelinus.co</a></td></tr>
            <tr><td>Web Sitesi</td><td><a href="https://asksanri.com">asksanri.com</a></td></tr>
          </tbody>
        </table>
      </section>

      <section className={styles.section}>
        <h2>Ne Sunuyoruz?</h2>
        <ul>
          <li><strong>Dijital Kitaplar</strong> — Bilinç uyanışı ve kişisel dönüşüm kitapları</li>
          <li><strong>Okuma Alanı</strong> — Derinlemesine okuma ve analiz içerikleri</li>
          <li><strong>Ritüel Alanı</strong> — Sesli rehberli meditasyon ve ritüel deneyimleri</li>
          <li><strong>Frekans Alanı</strong> — Bilinç frekansı araçları</li>
          <li><strong>SANRI AI</strong> — Yapay zekâ destekli bilinç rehberi</li>
          <li><strong>Yankı Alanı</strong> — Kullanıcı topluluğu ve paylaşım alanı</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>Ödeme ve Güvenlik</h2>
        <p>
          Tüm ödemeler <strong>iyzico</strong> güvencesiyle işlenir. Kredi kartı bilgileriniz
          sunucularımızda saklanmaz. Visa ve Mastercard kabul edilir.
        </p>
      </section>
    </LegalLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════
   GİZLİLİK POLİTİKASI
   ═══════════════════════════════════════════════════════════════ */

export function GizlilikPolitikasiPage() {
  return (
    <LegalLayout title="Gizlilik Politikası">
      <p className={styles.meta}>Son güncelleme: 31 Mart 2026</p>

      <section className={styles.section}>
        <h2>1. Veri Sorumlusu</h2>
        <p>
          CR YAPIM TEKNOLOJİLERİ REKLAM AJANSI TİC.LTD.ŞTİ. ("Şirket"), CAELINUS AI / SANRI platformunun
          veri sorumlusudur. İletişim: <a href="mailto:caelinus@caelinus.co">caelinus@caelinus.co</a>
        </p>
      </section>

      <section className={styles.section}>
        <h2>2. Toplanan Veriler</h2>
        <ul>
          <li><strong>Hesap Bilgileri:</strong> E-posta, ad-soyad, profil fotoğrafı (Google/Apple ile giriş)</li>
          <li><strong>Bilinç Profili:</strong> Onboarding cevapları (geliş nedeni, duygu durumu, tercihler)</li>
          <li><strong>Kullanım Verileri:</strong> Kullanılan özellikler, ritüel tamamlama durumu</li>
          <li><strong>Ödeme Bilgileri:</strong> Ödeme işlemleri iyzico üzerinden gerçekleşir; kart bilgileri sunucularımızda saklanmaz</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2>3. Verilerin Kullanım Amaçları</h2>
        <ul>
          <li>Hizmet sunumu ve kişiselleştirme</li>
          <li>Ödeme işlemlerinin yürütülmesi</li>
          <li>Yasal yükümlülüklerin yerine getirilmesi</li>
          <li>Platform güvenliğinin sağlanması</li>
        </ul>
        <p>Verileriniz üçüncü taraflarla <strong>paylaşılmaz</strong> ve <strong>satılmaz</strong>.</p>
      </section>

      <section className={styles.section}>
        <h2>4. Haklarınız (KVKK Madde 11)</h2>
        <ul>
          <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
          <li>İşlenmiş ise bilgi talep etme</li>
          <li>İşleme amacını ve amaca uygun kullanılıp kullanılmadığını öğrenme</li>
          <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme</li>
          <li>KVKK Madde 7 kapsamında silinmesini isteme</li>
          <li>Verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
          <li>Münhasıran otomatik sistemlerle analiz sonucu aleyhinize bir sonuç çıkmasına itiraz etme</li>
          <li>Kanuna aykırı işlenmesi sebebiyle zarara uğramanız halinde tazminat talep etme</li>
        </ul>
        <p>Başvuru: <a href="mailto:caelinus@caelinus.co">caelinus@caelinus.co</a></p>
      </section>

      <section className={styles.section}>
        <h2>5. Çerezler</h2>
        <p>
          Platformumuz oturum yönetimi için gerekli çerezleri kullanır. Analitik amaçlı
          üçüncü taraf çerezleri kullanılmaz.
        </p>
      </section>

      <section className={styles.section}>
        <h2>6. Veri Güvenliği</h2>
        <p>
          Verileriniz SSL/TLS ile şifrelenerek iletilir ve güvenli sunucularda saklanır. Hesap
          silme talebinden itibaren 30 gün içinde tüm veriler kalıcı olarak silinir.
        </p>
      </section>
    </LegalLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MESAFELİ SATIŞ SÖZLEŞMESİ
   ═══════════════════════════════════════════════════════════════ */

export function MesafeliSatisPage() {
  return (
    <LegalLayout title="Mesafeli Satış Sözleşmesi">
      <p className={styles.meta}>Son güncelleme: 31 Mart 2026</p>

      <section className={styles.section}>
        <h2>1. Taraflar</h2>
        <p><strong>SATICI:</strong></p>
        <table className={styles.infoTable}>
          <tbody>
            <tr><td>Ticari Unvan</td><td>CR YAPIM TEKNOLOJİLERİ REKLAM AJANSI TİC.LTD.ŞTİ.</td></tr>
            <tr><td>Adres</td><td>Kadıköy, İstanbul, Türkiye</td></tr>
            <tr><td>E-posta</td><td><a href="mailto:caelinus@caelinus.co">caelinus@caelinus.co</a></td></tr>
          </tbody>
        </table>
        <p style={{ marginTop: 12 }}>
          <strong>ALICI:</strong> Platformda satın alma işlemi gerçekleştiren kullanıcı.
        </p>
      </section>

      <section className={styles.section}>
        <h2>2. Sözleşmenin Konusu</h2>
        <p>
          İşbu sözleşme, ALICI'nın SATICI'ya ait <strong>asksanri.com</strong> platformundan
          satın aldığı dijital içerik ve hizmetlerin satışına ilişkin tarafların hak ve
          yükümlülüklerini düzenler. 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve
          Mesafeli Sözleşmeler Yönetmeliği hükümlerine uygun olarak düzenlenmiştir.
        </p>
      </section>

      <section className={styles.section}>
        <h2>3. Ürün/Hizmet Bilgileri</h2>
        <p>Platform üzerinden sunulan dijital ürün ve hizmetler:</p>
        <ul>
          <li><strong>Dijital Kitaplar:</strong> 112. Kitap (₺369), Matrix Code: İkra (₺470) vb.</li>
          <li><strong>Tek İçerik Açma:</strong> Okuma, ritüel veya kitap bazında tekli satın alma</li>
          <li><strong>Haftalık Geçiş:</strong> 7 günlük tüm içeriklere erişim</li>
          <li><strong>Premium Abonelik:</strong> Aylık veya yıllık tam erişim</li>
        </ul>
        <p>
          Fiyatlar Türk Lirası (TL) cinsindendir ve KDV dahildir.
        </p>
      </section>

      <section className={styles.section}>
        <h2>4. Ödeme Bilgileri</h2>
        <p>
          Ödemeler <strong>iyzico</strong> ödeme altyapısı üzerinden güvenli şekilde işlenir.
          Visa ve Mastercard kredi/banka kartları kabul edilir. Kart bilgileri
          sunucularımızda saklanmaz; tüm kart verileri iyzico tarafından PCI-DSS
          standartlarına uygun olarak korunur.
        </p>
      </section>

      <section className={styles.section}>
        <h2>5. Teslimat</h2>
        <p>
          Tüm ürünler <strong>dijital içerik</strong> niteliğindedir. Ödeme onayının ardından
          içerik <strong>anında</strong> kullanıcı hesabına tanımlanır. Fiziksel teslimat söz
          konusu değildir.
        </p>
      </section>

      <section className={styles.section}>
        <h2>6. Cayma Hakkı</h2>
        <p>
          6502 sayılı Kanun'un 53/ğ maddesi ve Mesafeli Sözleşmeler Yönetmeliği'nin 15/ğ maddesi
          gereğince, <strong>dijital içeriklerin teslimi başladıktan sonra cayma hakkı kullanılamaz</strong>.
        </p>
        <p>
          Satın alma işlemi tamamlandığında dijital içerik anında teslim edildiğinden, cayma hakkı
          bulunmamaktadır. Kullanıcı, bu durumu satın alma öncesinde kabul eder.
        </p>
      </section>

      <section className={styles.section}>
        <h2>7. Uyuşmazlık Çözümü</h2>
        <p>
          İşbu sözleşmeden kaynaklanan uyuşmazlıklarda İstanbul Anadolu Tüketici Hakem
          Heyetleri ve Tüketici Mahkemeleri yetkilidir.
        </p>
      </section>
    </LegalLayout>
  );
}

/* ═══════════════════════════════════════════════════════════════
   İADE KOŞULLARI
   ═══════════════════════════════════════════════════════════════ */

export function IadeKosullariPage() {
  return (
    <LegalLayout title="İade ve İptal Koşulları">
      <p className={styles.meta}>Son güncelleme: 31 Mart 2026</p>

      <section className={styles.section}>
        <h2>Dijital İçerik — İade Politikası</h2>
        <p>
          CAELINUS AI / SANRI platformunda satışa sunulan tüm ürünler <strong>dijital içerik</strong>
          niteliğindedir. Dijital içerikler, satın alma işleminin tamamlanmasıyla birlikte
          <strong> anında</strong> kullanıcı hesabına tanımlanır ve erişime açılır.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Yasal Dayanak</h2>
        <p>
          6502 sayılı Tüketicinin Korunması Hakkında Kanun'un 53. maddesi ve Mesafeli Sözleşmeler
          Yönetmeliği'nin 15. maddesi uyarınca:
        </p>
        <blockquote className={styles.quote}>
          "Elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen
          gayrimaddi mallara ilişkin sözleşmelerde cayma hakkı kullanılamaz."
        </blockquote>
        <p>
          Bu kapsamda, dijital içeriklerin teslimi başladıktan sonra <strong>iade ve cayma hakkı
          bulunmamaktadır</strong>.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Hangi Durumlarda İade Yapılır?</h2>
        <ul>
          <li>Teknik bir sorun nedeniyle içeriğe hiç erişilememesi</li>
          <li>Mükerrer (çift) ödeme yapılması</li>
          <li>Satın alınan ürünün açıklamasıyla uyuşmaması</li>
        </ul>
        <p>
          Bu durumlar için <a href="mailto:caelinus@caelinus.co">caelinus@caelinus.co</a> adresine
          başvurabilirsiniz. Talepler 7 iş günü içinde değerlendirilir.
        </p>
      </section>

      <section className={styles.section}>
        <h2>Abonelik İptali</h2>
        <p>
          Premium abonelikler dönem sonuna kadar aktif kalır. İptal talebi sonraki dönem
          için geçerli olur; mevcut dönem için iade yapılmaz. Abonelik iptali için
          profil sayfasından veya e-posta ile talepte bulunabilirsiniz.
        </p>
      </section>

      <section className={styles.section}>
        <h2>İletişim</h2>
        <p>
          İade ve iptal talepleriniz için: <a href="mailto:caelinus@caelinus.co">caelinus@caelinus.co</a>
        </p>
      </section>
    </LegalLayout>
  );
}
