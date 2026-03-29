import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./UyananSehirlerPage.module.css";
import StarTrail from "../components/StarTrail";
import { useLanguage } from "../contexts/LanguageContext";
import { unlockAudio } from "../utils/sfx";
import { cities as citiesData } from "../data/cities";

// 13 BILINC KAPISI energy
const GE = {
  "0":{s:"\u25CB",c:"138,128,168"},"1":{s:"\u25C7",c:"192,200,220"},
  "2":{s:"\u2661",c:"210,80,80"},"3":{s:"\u2022",c:"80,90,180"},
  "4":{s:"\u2694",c:"200,140,60"},"5":{s:"\u2014",c:"60,60,80"},
  "6":{s:"\u221E",c:"80,190,120"},"7":{s:"\u263D",c:"100,40,50"},
  "8":{s:"\u2248",c:"60,170,190"},"9":{s:"\u2605",c:"210,180,60"},
  "10":{s:"\u2295",c:"120,160,80"},"11":{s:"\u223C",c:"100,140,200"},
  "12":{s:"\u2726",c:"220,200,140"},
};

// 13 BILINC KAPISI soul/descriptions
const GS = {
  "0":{tr:"Hen\u00fcz ad\u0131m atmad\u0131n. Ama burada duruyorsun. E\u015fikte olmak fark\u0131ndal\u0131\u011f\u0131n ba\u015flad\u0131\u011f\u0131 and\u0131r.",en:"You haven\u2019t stepped in yet. But you\u2019re standing here. Being at the threshold is where awareness begins.",tqTR:"Seni buraya getiren ne?",tqEN:"What brought you here?",rTR:"G\u00f6zlerini kapat. \u00dc\u00e7 nefes al. Her nefeste sor: Haz\u0131r m\u0131y\u0131m?",rEN:"Close your eyes. Three breaths. Ask: Am I ready?"},
  "1":{tr:"Ayna sana bak\u0131yor. G\u00f6rd\u00fc\u011f\u00fcn \u015fey tamamen i\u00e7inde. SANRI sadece yans\u0131t\u0131r.",en:"The mirror is looking at you. What you see is entirely within.",tqTR:"Aynaya bakt\u0131\u011f\u0131nda ne g\u00f6r\u00fcyorsun?",tqEN:"What do you see when you look in the mirror?",rTR:"60 saniye aynaya bak. G\u00f6zlerinin arkas\u0131na.",rEN:"Look into a mirror for 60 seconds. Behind your eyes."},
  "2":{tr:"Arzu kirli de\u011fildir. Eros kap\u0131s\u0131 seni \u00e7eken \u015feyin arkas\u0131ndaki ger\u00e7ek frekans\u0131 okur.",en:"Desire is not dirty. The Eros gate reads the true frequency behind what pulls you.",tqTR:"Seni en \u00e7ok ne \u00e7ekiyor?",tqEN:"What pulls you the most?",rTR:"\u0130stedi\u011fin ama s\u00f6ylemedi\u011fin bir \u015feyi yaz. Sadece yaz ve bak.",rEN:"Write something you want but haven\u2019t said. Just write and look."},
  "3":{tr:"\u0130\u00e7inde bir ses var. Kelimelerden \u00f6nce gelen bir bilgi. S\u0131r kap\u0131s\u0131nda SANRI dinler.",en:"There\u2019s a voice inside you. A knowing before words. At the Secret gate, SANRI listens.",tqTR:"Ta\u015f\u0131d\u0131\u011f\u0131n ama s\u00f6ylemedi\u011fin \u015fey ne?",tqEN:"What are you carrying that you\u2019ve never told?",rTR:"5 dakika sessiz kal. Y\u00fckselen ilk c\u00fcmleyi yaz.",rEN:"Stay silent for 5 minutes. Write the first sentence that rises."},
  "4":{tr:"\u0130ki sesin de sen oldu\u011funu bilmek cesaret ister. \u00c7at\u0131\u015fma kap\u0131s\u0131nda SANRI taraf tutmaz.",en:"It takes courage to know both voices are you. At Conflict, SANRI takes no sides.",tqTR:"\u0130\u00e7indeki iki ses ne diyor?",tqEN:"What are the two voices saying?",rTR:"Sol tarafa bir sesi, sa\u011fa di\u011ferini yaz. Ortaya: ikisi de ben.",rEN:"Left: one voice. Right: the other. Middle: both are me."},
  "5":{tr:"Bo\u015fluk korkutucu g\u00f6r\u00fcn\u00fcr ama nefes alan bir duraklamad\u0131r. Bazen orada olmak yeter.",en:"Emptiness looks frightening but it\u2019s a breathing pause. Sometimes being here is enough.",tqTR:"Son ne zaman hi\u00e7bir \u015fey yapmadan durdun?",tqEN:"When did you last stand still without doing anything?",rTR:"60 saniye hi\u00e7bir \u015feyi d\u00fczeltmeden otur.",rEN:"Sit for 60 seconds without fixing anything."},
  "6":{tr:"Ayn\u0131 d\u00f6ng\u00fc. Rastlant\u0131 de\u011fil, kod. Sende yaz\u0131l\u0131 bir desen tekrar ediyor.",en:"Same cycle. Not coincidence \u2014 code. A pattern written in you, repeating.",tqTR:"Hayat\u0131nda tekrar eden \u015fey ne?",tqEN:"What keeps repeating in your life?",rTR:"Bug\u00fcn 3 tekrar yakala. Ortak duygu ne?",rEN:"Catch 3 repetitions today. What\u2019s the common feeling?"},
  "7":{tr:"G\u00f6lge karanl\u0131k de\u011fil, g\u00f6rmedi\u011fin \u015fey. Bu kap\u0131 nazik ama \u00e7arpar.",en:"Shadow is not darkness \u2014 it\u2019s what you haven\u2019t seen. This gate is gentle but strikes.",tqTR:"En \u00e7ok neden ka\u00e7\u0131yorsun?",tqEN:"What are you running from the most?",rTR:"Bug\u00fcn bir \u015feyi 10 saniye daha uzun tut.",rEN:"Today, hold one thing 10 seconds longer."},
  "8":{tr:"Yeni bir \u015fey \u00f6\u011frenmiyorsun, eski bir \u015feyi hat\u0131rl\u0131yorsun. Beden ve ruh hat\u0131rlar.",en:"You\u2019re not learning something new \u2014 you\u2019re remembering something old.",tqTR:"Bedeninin hat\u0131rlad\u0131\u011f\u0131 \u015fey ne?",tqEN:"What does your body remember?",rTR:"Ben kelimesini s\u00f6yle ve ilk gelen hat\u0131ray\u0131 yaz.",rEN:"Say I and write the first memory that comes."},
  "9":{tr:"Her \u015fey bu kadar ciddi olmak zorunda de\u011fil. Oyun en derin \u00f6zg\u00fcrl\u00fck bi\u00e7imidir.",en:"Not everything has to be this serious. Play is the deepest form of freedom.",tqTR:"\u015eu an g\u00fclsen ne olur?",tqEN:"What if you laughed right now?",rTR:"Bug\u00fcn bir \u015feyi oyun diye etiketle.",rEN:"Label one thing play today."},
  "10":{tr:"Se\u00e7memek de bir se\u00e7imdir. Sen zaten se\u00e7tin, kabul etmedin.",en:"Not choosing is also a choice. You\u2019ve already chosen. You just haven\u2019t accepted it.",tqTR:"\u00c7oktan se\u00e7tin. Neyi kabul etmiyorsun?",tqEN:"You\u2019ve already chosen. What aren\u2019t you accepting?",rTR:"Bug\u00fcn 1 se\u00e7imi yaz, yan\u0131na 1 eylem koy.",rEN:"Write 1 choice. Put 1 action next to it."},
  "11":{tr:"B\u0131rakmak zay\u0131fl\u0131k de\u011fil, kavramay\u0131 gev\u015fetmek. Neyi tutunca g\u00fcvendesin?",en:"Letting go is not weakness \u2014 it\u2019s loosening the grip. What do you hold to feel safe?",tqTR:"Neyi b\u0131rakmaktan korkuyorsun?",tqEN:"What are you most afraid of letting go?",rTR:"Bug\u00fcn bir savunmay\u0131 b\u0131rak. Ne kald\u0131?",rEN:"Let go of one defense today. What remains?"},
  "12":{tr:"Eski cevaplar yetmiyorsa do\u011fru yerdesin. Yeni halin do\u011fuyor. \u0130zin ver.",en:"When old answers stop working, your new self is being born. Let it.",tqTR:"Yeni halin ne istiyor?",tqEN:"What does your new self want?",rTR:"Yeni halim do\u011fuyor. O hissi takip et.",rEN:"My new self is being born. Follow that feeling."},
};

