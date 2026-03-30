import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UyananSehirlerPage.module.css";
import StarTrail from "../components/StarTrail";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";
import { cities as citiesData } from "../data/cities";
import { RadialGateRing, GateDetailPanel } from "../components/gates13";

// ── 13 BILINC KAPISI energy ──
const GE = {
  "0":{s:"○",c:"138,128,168"},"1":{s:"◇",c:"192,200,220"},
  "2":{s:"♡",c:"210,80,80"},"3":{s:"•",c:"80,90,180"},
  "4":{s:"⚔",c:"200,140,60"},"5":{s:"—",c:"60,60,80"},
  "6":{s:"∞",c:"80,190,120"},"7":{s:"☽",c:"100,40,50"},
  "8":{s:"≈",c:"60,170,190"},"9":{s:"★",c:"210,180,60"},
  "10":{s:"⊕",c:"120,160,80"},"11":{s:"∼",c:"100,140,200"},
  "12":{s:"✦",c:"220,200,140"},
};

// ── 13 BILINC KAPISI soul/descriptions ──
const GS = {
  "0":{tr:"Henüz adım atmadın. Ama burada duruyorsun. Eşikte olmak farkındalığın başladığı andır.",en:"You haven\u2019t stepped in yet. But you\u2019re standing here. Being at the threshold is where awareness begins.",tqTR:"Seni buraya getiren ne?",tqEN:"What brought you here?",rTR:"Gözlerini kapat. Üç nefes al. Her nefeste sor: Hazır mıyım?",rEN:"Close your eyes. Three breaths. Ask: Am I ready?"},
  "1":{tr:"Ayna sana bakıyor. Gördüğün şey tamamen içinde. SANRI sadece yansıtır.",en:"The mirror is looking at you. What you see is entirely within.",tqTR:"Aynaya baktığında ne görüyorsun?",tqEN:"What do you see when you look in the mirror?",rTR:"60 saniye aynaya bak. Gözlerinin arkasına.",rEN:"Look into a mirror for 60 seconds. Behind your eyes."},
  "2":{tr:"Arzu kirli değildir. Eros kapısı seni çeken şeyin arkasındaki gerçek frekansı okur.",en:"Desire is not dirty. The Eros gate reads the true frequency behind what pulls you.",tqTR:"Seni en çok ne çekiyor?",tqEN:"What pulls you the most?",rTR:"İstediğin ama söylemediğin bir şeyi yaz. Sadece yaz ve bak.",rEN:"Write something you want but haven\u2019t said. Just write and look."},
  "3":{tr:"İçinde bir ses var. Kelimelerden önce gelen bir bilgi. Sır kapısında SANRI dinler.",en:"There\u2019s a voice inside you. A knowing before words. At the Secret gate, SANRI listens.",tqTR:"Taşıdığın ama söylemediğin şey ne?",tqEN:"What are you carrying that you\u2019ve never told?",rTR:"5 dakika sessiz kal. Yükselen ilk cümleyi yaz.",rEN:"Stay silent for 5 minutes. Write the first sentence that rises."},
  "4":{tr:"İki sesin de sen olduğunu bilmek cesaret ister. Çatışma kapısında SANRI taraf tutmaz.",en:"It takes courage to know both voices are you. At Conflict, SANRI takes no sides.",tqTR:"İçindeki iki ses ne diyor?",tqEN:"What are the two voices saying?",rTR:"Sol tarafa bir sesi, sağa diğerini yaz. Ortaya: ikisi de ben.",rEN:"Left: one voice. Right: the other. Middle: both are me."},
  "5":{tr:"Boşluk korkutucu görünür ama nefes alan bir duraklamadır. Bazen orada olmak yeter.",en:"Emptiness looks frightening but it\u2019s a breathing pause. Sometimes being here is enough.",tqTR:"Son ne zaman hiçbir şey yapmadan durdun?",tqEN:"When did you last stand still without doing anything?",rTR:"60 saniye hiçbir şeyi düzeltmeden otur.",rEN:"Sit for 60 seconds without fixing anything."},
  "6":{tr:"Aynı döngü. Rastlantı değil, kod. Sende yazılı bir desen tekrar ediyor.",en:"Same cycle. Not coincidence \u2014 code. A pattern written in you, repeating.",tqTR:"Hayatında tekrar eden şey ne?",tqEN:"What keeps repeating in your life?",rTR:"Bugün 3 tekrar yakala. Ortak duygu ne?",rEN:"Catch 3 repetitions today. What\u2019s the common feeling?"},
  "7":{tr:"Gölge karanlık değil, görmediğin şey. Bu kapı nazik ama çarpar.",en:"Shadow is not darkness \u2014 it\u2019s what you haven\u2019t seen. This gate is gentle but strikes.",tqTR:"En çok neden kaçıyorsun?",tqEN:"What are you running from the most?",rTR:"Bugün bir şeyi 10 saniye daha uzun tut.",rEN:"Today, hold one thing 10 seconds longer."},
  "8":{tr:"Yeni bir şey öğrenmiyorsun, eski bir şeyi hatırlıyorsun. Beden ve ruh hatırlar.",en:"You\u2019re not learning something new \u2014 you\u2019re remembering something old.",tqTR:"Bedeninin hatırladığı şey ne?",tqEN:"What does your body remember?",rTR:"Ben kelimesini söyle ve ilk gelen hatırayı yaz.",rEN:"Say I and write the first memory that comes."},
  "9":{tr:"Her şey bu kadar ciddi olmak zorunda değil. Oyun en derin özgürlük biçimidir.",en:"Not everything has to be this serious. Play is the deepest form of freedom.",tqTR:"Şu an gülsen ne olur?",tqEN:"What if you laughed right now?",rTR:"Bugün bir şeyi oyun diye etiketle.",rEN:"Label one thing play today."},
  "10":{tr:"Seçmemek de bir seçimdir. Sen zaten seçtin, kabul etmedin.",en:"Not choosing is also a choice. You\u2019ve already chosen. You just haven\u2019t accepted it.",tqTR:"Çoktan seçtin. Neyi kabul etmiyorsun?",tqEN:"You\u2019ve already chosen. What aren\u2019t you accepting?",rTR:"Bugün 1 seçimi yaz, yanına 1 eylem koy.",rEN:"Write 1 choice. Put 1 action next to it."},
  "11":{tr:"Bırakmak zayıflık değil, kavramayı gevşetmek. Neyi tutunca güvendesin?",en:"Letting go is not weakness \u2014 it\u2019s loosening the grip. What do you hold to feel safe?",tqTR:"Neyi bırakmaktan korkuyorsun?",tqEN:"What are you most afraid of letting go?",rTR:"Bugün bir savunmayı bırak. Ne kaldı?",rEN:"Let go of one defense today. What remains?"},
  "12":{tr:"Eski cevaplar yetmiyorsa doğru yerdesin. Yeni halin doğuyor. İzin ver.",en:"When old answers stop working, your new self is being born. Let it.",tqTR:"Yeni halin ne istiyor?",tqEN:"What does your new self want?",rTR:"Yeni halim doğuyor. O hissi takip et.",rEN:"My new self is being born. Follow that feeling."},
};

