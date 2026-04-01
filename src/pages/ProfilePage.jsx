// CAELINUS AI - Bilinç Aynası (Consciousness Mirror) Profile Page
// User journey statistics, SANRI interactions, frequency progress

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Crown,
  Infinity,
  Moon,
  Sparkles,
  Target,
  Flame,
  Trophy,
  Calendar,
  MessageSquare,
  MapPin,
  Lock,
  ChevronRight,
  RefreshCw,
  Settings,
  LogOut
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Separator } from "../components/ui/separator";
import { useLanguage } from "../contexts/LanguageContext";
import { usePremium, FEATURES } from "../contexts/PremiumContext";
import { useAuth } from "../contexts/AuthContext";
import { UpgradeModal, PremiumBadge } from "../components/premium/PremiumComponents";


/** Güvenli yardımcılar (map patlamasın) */
const safeArray = (v) => (Array.isArray(v) ? v : []);
const safeEntries = (obj) => Object.entries(obj || {});

/** Recent Activity Item (JSX içinde const tanımlama yok!) */
const ActivityItem = ({ activity, language }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return language === "en" ? "Today" : "Bugün";
    if (days === 1) return language === "en" ? "Yesterday" : "Dün";
    if (days < 7) return `${days} ${language === "en" ? "days ago" : "gün önce"}`;
    return date.toLocaleDateString(language === "en" ? "en-US" : "tr-TR");
  };

  const title = activity?.title || activity?.label || activity?.action || "";
  const when = formatTime(activity?.timestamp || activity?.created_at);

  if (!title) return null;

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-foreground">{title}</span>
      <span className="text-muted-foreground">{when}</span>
    </div>
  );
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();

  // Premium context (senin mevcut sistemin)
  const {
    isPremium,
    isUpgradeModalOpen,
    showUpgradeModal,
    hideUpgradeModal,
  } = usePremium();

  // Profil verisi (API bağlanınca dolduracaksın)
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Örnek: fetchProfile — şimdilik kırmayacak şekilde
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      // TODO: buraya gerçek endpoint gelecek
      // const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, { ... })
      // const json = await res.json();
      // setData(json);

      // Şimdilik demo boş veri (map patlamasın)
      setData((prev) => prev ?? {
        level: 1,
        next_level_progress: 0,
        consciousness_map: {},
        recent_activity: [],
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const labels = useMemo(() => {
    // label yoksa key’leri gösteriyoruz
    return {
      tr: {
        mind: "Zihin",
        body: "Beden",
        heart: "Kalp",
        awareness: "Farkındalık",
        shadow: "Gölge",
      },
      en: {
        mind: "Mind",
        body: "Body",
        heart: "Heart",
        awareness: "Awareness",
        shadow: "Shadow",
      },
    }[language] || {};
  }, [language]);

  const dimensions = data?.consciousness_map || {};
  const recentActivity = safeArray(data?.recent_activity);

  const t = {
    level: language === "en" ? "Consciousness Level" : "Bilinç Seviyesi",
    toNext: language === "en" ? "to next level" : "sonraki seviyeye",
    premium: language === "en" ? "Premium" : "Premium",
    refresh: language === "en" ? "Refresh" : "Yenile",
    startRitual: language === "en" ? "Start Ritual" : "Ritüel Başlat",
    exploreCities: language === "en" ? "Explore Cities" : "Şehirleri Keşfet",
    openPremium: language === "en" ? "Unlock Premium" : "Premium’u Aç",
    activity: language === "en" ? "Recent Activity" : "Son Aktivite",
    empty: language === "en" ? "No activity yet." : "Henüz aktivite yok.",
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-6 max-w-3xl">
        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          style={{
            background: "none", border: "none", color: "rgba(200,160,255,0.7)",
            cursor: "pointer", fontSize: 13, fontWeight: 600, padding: "8px 0", marginBottom: 8,
          }}
        >
          ← {language === "en" ? "Gates" : "Kapılar"}
        </button>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="font-serif text-3xl text-foreground">
              {language === "en" ? "Profile" : "Profil"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {language === "en"
                ? "Your mirror inside the system."
                : "Sistemin içindeki aynan."}
            </p>
          </div>

          {isPremium ? (
            <div className="flex items-center gap-2 text-accent text-sm">
              <Crown className="h-4 w-4" />
              <span>{t.premium}</span>
            </div>
          ) : (
            <Button
              size="sm"
              className="rounded-full"
              onClick={() => showUpgradeModal?.(FEATURES.PROFILE_MIRROR)}
            >
              <Crown className="h-4 w-4 mr-2" />
              {t.openPremium}
            </Button>
          )}
        </div>

        {/* Level Card */}
        <Card className="border-border/50 bg-card/50 mb-6">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-3 border border-primary/30">
                <span className="font-serif text-3xl text-primary">
                  {data?.level || 1}
                </span>
              </div>

              <p className="text-sm text-muted-foreground">{t.level}</p>

              <Progress value={Number(data?.next_level_progress) || 0} className="mt-2 h-1" />
              <p className="text-xs text-muted-foreground/70 mt-1">
                {(Number(data?.next_level_progress) || 0)}% {t.toNext}
              </p>
            </div>

            {/* Dimensions */}
            <div className="space-y-3">
              {safeEntries(dimensions).length === 0 && (
                <p className="text-sm text-muted-foreground text-center">
                  {language === "en" ? "No map data yet." : "Henüz harita verisi yok."}
                </p>
              )}

              {safeEntries(dimensions).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">
                      {(labels && labels[key]) || key}
                    </span>
                    <span className="text-foreground">{Number(value) || 0}%</span>
                  </div>
                  <Progress value={Number(value) || 0} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          <Button asChild size="sm" className="rounded-full">
            <Link to="/rituel">
              <Target className="h-4 w-4 mr-2" />
              {t.startRitual}
            </Link>
          </Button>

          <Button asChild variant="outline" size="sm" className="rounded-full">
            <Link to="/sehirler">
              <MapPin className="h-4 w-4 mr-2" />
              {t.exploreCities}
            </Link>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="rounded-full text-muted-foreground"
            onClick={fetchProfile}
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t.refresh}
          </Button>
        </motion.div>

        {/* Recent Activity */}
        <Card className="border-border/50 bg-card/50">
          <CardContent className="p-6">
            <h2 className="font-serif text-xl text-foreground mb-4">{t.activity}</h2>

            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">{t.empty}</p>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity, idx) => (
                  <ActivityItem key={activity?.id || idx} activity={activity} language={language} />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upgrade Modal */}
        <UpgradeModal
          isOpen={!!isUpgradeModalOpen}
          onClose={hideUpgradeModal}
          feature={FEATURES.PROFILE_MIRROR}
        />
      </div>
    </div>
  );
};

export default ProfilePage;