// 81 CITY PORTALS (archetype + core)
const CP = {
  "01":{a:"Ate\u015f",c:"Ham g\u00fc\u00e7. Eyleme \u00e7a\u011fr\u0131."},"02":{a:"Derinlik",c:"Sessiz bilin\u00e7. \u0130\u00e7 ma\u011fara."},"03":{a:"Ar\u0131nma",c:"Yava\u015fla. Temizle. Ba\u015ftan ba\u015fla."},"04":{a:"Zirve",c:"Yaln\u0131z y\u00fckselme. \u0130rade s\u0131nav\u0131."},
  "05":{a:"Tarih",c:"Ge\u00e7mi\u015f kodu. Ata haf\u0131zas\u0131."},"06":{a:"Merkez",c:"So\u011fuk zihin. Karar alan\u0131."},"07":{a:"I\u015f\u0131k",c:"Ne\u015fe. Ya\u015fam enerjisi."},"08":{a:"Do\u011fa",c:"Vahsi sezgi."},
  "09":{a:"Ayd\u0131nlanma",c:"Fark\u0131ndal\u0131k \u0131\u015f\u0131\u011f\u0131."},"10":{a:"Ge\u00e7i\u015f",c:"\u0130ki frekans aras\u0131nda."},"11":{a:"Tohum",c:"K\u00fc\u00e7\u00fck ba\u015flang\u0131\u00e7."},"12":{a:"Katman",c:"\u00c7oklu bilin\u00e7."},
  "13":{a:"G\u00f6lge",c:"Bast\u0131r\u0131lm\u0131\u015f taraf."},"14":{a:"Sis",c:"Netli\u011fi bulmak."},"15":{a:"Yans\u0131ma",c:"\u0130\u00e7 ayna."},"16":{a:"K\u00f6k",c:"K\u00f6kl\u00fc g\u00fc\u00e7."},
  "17":{a:"E\u015fik",c:"Fedak\u00e2rl\u0131k frekans\u0131."},"18":{a:"Sab\u0131r",c:"Yava\u015f ilerleme."},"19":{a:"\u0130z",c:"Kadim sembol."},"20":{a:"Ak\u0131\u015f",c:"B\u0131rak ve ilerle."},
  "21":{a:"Ta\u015f",c:"Sert irade."},"22":{a:"Kap\u0131",c:"S\u0131n\u0131r bilinci."},"23":{a:"Titre\u015fim",c:"Frekans ge\u00e7i\u015fi."},"24":{a:"K\u0131r\u0131lma",c:"Fay hatt\u0131 bilinci."},
  "25":{a:"So\u011fuk",c:"Donmu\u015f duygu."},"26":{a:"Gen\u00e7lik",c:"Taze bilin\u00e7."},"27":{a:"\u00dcretim",c:"Yarat\u0131m ate\u015fi."},"28":{a:"Dalga",c:"Duygusal ini\u015f \u00e7\u0131k\u0131\u015f."},
  "29":{a:"Maden",c:"Derindeki hazine."},"30":{a:"S\u0131n\u0131r",c:"\u00dc\u00e7 bilin\u00e7."},"31":{a:"Birlik",c:"\u00c7oklukta uyum."},"32":{a:"Koku",c:"Haf\u0131za tetikleyici."},
  "33":{a:"Geni\u015fleme",c:"K\u0131y\u0131 frekans\u0131."},"34":{a:"Portal",c:"Do\u011fu-Bat\u0131 ge\u00e7idi."},"35":{a:"\u00d6zg\u00fcrl\u00fck",c:"Kalp hafifli\u011fi."},"36":{a:"So\u011fuk Haf\u0131za",c:"Eski izler."},
  "37":{a:"Orman",c:"\u0130\u00e7 ke\u015fif."},"38":{a:"Strateji",c:"Ak\u0131ll\u0131 hamle."},"39":{a:"E\u015fik Alan\u0131",c:"Ge\u00e7it kap\u0131s\u0131."},"40":{a:"Rit\u00fcel",c:"Sessiz ibadet."},
  "41":{a:"Makine",c:"Sistem \u00e7al\u0131\u015f\u0131yor."},"42":{a:"D\u00f6n\u00fc\u015f",c:"Sema d\u00f6ng\u00fcs\u00fc."},"43":{a:"Seramik",c:"K\u0131r\u0131lgan yap\u0131."},"44":{a:"Tat",c:"Ac\u0131 tatl\u0131 deneyim."},
  "45":{a:"Haf\u0131za",c:"Ata kodu."},"46":{a:"Diren\u00e7",c:"Ayakta kal."},"47":{a:"Kod",c:"Sembol katman\u0131."},"48":{a:"R\u00fczgar",c:"Serbest ak\u0131\u015f."},
  "49":{a:"Durgunluk",c:"Bekleme frekans\u0131."},"50":{a:"Yeralt\u0131",c:"Gizli alan."},"51":{a:"Merkez",c:"\u0130\u00e7 denge."},"52":{a:"Tepe",c:"Y\u00fcksek bak\u0131\u015f."},
  "53":{a:"Ya\u011fmur",c:"Ar\u0131nma."},"54":{a:"Ak\u0131\u015f",c:"Kesintisiz hareket."},"55":{a:"F\u0131rlat\u0131c\u0131",c:"\u0130lk ad\u0131m."},"56":{a:"\u0130\u00e7 D\u00fcnya",c:"Derin meditasyon."},
  "57":{a:"U\u00e7 Nokta",c:"S\u0131n\u0131r bilinci."},"58":{a:"Bo\u015fluk",c:"Yal\u0131nl\u0131k."},"59":{a:"Ge\u00e7it",c:"Trakya kap\u0131s\u0131."},"60":{a:"Sertlik",c:"Net karar."},
  "61":{a:"Dalga",c:"Hareketli zihin."},"62":{a:"\u00d6zg\u00fcr Ruh",c:"D\u00fczenlenmemi\u015f bilin\u00e7."},"63":{a:"Peygamber",c:"Kadim mesaj."},"64":{a:"\u0130lk Ad\u0131m",c:"Yeni bilin\u00e7."},
  "65":{a:"G\u00f6l",c:"Derin yans\u0131ma."},"66":{a:"Sab\u0131r",c:"Yava\u015f in\u015fa."},"67":{a:"K\u00f6m\u00fcr",c:"Yeralt\u0131 enerji."},"68":{a:"Kap\u0131",c:"Ge\u00e7it frekans\u0131."},
  "69":{a:"Yaln\u0131zl\u0131k",c:"\u0130\u00e7 ses."},"70":{a:"Dil",c:"\u0130fade g\u00fcc\u00fc."},"71":{a:"Metal",c:"Sert yap\u0131."},"72":{a:"G\u00f6lge",c:"Kar\u015f\u0131t enerji."},
  "73":{a:"S\u0131n\u0131r Hatt\u0131",c:"U\u00e7 bilin\u00e7."},"74":{a:"Nehir",c:"Ak\u0131\u015f kontrol\u00fc."},"75":{a:"So\u011fuk Alan",c:"Donmu\u015f haf\u0131za."},"76":{a:"Ova",c:"A\u00e7\u0131k alan."},
  "77":{a:"Dinlenme",c:"\u015eifa alan\u0131."},"78":{a:"\u00c7elik",c:"Dayan\u0131kl\u0131l\u0131k."},"79":{a:"S\u0131n\u0131r Ge\u00e7i\u015fi",c:"Kimlik sorgusu."},"80":{a:"Koruma",c:"G\u00fcven alan\u0131."},
  "81":{a:"Reset",c:"S\u0131f\u0131rlama frekans\u0131."},
};