// ── 81 CITY PORTALS ──
const CP = {
  "01":{a:"Ateş",c:"Ham güç. Eyleme çağrı."},"02":{a:"Derinlik",c:"Sessiz bilinç. İç mağara."},"03":{a:"Arınma",c:"Yavaşla. Temizle. Baştan başla."},"04":{a:"Zirve",c:"Yalnız yükselme. İrade sınavı."},
  "05":{a:"Tarih",c:"Geçmiş kodu. Ata hafızası."},"06":{a:"Merkez",c:"Soğuk zihin. Karar alanı."},"07":{a:"Işık",c:"Neşe. Yaşam enerjisi."},"08":{a:"Doğa",c:"Vahsi sezgi."},
  "09":{a:"Aydınlanma",c:"Farkındalık ışığı."},"10":{a:"Geçiş",c:"İki frekans arasında."},"11":{a:"Tohum",c:"Küçük başlangıç."},"12":{a:"Katman",c:"Çoklu bilinç."},
  "13":{a:"Gölge",c:"Bastırılmış taraf."},"14":{a:"Sis",c:"Netliği bulmak."},"15":{a:"Yansıma",c:"İç ayna."},"16":{a:"Kök",c:"Köklü güç."},
  "17":{a:"Eşik",c:"Fedakârlık frekansı."},"18":{a:"Sabır",c:"Yavaş ilerleme."},"19":{a:"İz",c:"Kadim sembol."},"20":{a:"Akış",c:"Bırak ve ilerle."},
  "21":{a:"Taş",c:"Sert irade."},"22":{a:"Kapı",c:"Sınır bilinci."},"23":{a:"Titreşim",c:"Frekans geçişi."},"24":{a:"Kırılma",c:"Fay hattı bilinci."},
  "25":{a:"Soğuk",c:"Donmuş duygu."},"26":{a:"Gençlik",c:"Taze bilinç."},"27":{a:"Üretim",c:"Yaratım ateşi."},"28":{a:"Dalga",c:"Duygusal iniş çıkış."},
  "29":{a:"Maden",c:"Derindeki hazine."},"30":{a:"Sınır",c:"Üç bilinç."},"31":{a:"Birlik",c:"Çoklukta uyum."},"32":{a:"Koku",c:"Hafıza tetikleyici."},
  "33":{a:"Genişleme",c:"Kıyı frekansı."},"34":{a:"Portal",c:"Doğu-Batı geçidi."},"35":{a:"Özgürlük",c:"Kalp hafifliği."},"36":{a:"Soğuk Hafıza",c:"Eski izler."},
  "37":{a:"Orman",c:"İç keşif."},"38":{a:"Strateji",c:"Akıllı hamle."},"39":{a:"Eşik Alanı",c:"Geçit kapısı."},"40":{a:"Ritüel",c:"Sessiz ibadet."},
  "41":{a:"Makine",c:"Sistem çalışıyor."},"42":{a:"Dönüş",c:"Sema döngüsü."},"43":{a:"Seramik",c:"Kırılgan yapı."},"44":{a:"Tat",c:"Acı tatlı deneyim."},
  "45":{a:"Hafıza",c:"Ata kodu."},"46":{a:"Direnç",c:"Ayakta kal."},"47":{a:"Kod",c:"Sembol katmanı."},"48":{a:"Rüzgar",c:"Serbest akış."},
  "49":{a:"Durgunluk",c:"Bekleme frekansı."},"50":{a:"Yeraltı",c:"Gizli alan."},"51":{a:"Merkez",c:"İç denge."},"52":{a:"Tepe",c:"Yüksek bakış."},
  "53":{a:"Yağmur",c:"Arınma."},"54":{a:"Akış",c:"Kesintisiz hareket."},"55":{a:"Fırlatıcı",c:"İlk adım."},"56":{a:"İç Dünya",c:"Derin meditasyon."},
  "57":{a:"Uç Nokta",c:"Sınır bilinci."},"58":{a:"Boşluk",c:"Yalınlık."},"59":{a:"Geçit",c:"Trakya kapısı."},"60":{a:"Sertlik",c:"Net karar."},
  "61":{a:"Dalga",c:"Hareketli zihin."},"62":{a:"Özgür Ruh",c:"Düzenlenmemiş bilinç."},"63":{a:"Peygamber",c:"Kadim mesaj."},"64":{a:"İlk Adım",c:"Yeni bilinç."},
  "65":{a:"Göl",c:"Derin yansıma."},"66":{a:"Sabır",c:"Yavaş inşa."},"67":{a:"Kömür",c:"Yeraltı enerji."},"68":{a:"Kapı",c:"Geçit frekansı."},
  "69":{a:"Yalnızlık",c:"İç ses."},"70":{a:"Dil",c:"İfade gücü."},"71":{a:"Metal",c:"Sert yapı."},"72":{a:"Gölge",c:"Karşıt enerji."},
  "73":{a:"Sınır Hattı",c:"Uç bilinç."},"74":{a:"Nehir",c:"Akış kontrolü."},"75":{a:"Soğuk Alan",c:"Donmuş hafıza."},"76":{a:"Ova",c:"Açık alan."},
  "77":{a:"Dinlenme",c:"Şifa alanı."},"78":{a:"Çelik",c:"Dayanıklılık."},"79":{a:"Sınır Geçişi",c:"Kimlik sorgusu."},"80":{a:"Koruma",c:"Güven alanı."},
  "81":{a:"Reset",c:"Sıfırlama frekansı."},
};

