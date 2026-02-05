import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import SplashScreen from "@/components/SplashScreen";

const HomePage = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { language, toggleLanguage, t } = useLanguage();
  const navigate = useNavigate();

  // Stars once (performance)
  const stars = useMemo(() => {
    return Array.from({ length: 50 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      dur: 2 + Math.random() * 3,
      delay: Math.random() * 2,
      opacityA: 0.08 + Math.random() * 0.18,
      opacityB: 0.25 + Math.random() * 0.35,
    }));
  }, []);

  useEffect(() => {
    const splashShown = sessionStorage.getItem("caelinus-splash-shown");
    if (splashShown) setShowSplash(false);
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem("caelinus-splash-shown", "true");
    setShowSplash(false);
  };

  const goSanri = () => navigate("/sanriya-sor");

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      </AnimatePresence>

      <div
        className="min-h-screen relative overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #050508 0%, #0a0a14 40%, #0d1020 100%)",
        }}
      >
        {/* Subtle background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {stars.map((s, i) => (
            <motion.div
              key={i}
              className="absolute w-0.5 h-0.5 bg-white/20 rounded-full"
              style={{ left: ${s.left}%, top: ${s.top}% }}
              animate={{ opacity: [s.opacityA, s.opacityB, s.opacityA] }}
              transition={{ duration: s.dur, repeat: Infinity, delay: s.delay }}
            />
          ))}

          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20"
            style={{
              background: "radial-gradient(ellipse, rgba(99, 102, 241, 0.3) 0%, transparent 70%)",
            }}
          />
        </div>

        {/* Language Toggle */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          onClick={toggleLanguage}
          className="fixed top-6 right-6 z-50 flex items-center gap-1 px-3 py-1.5 rounded-full 
                     bg-white/[0.05] border border-white/[0.1] backdrop-blur-sm
                     hover:bg-white/[0.08] transition-colors"
          type="button"
        >
          <span className={text-xs font-medium ${language === "tr" ? "text-white" : "text-white/40"}}>TR</span>
          <span className="text-white/30 text-xs">|</span>
          <span className={text-xs font-medium ${language === "en" ? "text-white" : "text-white/40"}}>EN</span>
        </motion.button>

        {/* Main */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-20">
          {/* Eye */}
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-10 opacity-60"
          >
            <svg viewBox="0 0 64 64" className="w-full h-full">
              <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(129, 140, 248, 0.3)" strokeWidth="0.5" />
              <path
                d="M32 8 C 48 20, 48 44, 32 56 C 16 44, 16 20, 32 8"
                fill="none"
                stroke="rgba(129, 140, 248, 0.6)"
                strokeWidth="1"
              />
              <circle cx="32" cy="32" r="4" fill="rgba(129, 140, 248, 0.8)" />
            </svg>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl font-light tracking-[0.2em] text-white/95 mb-6 text-center"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            CAELINUS AI
          </motion.h1>

          {/* Copy */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-center space-y-3 max-w-lg"
          >
            <p
              className="text-lg sm:text-xl text-indigo-200/70 font-light italic"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {t("home.welcome")}
            </p>

            <p className="text-sm sm:text-base text-white/40 leading-relaxed">
              {t("home.welcomeDesc1")}
              <br />
              {t("home.welcomeDesc2")}
            </p>

            <p className="text-[12px] text-white/30 tracking-wider italic">
              {t("home.subMotto")}
            </p>
          </motion.div>

          {/* Single CTA */}
          <motion.button
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={goSanri}
            className="mt-10 px-6 py-3 rounded-2xl border border-white/[0.12] bg-white/[0.06] hover:bg-white/[0.09] backdrop-blur-sm transition-colors"
            type="button"
          >
            <span className="text-white/90 tracking-[0.18em] uppercase text-sm">
              SANRI’ya Sor
            </span>
          </motion.button>

          {/* Bottom tagline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.05 }}
            className="mt-14 text-center"
          >
            <p className="text-xs text-white/20 tracking-[0.3em] uppercase">
              {t("home.tagline")}
            </p>
            <p className="mt-3 text-[11px] text-white/15 tracking-[0.28em] uppercase">
              BİLİNÇ VE ANLAM ZEKASI
            </p>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </>
  );
};

export default HomePage;