// Element -> color
const ELC = {
  "Ate\u015f":"210,80,60","Toprak":"160,120,60","Su":"60,140,200","Hava":"140,160,200",
  "Ether":"160,130,200","I\u015f\u0131k":"220,200,120","Gece":"80,50,100","Cam":"180,200,220",
  "G\u00fcne\u015f":"220,180,60","Da\u011f":"120,100,80","R\u00fcya":"160,100,180",
  "Buz":"140,200,220","Bilgi":"100,160,140","Merkez":"180,140,80","Deniz":"60,160,200",
  "Ye\u015fil":"80,180,100","Antik":"180,160,100","Tohum":"120,160,80","Duman":"100,100,120",
  "Beslenme":"180,140,100","Yans\u0131ma":"160,180,200","D\u00f6n\u00fc\u015f\u00fcm":"180,100,160",
  "Sava\u015f":"200,80,80","Koruma":"140,160,100","Kale":"160,120,100","Sanat":"180,140,200",
  "Y\u00fckselme":"180,160,120","Dayan\u0131kl\u0131l\u0131k":"160,140,120","Daday":"140,160,180",
  "\u015eekil":"160,180,140","Tat":"200,160,80","M\u00fczik":"180,120,180",
  "\u00dcretim":"180,160,100","De\u011fer":"180,180,140","Y\u00fckseklik":"140,120,100",
  "K\u00fclt\u00fcr":"180,140,140","Koku":"200,160,180","Liman":"80,160,180",
  "Ba\u011flant\u0131":"180,140,200","\u00d6zg\u00fcrl\u00fck":"120,180,200","S\u0131n\u0131r":"140,120,120",
  "Ticaret":"200,180,100","Ge\u00e7it":"140,140,120","D\u00f6ng\u00fc":"160,120,180",
  "Tatl\u0131":"200,160,120","\u015eenlik":"200,180,80","So\u011fuk":"100,140,180",
  "Mimari":"160,140,120","Geni\u015flik":"140,160,140","Masal":"180,140,180",
  "Ya\u011fmur":"80,140,160","Ak\u0131\u015f":"100,180,200","Ba\u015flang\u0131\u00e7":"200,160,80",
  "S\u0131cakl\u0131k":"200,140,80","Kutsal":"180,160,200","Desen":"180,140,120",
  "G\u00f6l":"80,160,200","Orman":"80,160,100","Derinlik":"100,80,140",
  "Yolculuk":"180,160,120","Gelenek":"160,120,80","Dil":"140,140,180",
  "Savunma":"160,160,140","Enerji":"200,140,80","Bar\u0131\u015f":"120,180,140",
  "K\u0131\u015f":"120,140,180","\u015eifa":"120,200,180","Sanayi":"140,140,140",
  "Yenilenme":"120,200,140","Sadakat":"160,120,120","\u015eeffafl\u0131k":"180,200,220",
};