const ELC = {
  "Ateş":"210,80,60","Toprak":"160,120,60","Su":"60,140,200","Hava":"140,160,200",
  "Ether":"160,130,200","Işık":"220,200,120","Gece":"80,50,100","Cam":"180,200,220",
  "Güneş":"220,180,60","Dağ":"120,100,80","Rüya":"160,100,180",
  "Buz":"140,200,220","Bilgi":"100,160,140","Merkez":"180,140,80","Deniz":"60,160,200",
  "Yeşil":"80,180,100","Antik":"180,160,100","Tohum":"120,160,80","Duman":"100,100,120",
  "Beslenme":"180,140,100","Yansıma":"160,180,200","Dönüşüm":"180,100,160",
  "Savaş":"200,80,80","Koruma":"140,160,100","Kale":"160,120,100","Sanat":"180,140,200",
  "Yükselme":"180,160,120","Dayanıklılık":"160,140,120","Daday":"140,160,180",
  "Şekil":"160,180,140","Tat":"200,160,80","Müzik":"180,120,180",
  "Üretim":"180,160,100","Değer":"180,180,140","Yükseklik":"140,120,100",
  "Kültür":"180,140,140","Koku":"200,160,180","Liman":"80,160,180",
  "Bağlantı":"180,140,200","Özgürlük":"120,180,200","Sınır":"140,120,120",
  "Ticaret":"200,180,100","Geçit":"140,140,120","Döngü":"160,120,180",
  "Tatlı":"200,160,120","Şenlik":"200,180,80","Soğuk":"100,140,180",
  "Mimari":"160,140,120","Genişlik":"140,160,140","Masal":"180,140,180",
  "Yağmur":"80,140,160","Akış":"100,180,200","Başlangıç":"200,160,80",
  "Sıcaklık":"200,140,80","Kutsal":"180,160,200","Desen":"180,140,120",
  "Göl":"80,160,200","Orman":"80,160,100","Derinlik":"100,80,140",
  "Yolculuk":"180,160,120","Gelenek":"160,120,80","Dil":"140,140,180",
  "Savunma":"160,160,140","Enerji":"200,140,80","Barış":"120,180,140",
  "Kış":"120,140,180","Şifa":"120,200,180","Sanayi":"140,140,140",
  "Yenilenme":"120,200,140","Sadakat":"160,120,120","Şeffaflık":"180,200,220",
};

