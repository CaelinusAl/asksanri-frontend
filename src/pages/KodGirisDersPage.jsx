import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  redirectToShopier,
  isShopierUnlocked,
  syncPurchasesFromServer,
} from "../data/shopierConfig";
import {
  PRICE_CANLI_GIRIS_DERS,
  PRICE_KOD_TAM_PROGRAM,
} from "../data/kodEgitmeniData";
import { trackFunnelEvent } from "../data/funnelTracker";
import { trackEvent } from "../data/analytics";
import BankTransferLink from "../components/BankTransferLink";
import {
  KOD_CONTENT_ID_ILK_KAPI,
  KOD_PRODUCT_DEBUG_AMOUNT,
  KOD_PRODUCT_DEBUG_LABEL,
} from "../data/kodPaymentContentIds";
import styles from "./KodGirisDersPage.module.css";

export const KOD_GIRIS_CONTENT_ID = KOD_CONTENT_ID_ILK_KAPI;

const PRODUCT_TITLE = "Kod Öğrenmeye Giriş — Zihni Aç, Sistemi Kur";

const AD_COPY = `Kod öğrenmek zor değil.

Yanlış öğreniyorsun.

Sana syntax değil,
zihin öğreten bir ders açtım.

İlk ders: 47 TL

Ama herkes için değil.`;

const BONUS_CLOSING = `Bu sadece kapıydı.
İçeri girmek istiyorsan devamı var.`;

export default function KodGirisDersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [unlocked, setUnlocked] = useState(() => isShopierUnlocked(KOD_CONTENT_ID_ILK_KAPI));

  useEffect(() => {
    trackFunnelEvent("kod_giris_landing_view");
  }, []);

  useEffect(() => {
    let c = false;
    (async () => {
      await syncPurchasesFromServer();
      if (!c && isShopierUnlocked(KOD_CONTENT_ID_ILK_KAPI)) {
        setUnlocked(true);
        trackFunnelEvent("kod_giris_unlock_confirmed");
      }
    })();
    return () => {
      c = true;
    };
  }, []);

  useEffect(() => {
    if (searchParams.get("tesekkur") === "1") {
      trackFunnelEvent("kod_giris_return_from_checkout");
    }
  }, [searchParams]);

  const onCheckout = useCallback(() => {
    trackFunnelEvent("kod_giris_shopier_click");
    trackEvent("kod_giris_cta_click", { price: PRICE_CANLI_GIRIS_DERS });
    redirectToShopier(
      "kod_giris_ders",
      KOD_CONTENT_ID_ILK_KAPI,
      "/kod-ogrenmeye-giris?tesekkur=1"
    );
  }, []);

  const copyAd = useCallback(async () => {
    trackEvent("kod_giris_ad_copy", { action: "copy_ad_script" });
    try {
      await navigator.clipboard?.writeText(AD_COPY);
    } catch {
      /* ignore */
    }
  }, []);

  const showThanks = unlocked || searchParams.get("tesekkur") === "1";

  return (
    <div className={styles.page}>
      <div className={styles.orb} aria-hidden />
      <header className={styles.topbar}>
        <button type="button" className={styles.backBtn} onClick={() => navigate("/")}>
          ← Kapılar
        </button>
        <span className={styles.badge}>Canlı ders</span>
      </header>

      <main className={styles.main}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <h1 className={styles.title}>Kod Öğrenmeye Giriş</h1>
          <p className={styles.productName}>{PRODUCT_TITLE}</p>

          {showThanks && (
            <div className={styles.purchasedBanner}>
              <p>
                Ödemen tamamlandıysa canlı ders ve kayıt erişimi için sana dönüş yapılacak.
                Bu sayfayı sakla.
              </p>
            </div>
          )}

          <p className={styles.heroLead}>Kod yazmak öğrenmek değil. Kod düşünmek öğrenmek.</p>

          <div className={styles.heroSub}>
            <p>Bu ders sana yazılım öğretmez.</p>
            <p>Sana sistemi nasıl okuyacağını öğretir.</p>
            <p>
              Kod sadece araç.
              <br />
              Asıl olan bakış açısı.
            </p>
          </div>

          <p className={styles.sectionLabel}>Bu derste</p>
          <ul className={styles.list}>
            <li>Kod nedir gerçekten?</li>
            <li>Nasıl düşünür yazılımcı?</li>
            <li>Mantık kurma sistemi</li>
            <li>Basit algoritma mantığı</li>
            <li>İlk mini uygulama</li>
          </ul>
          <p className={styles.listNote}>Hiç bilmeyenler için. Ama yüzeysel değil.</p>

          <div className={styles.priceCard}>
            <p className={styles.priceTag}>İlk Ders: {PRICE_CANLI_GIRIS_DERS} TL</p>
            <p className={styles.priceSub}>Canlı + Kayıt erişimi</p>
          </div>

          <button type="button" className={styles.cta} onClick={onCheckout}>
            Kartla Anında Öde — {PRICE_CANLI_GIRIS_DERS} TL
          </button>
          <BankTransferLink
            contentId={KOD_CONTENT_ID_ILK_KAPI}
            returnTo="/kod-ogrenmeye-giris"
            className={styles.havaleLink}
            debugProduct={KOD_PRODUCT_DEBUG_LABEL[KOD_CONTENT_ID_ILK_KAPI]}
            debugAmount={KOD_PRODUCT_DEBUG_AMOUNT[KOD_CONTENT_ID_ILK_KAPI]}
          >
            Havale / EFT ile öde
          </BankTransferLink>
          <p className={styles.ctaHint}>Bu sadece başlangıç.</p>

          <p className={styles.bonusQuote}>{BONUS_CLOSING}</p>

          <div className={styles.adBox}>
            <p className={styles.adLabel}>Reklam metni (kopyala)</p>
            <p className={styles.adText}>{AD_COPY}</p>
            <button type="button" className={styles.copyAdBtn} onClick={copyAd}>
              Metni kopyala
            </button>
          </div>

          <p className={styles.psycho}>
            Bu metin elit hissi verir: “ben farklıyım”. Merak + ego tetikler; herkese seslenmez.
          </p>

          <div className={styles.funnel}>
            <strong>Funnel:</strong> Reklam → {PRICE_CANLI_GIRIS_DERS} TL ders → “Devam etmek
            ister misin?” → <strong>Tam Kod Eğitimi: {PRICE_KOD_TAM_PROGRAM} TL</strong> (Kod
            Eğitmeni).
          </div>

          <section className={styles.upsell}>
            <h3>Tam programa geçiş</h3>
            <p>
              Ders sonunda hatırlat: bu kapıydı. Derin kod, sistem ve sembol okuma için tam
              eğitim <strong>{PRICE_KOD_TAM_PROGRAM} TL</strong> upsell ile Kod Eğitmeni’nde.
            </p>
            <Link className={styles.upsellBtn} to="/kod-egitmeni">
              Kod Eğitmeni’ne git →
            </Link>
          </section>

          {import.meta.env.DEV && !import.meta.env.VITE_SHOPIER_KOD_GIRIS_URL ? (
            <p className={styles.envHint}>
              Dev: Shopier 47 TL linki için .env içine VITE_SHOPIER_KOD_GIRIS_URL ekleyin.
            </p>
          ) : null}
        </motion.div>
      </main>
    </div>
  );
}