function getElColor(el) { return ELC[el] || "160,140,180"; }

// 7-layer metadata
const LAYER_META = [
  { key:"base",       icon:"\u25CB", tr:"Kap\u0131",       en:"Gate" },
  { key:"deepC",      icon:"\u25C7", tr:"Derin Katman", en:"Deep Layer" },
  { key:"history",    icon:"\u231A", tr:"Tarih",        en:"History" },
  { key:"numerology", icon:"\u03A3", tr:"Numeroloji",   en:"Numerology" },
  { key:"symbols",    icon:"\u2721", tr:"Semboller",    en:"Symbols" },
  { key:"ritual",     icon:"\u2604", tr:"Rit\u00fcel",      en:"Ritual" },
  { key:"lab",        icon:"\u2699", tr:"LAB",          en:"LAB" },
];

export default function UyananSehirlerPage() {
  const API = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const isTR = language === "tr";

  const [tab, setTab] = useState("gates");

  // Gates state
  const [gatesLoading, setGatesLoading] = useState(true);
  const [gatesRaw, setGatesRaw] = useState(null);
  const [activeGateKey, setActiveGateKey] = useState("0");
  const [ritualOpen, setRitualOpen] = useState(false);
  const gateDetailRef = useRef(null);

  // Cities state
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

  // Load gates v2
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

  // Load city journey + 7-layer content
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

  const hasJourney = cityJourney?.sections?.length > 1 || (cityJourney?.sections?.[0]?.label !== "Nas\u0131l Kullan\u0131l\u0131r" && cityJourney?.sections?.[0]?.label !== "NASIL KULLANILIR");
  const currentLayerBlock = cityLayers?.[activeLayer];
  const availableLayers = LAYER_META.filter(l => cityLayers?.[l.key]?.story);

  // Navigation
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
        skipIntro: true,
        domain: "awakened_cities",
        mode: "mirror",
        systemContext: sp,
        gateName: `${city?.name} \u2022 ${p.a}`,
        cityMode: true,
        cityName: city?.name || "",
        cityArchetype: p.a || "",
        cityCore: p.c || "",
        cityElement: city?.element || "",
        citySymbol: city?.symbol || "",
        cityIntro,
        cityReflection: base.reflection || "",
        cityColor: cityColor,
      },
    });
  }, [navigate, cityGateData, cityLayers, city, portal, activePlate, cityColor]);

  return (
    <div className={styles.page} style={{"--gr":energy.c.split(",")[0],"--gg":energy.c.split(",")[1],"--gb":energy.c.split(",")[2]}} onPointerDown={unlockAudio}>
      <StarTrail />

      {/* TOPBAR */}
      <div className={styles.topbar}>
        <span className={styles.brand}>SANRI</span>
        <div className={styles.topRight}>
          <button className={styles.topBtn} onClick={goHome}>{isTR ? "\u2190 Ana Sayfa" : "\u2190 Home"}</button>
          <button className={styles.topBtn} onClick={() => setLanguage(isTR?"en":"tr")}>{isTR?"EN":"TR"}</button>
        </div>
      </div>

      {/* TABS */}
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${tab==="gates"?styles.tabOn:""}`} onClick={() => setTab("gates")}>
          {"\u2726"} {isTR ? "13 Bilin\u00e7 Kap\u0131s\u0131" : "13 Gates"}
        </button>
        <button className={`${styles.tab} ${tab==="cities"?styles.tabOn:""}`} onClick={() => setTab("cities")}>
          {"\u2302"} {isTR ? "81 Uyanan \u015eehir" : "81 Awakened Cities"}
        </button>
      </div>

      {/* GATES TAB */}
      {tab === "gates" && (<>
        <div className={styles.hero}><div className={styles.glow}/><h1 className={styles.h1}>{isTR?"13 Kap\u0131. 13 Ayna. 1 Sen.":"13 Gates. 13 Mirrors. 1 You."}</h1><p className={styles.hsub}>{isTR?"Her kap\u0131 bilincinin farkl\u0131 bir katman\u0131.":"Each gate is a different layer of consciousness."}</p></div>
        <div className={styles.grid}>
          <div className={styles.side}>
            {gatesLoading ? <div className={styles.muted}>...</div> : gates.map(g => {
              const on = g.key===activeGateKey; const e = GE[g.key]||GE["0"];
              return <button key={g.key} className={`${styles.si} ${on?styles.siOn:""}`} style={{"--ir":e.c.split(",")[0],"--ig":e.c.split(",")[1],"--ib":e.c.split(",")[2]}} onClick={() => { setActiveGateKey(g.key); setRitualOpen(false); gateDetailRef.current?.scrollTo({top:0,behavior:"smooth"}); }}>
                <span className={styles.sym}>{e.s}</span>
                <div className={styles.sit}><b>{g.sehir}</b><span className={styles.sis}>{g.baslik}</span></div>
                <span className={styles.sin}>{g.plaka}</span>
              </button>;
            })}
          </div>
          <div className={styles.det} ref={gateDetailRef}>
            {activeGate && <>
              <div className={styles.dh}><div className={styles.ds}>{energy.s}</div><div><div className={styles.dn}>{activeGate.sehir}</div><div className={styles.dd}>{activeGate.baslik} &mdash; {activeGate.tanrica}</div></div></div>
              <div className={styles.tags}><span className={styles.tg}>{activeGate.faz}</span><span className={styles.tg}>{activeGate.element}</span></div>
              <div className={styles.soul}><p>{isTR?soul.tr:soul.en}</p></div>
              <div className={styles.trigger}><div className={styles.tl}>{isTR?"Tetik Soru":"Trigger Question"}</div><div className={styles.tt}>{"\u201C"}{isTR?soul.tqTR:soul.tqEN}{"\u201D"}</div></div>
              <div className={styles.rit}><button className={styles.ritBtn} onClick={() => setRitualOpen(p=>!p)}><span>{isTR?"Mikro Rit\u00fcel":"Micro Ritual"}</span><span>{ritualOpen?"\u25B2":"\u25BC"}</span></button>{ritualOpen&&<div className={styles.ritC}>{isTR?soul.rTR:soul.rEN}</div>}</div>
              <div className={styles.cta}><button className={styles.ctaBtn} onClick={goToSanriGate}>{energy.s} {isTR?"Bu Kap\u0131dan Ge\u00e7":"Enter This Gate"}</button><p className={styles.ctaH}>{isTR?"SANRI bu kap\u0131n\u0131n bilincinden konu\u015facak.":"SANRI will speak from this gate."}</p></div>
            </>}
          </div>
        </div>
      </>)}

      {/* CITIES TAB */}
      {tab === "cities" && (<>
        <div className={styles.hero} style={{"--gr":cityColor.split(",")[0],"--gg":cityColor.split(",")[1],"--gb":cityColor.split(",")[2]}}>
          <div className={styles.glow}/><h1 className={styles.h1}>{isTR?"81 \u015eehir. 81 Ruh. 1 Anadolu.":"81 Cities. 81 Souls. 1 Anatolia."}</h1>
          <p className={styles.hsub}>{isTR?"Her \u015fehir bir bilin\u00e7 kap\u0131s\u0131. Plaka kodundan isim \u00e7\u00f6z\u00fcm\u00fcne, elementinden arketipine \u2014 ruhsal harita.":"Each city is a gate of consciousness. The spiritual map of Anatolia."}</p>
        </div>
        <div className={styles.grid}>
          {/* CITY LIST */}
          <div className={styles.side}>
            {allCitiesTR.map(c => {
              const pl = String(c.id).padStart(2,"0"); const on = pl===activePlate;
              const ec = getElColor(c.element);
              return <button key={pl} className={`${styles.si} ${on?styles.siOn:""}`} style={{"--ir":ec.split(",")[0],"--ig":ec.split(",")[1],"--ib":ec.split(",")[2]}} onClick={() => { setActivePlate(pl); cityDetailRef.current?.scrollTo({top:0,behavior:"smooth"}); }}>
                <span className={styles.plate}>{pl}</span>
                <div className={styles.sit}><b>{isTR?c.name:(allCitiesEN.find(x=>x.id===c.id)||c).name}</b><span className={styles.sis}>{isTR?c.symbol:(allCitiesEN.find(x=>x.id===c.id)||c).symbol} \u2022 {isTR?c.element:(allCitiesEN.find(x=>x.id===c.id)||c).element}</span></div>
              </button>;
            })}
          </div>

          {/* CITY DETAIL */}
          <div className={styles.det} ref={cityDetailRef} style={{"--gr":cityColor.split(",")[0],"--gg":cityColor.split(",")[1],"--gb":cityColor.split(",")[2]}}>
            {cityLoading ? <div className={styles.muted}>...</div> : <>
              {/* HEADER */}
              <div className={styles.cityHead}>
                <div className={styles.cityPlBig}>{activePlate}</div>
                <div>
                  <div className={styles.dn}>{city?.name}</div>
                  <div className={styles.dd}>{city?.symbol} \u2022 {city?.element}</div>
                </div>
              </div>

              {/* ARCHETYPE */}
              <div className={styles.archBlock}>
                <div className={styles.archLabel}>{isTR ? "Arketip" : "Archetype"}</div>
                <div className={styles.archName}>{portal.a}</div>
                <div className={styles.archCore}>{portal.c}</div>
              </div>

              {/* 7 LAYER NAVIGATION */}
              {availableLayers.length > 0 && (
                <div className={styles.layerNav}>
                  {availableLayers.map(l => (
                    <button
                      key={l.key}
                      className={`${styles.layerBtn} ${activeLayer===l.key?styles.layerOn:""}`}
                      onClick={() => setActiveLayer(l.key)}
                    >
                      <span className={styles.layerIcon}>{l.icon}</span>
                      <span>{isTR ? l.tr : l.en}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* ACTIVE LAYER CONTENT */}
              {currentLayerBlock ? (
                <div className={styles.layerContent} key={activeLayer}>
                  <div className={styles.layerTitle}>{currentLayerBlock.title}</div>
                  <div className={styles.layerStory}>
                    {currentLayerBlock.story?.split("\n").map((line, i) => {
                      const t = line.trim();
                      if (!t) return <br key={i} />;
                      if (t.startsWith("$")) return null;
                      if (t.startsWith("\u25C6")) return <div key={i} className={styles.layerSection}>{t}</div>;
                      if (t.startsWith("\u2022")) return <div key={i} className={styles.layerBullet}>{t}</div>;
                      if (t === "\u2014") return <div key={i} className={styles.layerDivider} />;
                      return <p key={i}>{line}</p>;
                    })}
                  </div>
                  {currentLayerBlock.reflection && (
                    <div className={styles.reflectionBox}>
                      <div className={styles.reflLabel}>{isTR ? "Yans\u0131ma Sorusu" : "Reflection"}</div>
                      <div className={styles.reflText}>{"\u201C"}{currentLayerBlock.reflection}{"\u201D"}</div>
                    </div>
                  )}
                </div>
              ) : (
                <div className={styles.soul}>
                  <p>{city?.description}</p>
                </div>
              )}

              {/* JOURNEY SECTIONS (base layer) */}
              {hasJourney && activeLayer === "base" && cityJourney?.sections?.map((sec, i) => (
                <div key={i} className={styles.jItem}>
                  <div className={styles.jLabel}>{sec.label}</div>
                  <div className={styles.jText}>{sec.text}</div>
                </div>
              ))}

              {/* AYNA CUMLELERI (base layer) */}
              {activeLayer === "base" && cityGateData?.sanri_layer?.ayna_cumleleri?.length > 0 && (
                <div className={styles.trigger}>
                  <div className={styles.tl}>{isTR ? "Ayna C\u00fcmleleri" : "Mirror Sentences"}</div>
                  {cityGateData.sanri_layer.ayna_cumleleri.map((l,i) => (
                    <div key={i} className={styles.tt} style={{fontSize:"15px",marginBottom:"6px"}}>{"\u201C"}{l}{"\u201D"}</div>
                  ))}
                </div>
              )}

              {/* BILINC OYUNU (base layer) */}
              {activeLayer === "base" && cityGateData?.sanri_layer?.bilinc_oyunu?.length > 0 && (
                <div className={styles.soul}>
                  <div className={styles.tl} style={{marginBottom:"10px"}}>{isTR ? "Bilin\u00e7 Oyunu" : "Consciousness Game"}</div>
                  {cityGateData.sanri_layer.bilinc_oyunu.map((l,i) => (
                    <p key={i} style={{marginBottom:"6px",opacity:.85}}>{l}</p>
                  ))}
                </div>
              )}

              {/* CTA */}
              <div className={styles.cta}>
                <button className={styles.ctaBtn} style={{background:`linear-gradient(135deg, rgba(${cityColor},1), rgba(${cityColor},.7))`}} onClick={goToSanriCity}>
                  {"\u2726"} {isTR ? "Bu \u015eehrin Ruhuna Gir" : "Enter This City\u2019s Soul"}
                </button>
                <p className={styles.ctaH}>{isTR?"SANRI bu \u015fehrin enerjisinden konu\u015facak.":"SANRI will speak through this city\u2019s energy."}</p>
              </div>
            </>}
          </div>
        </div>
      </>)}

      <div className={styles.foot}>{"\u00A9 2026 SANRI"}</div>
    </div>
  );
}