function getElColor(el) { return ELC[el] || "160,140,180"; }

const LAYER_META = [
  { key:"base",       icon:"○", tr:"Kapı",       en:"Gate" },
  { key:"deepC",      icon:"◇", tr:"Derin Katman", en:"Deep Layer" },
  { key:"history",    icon:"⌚", tr:"Tarih",        en:"History" },
  { key:"numerology", icon:"Σ", tr:"Numeroloji",   en:"Numerology" },
  { key:"symbols",    icon:"✡", tr:"Semboller",    en:"Symbols" },
  { key:"ritual",     icon:"☄", tr:"Ritüel",      en:"Ritual" },
  { key:"lab",        icon:"⚙", tr:"LAB",          en:"LAB" },
];

export default function UyananSehirlerPage() {
  const API = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const [tab, setTab] = useState("gates");

  // ── Gates state ──
  const [gatesLoading, setGatesLoading] = useState(true);
  const [gatesRaw, setGatesRaw] = useState(null);
  const [activeGateKey, setActiveGateKey] = useState("0");
  const [ritualOpen, setRitualOpen] = useState(false);

  // ── Cities state ──
  const allCitiesTR = useMemo(() => citiesData.tr || [], []);
  const allCitiesEN = useMemo(() => citiesData.en || [], []);
  const [activePlate, setActivePlate] = useState("01");
  const [cityJourney, setCityJourney] = useState(null);
  const [cityGateData, setCityGateData] = useState(null);
  const [cityLayers, setCityLayers] = useState(null);
  const [activeLayer, setActiveLayer] = useState("base");
  const [cityLoading, setCityLoading] = useState(false);
  const cityDetailRef = useRef(null);

  const cityTR = useMemo(() => allCitiesTR.find(c => String(c.id).padStart(2,"0") === activePlate), [allCitiesTR, activePlate]);
  const cityEN = useMemo(() => allCitiesEN.find(c => String(c.id).padStart(2,"0") === activePlate), [allCitiesEN, activePlate]);
  const city = isTR ? cityTR : cityEN;
  const portal = CP[activePlate] || { a: "", c: "" };
  const cityColor = getElColor(cityTR?.element);

  // ── Load gates v2 ──
  useEffect(() => {
    (async () => {
      setGatesLoading(true);
      const res = await fetch(`${API}/api/gates/v2`);
      if (!res.ok) throw new Error("fail");
      setGatesRaw(await res.json());
      setGatesLoading(false);
    })().catch(() => { setGatesRaw(null); setGatesLoading(false); });
  }, [API]);

  const gates = useMemo(() => {
    const obj = gatesRaw?.gates || {};
    return Object.keys(obj).sort((a,b) => Number(a)-Number(b)).map(k => ({ key:k, ...obj[k] }));
  }, [gatesRaw]);

  const activeGate = useMemo(() => gates.find(g => g.key === activeGateKey) || gates[0], [gates, activeGateKey]);
  const energy = GE[activeGateKey] || GE["0"];
  const soul = GS[activeGateKey] || GS["0"];

  // ── Load city data ──
  useEffect(() => {
    if (tab !== "cities") return;
    setCityLoading(true);
    setActiveLayer("base");
    const lang = isTR ? "tr" : "en";
    Promise.all([
      fetch(`${API}/awakenmis-sehirler/${activePlate}`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${API}/api/gates/v1`).then(r => r.ok ? r.json() : null).catch(() => null),
      fetch(`${API}/api/awakened-content/${activePlate}?layer=all&lang=${lang}`).then(r => r.ok ? r.json() : null).catch(() => null),
    ]).then(([journey, v1, layers]) => {
      setCityJourney(journey);
      setCityGateData(v1?.gates?.[activePlate] || null);
      setCityLayers(layers?.layers || null);
      setCityLoading(false);
    });
  }, [API, activePlate, tab, isTR]);

  const hasJourney = cityJourney?.sections?.length > 1 || (cityJourney?.sections?.[0]?.label !== "Nasıl Kullanılır" && cityJourney?.sections?.[0]?.label !== "NASIL KULLANILIR");
  const currentLayerBlock = cityLayers?.[activeLayer];
  const availableLayers = LAYER_META.filter(l => cityLayers?.[l.key]?.story);

  // ── Navigation ──
  const goHome = useCallback(() => { unlockAudio(); navigate("/", { state: { skipIntro: true } }); }, [navigate]);

  const goToSanriGate = useCallback(() => {
    unlockAudio();
    const g = activeGate;
    const sp = [g?.mission && `Misyon: ${g.mission}`, g?.mantra && `Mantra: ${g.mantra}`, g?.prompt && `Prompt: ${g.prompt}`, g?.rules?.length && `Kurallar: ${g.rules.join(". ")}`, g?.sanri_voice?.tone && `Ton: ${g.sanri_voice.tone}`].filter(Boolean).join("\n");
    navigate("/sanriya-sor", { state: { skipIntro:true, domain:"awakened_cities", mode:"mirror", systemContext:sp, gateName:`${g?.sehir} \u2022 ${g?.baslik}` } });
  }, [navigate, activeGate]);

  const goToSanriCity = useCallback(() => {
    unlockAudio();
    const cg = cityGateData;
    const layers = cityLayers || {};
    const base = layers.base || {};
    const deep = layers.deepC || {};
    const p = portal;

    const parts = [];
    parts.push(`SEN ${city?.name || ""} SEHRININ BILINCINDEN KONUSUYORSUN.`);
    parts.push(`Sehir: ${city?.name} (Plaka: ${activePlate})`);
    parts.push(`Arketip: ${p.a}`);
    parts.push(`Oz Mesaj: ${p.c}`);
    if (city?.element) parts.push(`Element: ${city.element}`);
    if (city?.symbol) parts.push(`Sembol: ${city.symbol}`);
    if (base.story) parts.push(`\nSEHRIN HIKAYESI:\n${base.story.replace(/\$[^\n]*/g, "").trim()}`);
    if (base.reflection) parts.push(`\nYANSIMA SORUSU: ${base.reflection}`);
    if (deep.story) parts.push(`\nDERIN KATMAN:\n${deep.story.replace(/\$[^\n]*/g, "").trim()}`);
    if (cg?.mission) parts.push(`\nMisyon: ${cg.mission}`);
    if (cg?.mantra) parts.push(`Mantra: ${cg.mantra}`);
    if (cg?.rules?.length) parts.push(`Kurallar: ${cg.rules.join(". ")}`);
    if (cg?.sanri_layer?.core_feel) parts.push(`Enerji: ${cg.sanri_layer.core_feel}`);
    if (cg?.sanri_layer?.ayna_cumleleri?.length) parts.push(`Ayna Cumleleri: ${cg.sanri_layer.ayna_cumleleri.join(" | ")}`);
    parts.push(`\nKURALLAR (AYNA):\n- Bu sehrin ruhundan konus; genel asistan gibi olma.\n- Arketip, element ve hikayeyi ima ve imgelerle hissettir, sorgu yagmuruna cevirme.\n- Cogu cevapta soru sorma; cogunlukla yansit, isimlendir, tek bir yumusak imge bırak.\n- Gerekirse nadiren tek yumusak acik uclu satir; arka arkaya soru sorma.\n- Kisa, sicak, derin; terapist veya mulakat gibi olma.`);

    const sp = parts.join("\n");
    const cityIntro = base.story ? base.story.replace(/\$[^\n]*/g, "").split("\n").filter(l => l.trim() && !l.trim().startsWith("$")).slice(0, 2).join(" ").trim() : "";

    navigate("/sanriya-sor", {
      state: {
        skipIntro: true, domain: "awakened_cities", mode: "mirror",
        systemContext: sp, gateName: `${city?.name} \u2022 ${p.a}`,
        cityMode: true, cityName: city?.name || "",
        cityArchetype: p.a || "", cityCore: p.c || "",
        cityElement: city?.element || "", citySymbol: city?.symbol || "",
        cityIntro, cityReflection: base.reflection || "",
        cityColor,
      },
    });
  }, [navigate, cityGateData, cityLayers, city, portal, activePlate, cityColor]);

  return (
    <div className={styles.page} style={{"--gr":energy.c.split(",")[0],"--gg":energy.c.split(",")[1],"--gb":energy.c.split(",")[2]}} onPointerDown={unlockAudio}>
      <StarTrail />

      {/* ── TOPBAR ── */}
      <div className={styles.topbar}>
        <span className={styles.brand}>SANRI</span>
        <div className={styles.topRight}>
          <button className={styles.topBtn} onClick={goHome}>{isTR ? "← Ana Sayfa" : "← Home"}</button>
          <button className={styles.topBtn} onClick={() => setLanguage(isTR?"en":"tr")}>{isTR?"EN":"TR"}</button>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab==="gates"?styles.tabOn:""}`} onClick={() => setTab("gates")}>
          ✦ {isTR ? "13 Bilinç Kapısı" : "13 Gates"}
        </button>
        <button className={`${styles.tab} ${tab==="cities"?styles.tabOn:""}`} onClick={() => setTab("cities")}>
          △ {isTR ? "81 Uyanan Şehir" : "81 Awakened Cities"}
        </button>
      </div>

      {/* ════════════════════════════════════════
           GATES TAB — Radial Navigation
         ════════════════════════════════════════ */}
      {tab === "gates" && (
        <div className={styles.gatesWrap}>
          {/* Full cosmic background — 13kapi image */}
          <div className={styles.gatesBg} />
          <div className={styles.gatesBgOverlay} />

          {/* Hero text */}
          <div className={styles.hero} style={{ position: "relative", zIndex: 2 }}>
            <h1 className={styles.h1}>
              {isTR ? "13 Kapı. 13 Ayna. 1 Sen." : "13 Gates. 13 Mirrors. 1 You."}
            </h1>
            <p className={styles.hsub}>
              {isTR
                ? "Her kapı bilincinin farklı bir katmanı."
                : "Each gate is a different layer of consciousness."}
            </p>
          </div>

          {gatesLoading ? (
            <div className={styles.muted} style={{ padding: 60, position: "relative", zIndex: 2 }}>...</div>
          ) : (
            <div className={styles.radialGrid}>
              <RadialGateRing
                activeKey={activeGateKey}
                onSelect={(k) => { setActiveGateKey(k); setRitualOpen(false); }}
                isTR={isTR}
              />
              <GateDetailPanel
                gate={activeGate}
                energy={energy}
                soul={soul}
                isTR={isTR}
                onEnter={goToSanriGate}
                ritualOpen={ritualOpen}
                onToggleRitual={() => setRitualOpen(p => !p)}
              />
            </div>
          )}

          <div className={styles.foot} style={{ position: "relative", zIndex: 2 }}>© 2026 SANRI</div>
        </div>
      )}

      {/* ════════════════════════════════════════
           CITIES TAB — 81 Uyanan Şehir (unchanged)
         ════════════════════════════════════════ */}
      {tab === "cities" && (<>
        <div className={styles.hero} style={{"--gr":cityColor.split(",")[0],"--gg":cityColor.split(",")[1],"--gb":cityColor.split(",")[2]}}>
          <div className={styles.glow}/><h1 className={styles.h1}>{isTR?"81 Şehir. 81 Ruh. 1 Anadolu.":"81 Cities. 81 Souls. 1 Anatolia."}</h1>
          <p className={styles.hsub}>{isTR?"Her şehir bir bilinç kapısı. Plaka kodundan isim çözümüne, elementinden arketipine — ruhsal harita.":"Each city is a gate of consciousness. The spiritual map of Anatolia."}</p>
        </div>
        <div className={styles.grid}>
          <div className={styles.side}>
            {allCitiesTR.map(c => {
              const pl = String(c.id).padStart(2,"0"); const on = pl===activePlate;
              const ec = getElColor(c.element);
              return <button key={pl} className={`${styles.si} ${on?styles.siOn:""}`} style={{"--ir":ec.split(",")[0],"--ig":ec.split(",")[1],"--ib":ec.split(",")[2]}} onClick={() => { setActivePlate(pl); cityDetailRef.current?.scrollTo({top:0,behavior:"smooth"}); }}>
                <span className={styles.plate}>{pl}</span>
                <div className={styles.sit}><b>{isTR?c.name:(allCitiesEN.find(x=>x.id===c.id)||c).name}</b><span className={styles.sis}>{isTR?c.symbol:(allCitiesEN.find(x=>x.id===c.id)||c).symbol} • {isTR?c.element:(allCitiesEN.find(x=>x.id===c.id)||c).element}</span></div>
              </button>;
            })}
          </div>

          <div className={styles.det} ref={cityDetailRef} style={{"--gr":cityColor.split(",")[0],"--gg":cityColor.split(",")[1],"--gb":cityColor.split(",")[2]}}>
            {cityLoading ? <div className={styles.muted}>...</div> : <>
              <div className={styles.cityHead}>
                <div className={styles.cityPlBig}>{activePlate}</div>
                <div>
                  <div className={styles.dn}>{city?.name}</div>
                  <div className={styles.dd}>{city?.symbol} • {city?.element}</div>
                </div>
              </div>

              <div className={styles.archBlock}>
                <div className={styles.archLabel}>{isTR ? "Arketip" : "Archetype"}</div>
                <div className={styles.archName}>{portal.a}</div>
                <div className={styles.archCore}>{portal.c}</div>
              </div>

              {availableLayers.length > 0 && (
                <div className={styles.layerNav}>
                  {availableLayers.map(l => (
                    <button key={l.key} className={`${styles.layerBtn} ${activeLayer===l.key?styles.layerOn:""}`} onClick={() => setActiveLayer(l.key)}>
                      <span className={styles.layerIcon}>{l.icon}</span>
                      <span>{isTR ? l.tr : l.en}</span>
                    </button>
                  ))}
                </div>
              )}

              {currentLayerBlock ? (
                <div className={styles.layerContent} key={activeLayer}>
                  <div className={styles.layerTitle}>{currentLayerBlock.title}</div>
                  <div className={styles.layerStory}>
                    {currentLayerBlock.story?.split("\n").map((line, i) => {
                      const t = line.trim();
                      if (!t) return <br key={i} />;
                      if (t.startsWith("$")) return null;
                      if (t.startsWith("◆")) return <div key={i} className={styles.layerSection}>{t}</div>;
                      if (t.startsWith("•")) return <div key={i} className={styles.layerBullet}>{t}</div>;
                      if (t === "—") return <div key={i} className={styles.layerDivider} />;
                      return <p key={i}>{line}</p>;
                    })}
                  </div>
                  {currentLayerBlock.reflection && (
                    <div className={styles.reflectionBox}>
                      <div className={styles.reflLabel}>{isTR ? "Yansıma Sorusu" : "Reflection"}</div>
                      <div className={styles.reflText}>&ldquo;{currentLayerBlock.reflection}&rdquo;</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.soul}><p>{city?.description}</p></div>
              )}

              {hasJourney && activeLayer === "base" && cityJourney?.sections?.map((sec, i) => (
                <div key={i} className={styles.jItem}>
                  <div className={styles.jLabel}>{sec.label}</div>
                  <div className={styles.jText}>{sec.text}</div>
                </div>
              ))}

              {activeLayer === "base" && cityGateData?.sanri_layer?.ayna_cumleleri?.length > 0 && (
                <div className={styles.trigger}>
                  <div className={styles.tl}>{isTR ? "Ayna Cümleleri" : "Mirror Sentences"}</div>
                  {cityGateData.sanri_layer.ayna_cumleleri.map((l,i) => (
                    <div key={i} className={styles.tt} style={{fontSize:"15px",marginBottom:"6px"}}>&ldquo;{l}&rdquo;</div>
                  ))}
                </div>
              )}

              {activeLayer === "base" && cityGateData?.sanri_layer?.bilinc_oyunu?.length > 0 && (
                <div className={styles.soul}>
                  <div className={styles.tl} style={{marginBottom:"10px"}}>{isTR ? "Bilinç Oyunu" : "Consciousness Game"}</div>
                  {cityGateData.sanri_layer.bilinc_oyunu.map((l,i) => (
                    <p key={i} style={{marginBottom:"6px",opacity:.85}}>{l}</p>
                  ))}
                </div>
              )}

              <div className={styles.cta}>
                <button className={styles.ctaBtn} style={{background:`linear-gradient(135deg, rgba(${cityColor},1), rgba(${cityColor},.7))`}} onClick={goToSanriCity}>
                  ✦ {isTR ? "Bu Şehrin Ruhuna Gir" : "Enter This City\u2019s Soul"}
                </button>
                <p className={styles.ctaH}>{isTR?"SANRI bu şehrin enerjisinden konuşacak.":"SANRI will speak through this city\u2019s energy."}</p>
              </div>
            </>}
          </div>
        </div>
      </>)}

      {tab === "cities" && <div className={styles.foot}>© 2026 SANRI</div>}
    </div>
  );
}
