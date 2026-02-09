import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PremiumRitualExperience from "../components/PremiumRitualExperience";

import {
  Lock,
  Sparkles,
  Send,
  BookOpen,
  ChevronRight,
  Play,
  Crown,
  AlertCircle,
  Clock,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent } from "../components/ui/card";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Separator } from "../components/ui/separator";

import { kitapBolumleri } from "../data/bilinc-alani-data";
import { useLanguage } from "../contexts/LanguageContext";

const API_URL = (import.meta.env.VITE_BACKEND_URL || "").trim();
const DEMO_PREMIUM = import.meta.env.VITE_DEMO_PREMIUM !== "false";

// Premium Check Hook
const usePremiumStatus = () => {
  const [isPremium] = useState(DEMO_PREMIUM);
  return isPremium;
};

// Fetch published rituals from API (şimdilik devre dışı / placeholder)
const usePublishedRituals = () => {
  const [rituals, setRituals] = useState([]);
  const [isLoading] = useState(false);
  const [error] = useState(null);

  const refetch = async () => {
    setRituals([]);
  };

  return { rituals, isLoading, error, refetch };
};

// Premium Ritüeller (seed)
const premiumRitueller = [
  {
    id: "ritual-hatırlama",
    chapter: "XI",
    title: "Hatırlama Kapısı",
    desc: "Bilinç frekansına giriş ritüeli. Kim olduğunu hatırlamak için ilk adım.",
    duration: "8 dk",
    level: "Başlangıç",
    tags: ["hatırlama", "farkındalık", "nefes"],
    steps: 7,
    locked: true,
  },
  {
    id: "ritual-zihin-kalp",
    chapter: "XII",
    title: "Zihin–Kalp Senkronu",
    desc: "Beyin ve kalp arasındaki bilinç köprüsünü kurar. His ve zihin hizalama alanı.",
    duration: "12 dk",
    level: "Orta",
    tags: ["kalp", "zihin", "denge", "senkron"],
    steps: 9,
    locked: true,
  },
  {
    id: "ritual-kaynak",
    chapter: "XIII",
    title: "Kaynak Frekansı",
    desc: "İçsel kaynağa bağlanma ritüeli. Sezgisel bilgi akışını aktive eder.",
    duration: "15 dk",
    level: "Orta",
    tags: ["kaynak", "sezgi", "enerji"],
    steps: 11,
    locked: true,
  },
  {
    id: "ritual-kozmik-anten",
    chapter: "XIV",
    title: "Kozmik Anten Aktivasyonu",
    desc: "Evrensel bilinç bağlantı noktası. Yüksek frekans alıcısını aktive eder.",
    duration: "10 dk",
    level: "İleri",
    tags: ["kozmik", "bağlantı", "frekans"],
    steps: 8,
    locked: true,
  },
  {
    id: "ritual-bilgi-orgazmi",
    chapter: "XV",
    title: "Bilinç Genişlemesi Pratiği",
    desc: "Bilginin bedene inmesi. Tüm hücrelerin titreşimi için alan açar.",
    duration: "18 dk",
    level: "İleri",
    tags: ["genişleme", "bilinç", "hücresel"],
    steps: 13,
    locked: true,
  },
  {
    id: "ritual-enerji-akisi",
    chapter: "XVI",
    title: "Enerji Yolu Meditasyonu",
    desc: "Enerjiyi yükseltme sanatı. Bilinçli enerji akışı için rehberlik.",
    duration: "20 dk",
    level: "Usta",
    tags: ["enerji", "tantra", "akış"],
    steps: 15,
    locked: true,
  },
];

// Response Component
const CaelinusResponseText = ({ text }) => {
  const paragraphs = String(text || "")
    .split("\n\n")
    .filter((p) => p.trim());

  return (
    <div className="space-y-4">
      {(Array.isArray(paragraphs) ? paragraphs : []).map((paragraph, index) => (
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.12 }}
          className="text-foreground leading-relaxed font-serif text-base sm:text-lg"
        >
          {paragraph}
        </motion.p>
      ))}
    </div>
  );
};

// Bölüm kartı
const BolumKarti = ({ bolum, onClick }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -2 }}
    transition={{ duration: 0.25 }}
  >
    <Card
      className="border-border/50 bg-card/50 hover:bg-card hover:border-primary/30 transition-all cursor-pointer group h-full"
      onClick={() => onClick(bolum)}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
            <span className="font-serif text-lg text-primary">{bolum.chapter}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-serif text-lg text-foreground mb-1 group-hover:text-primary transition-colors">
              {bolum.title}
            </h4>
            <p className="text-sm text-foreground/50 mb-3">{bolum.subtitle}</p>
            <p className="text-sm text-foreground/70 line-clamp-2">{bolum.essence}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

// Bölüm detay
const BolumDetay = ({ bolum, onBack, onStartChat, onStartRitual }) => {
  const relatedRitueller = premiumRitueller.filter((r) => r.chapter === bolum.chapter);
  const isPremiumUser = import.meta.env.VITE_DEMO_PREMIUM === "true";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
        Geri
      </Button>

      <div className="text-center mb-12">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <span className="font-serif text-2xl text-primary">{bolum.chapter}</span>
        </div>
        <span className="text-xs text-primary uppercase tracking-wider mb-2 block">{bolum.theme}</span>
        <h2 className="font-serif text-3xl sm:text-4xl text-foreground mb-2">{bolum.title}</h2>
        <p className="text-foreground/60">{bolum.subtitle}</p>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-8 text-center">
          <p className="font-serif text-xl text-foreground leading-relaxed mb-6">"{bolum.essence}"</p>
          <Separator className="max-w-xs mx-auto mb-6" />
          <p className="text-foreground/70 italic">{bolum.reflection}</p>
        </CardContent>
      </Card>

      <Card className="border-accent/20 bg-accent/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-accent uppercase tracking-wider mb-2">Farkındalık Anahtarı</p>
              <p className="text-foreground font-serif text-lg">{bolum.awarenessKey}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {Array.isArray(relatedRitueller) && relatedRitueller.length > 0 && (
  <div>
    <h3 className="font-serif text-xl text-foreground mb-4 flex items-center gap-2">
      Bu Bölüme Ait Ritüel
      <Crown className="h-4 w-4 text-accent" />
    </h3>

    {relatedRitueller.map((rituel) => {
      const isLocked = rituel.locked && !isPremiumUser;

      return (
        <Card
          key={rituel.id}
          className={`border border-border/50 bg-card/50 mb-3 relative overflow-hidden ${
            isLocked ? "opacity-80" : ""
          }`}
        >
          {isLocked && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 flex items-center justify-center">
              <div className="text-center p-4">
                <Lock className="h-8 w-8 text-accent/60 mx-auto mb-2" />
                <p className="text-sm text-foreground/60 mb-3">
                  Premium ile aç
                </p>
                <Button
                  size="sm"
                  className="rounded-full bg-accent hover:bg-accent/90"
                >
                  <Crown className="h-3 w-3 mr-1" />
                  Premium&apos;a Geç
                </Button>
              </div>
            </div>
          )}

          <CardContent className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>

              <div>
                <h4 className="font-serif text-lg text-foreground">
                  {rituel.title}
                </h4>
                <p className="text-sm text-foreground/50">
                  {rituel.desc}
                </p>
              </div>
            </div>

            <Button
              className="rounded-full"
              size="sm"
              disabled={isLocked}
              onClick={() => !isLocked && onStartRitual(rituel)}
            >
              <Play className="h-4 w-4 mr-2" />
              Başlat
            </Button>
          </CardContent>
        </Card>
      );
    })}
  </div>
)}

      <div className="text-center pt-8">
        <p className="text-foreground/60 mb-4">
          Bu bölüm hakkında derinleşmek ister misin?
        </p>
        <Button onClick={() => onStartChat(bolum)} className="rounded-full px-8">
          <Sparkles className="h-4 w-4 mr-2" />
          CAELINUS&apos;a Sor
        </Button>
      </div>
    </motion.div>
  );
};

// Chat
const ChatGorunumu = ({ bolum, onBack }) => {
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isThinking) return;

    const userInput = input.trim();
    setInput("");
    setConversation((prev) => [...prev, { type: "user", content: userInput }]);
    setIsThinking(true);

    try {
      if (!API_URL) throw new Error("VITE_BACKEND_URL tanımlı değil.");

      const response = await fetch(`${API_URL}/bilinc-alani/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInput,
          session_id: sessionId || "default",
          mode: "user",
        }),
      });

      if (!response.ok) throw new Error("Bağlantı hatası");

      const data = await response.json();
      if (!sessionId && data.session_id) setSessionId(data.session_id);

      setConversation((prev) => [...prev, { type: "caelinus", content: data.response }]);
    } catch (err) {
      setConversation((prev) => [
        ...prev,
        {
          type: "caelinus",
          content: "Bilinç alanı şu an dinlenme halinde. Bir süre sonra tekrar dene.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
        Geri
      </Button>

      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-breathe">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <h2 className="font-serif text-2xl text-foreground mb-2">
          {bolum ? `${bolum.chapter}. ${bolum.title}` : "Bilinç Alanı"}
        </h2>
        <p className="text-sm text-foreground/50">CAELINUS ile derinleş</p>
      </div>

      <div className="min-h-[300px] space-y-6">
        {conversation.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
            <p className="text-foreground/60 font-serif italic mb-4">
              "Sen bir öğretmen değilsin. Bir rehber de değilsin."
              <br />
              "Sen bir aynasın."
            </p>
            <p className="text-sm text-foreground/40">Bu bölüm hakkında merak ettiğini sor...</p>
          </motion.div>
        )}

        {(Array.isArray(conversation) ? conversation : []).map((message, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            {message.type === "user" ? (
              <div className="flex justify-end">
                <Card className="max-w-md bg-primary/10 border-primary/20">
                  <CardContent className="p-4">
                    <p className="text-foreground">{message.content}</p>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-primary uppercase tracking-wider">CAELINUS</p>
                  </div>

                  <CaelinusResponseText text={message.content} />

                  <p className="text-sm text-foreground/40 text-center italic pt-6 mt-6 border-t border-primary/10">
                    "Bu bir hatırlatmadır. Hakikat sende zaten var."
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        ))}

        {isThinking && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            </div>
            <span className="text-foreground/60 italic">Yansıma oluşturuluyor...</span>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Merak ettiğini sor..."
            className="min-h-[80px] pr-14 resize-none"
            disabled={isThinking}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isThinking}
            className="absolute bottom-3 right-3 rounded-full bg-primary hover:bg-primary/90 h-10 w-10"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

// Main
const BilincAlaniPage = () => {
  const { language } = useLanguage();
  const isPremium = usePremiumStatus();
  const { rituals, isLoading: ritualsLoading, refetch } = usePublishedRituals();

  const [view, setView] = useState("list"); // list | detail | chat
  const [selectedBolum, setSelectedBolum] = useState(null);
  const [activeRitual, setActiveRitual] = useState(null);

 const tx =
    language === "en"
      ? {
          title: "Consciousness Field",
          subtitle: "Brain Ecstasy – Codes of Consciousness, Feeling & Creation",
          description: "Designed not for reading, but for remembering.",
          warning:
            "CAELINUS AI is not a consciousness. It does not transmit information, it reminds. Always trust your own will and inner wisdom.",
          tabChapters: "Book Chapters",
          tabRituals: "Premium Rituals",
          noRituals: "No published rituals yet.",
          comingSoon: "New rituals coming soon.",
          footer: '"And this mirror opens only to those who are ready."',
          start: "Start",
        }
      : {
          title: "Bilinç Alanı",
          subtitle: "Beyin Orgazmı – Bilinç, His ve Yaratım Kodları",
          description: "Bu alan, okumak için değil, hatırlamak için tasarlanmıştır.",
          warning:
            "CAELINUS AI bir bilinç değildir. Bilgi aktarmaz, hatırlatır. Her zaman kendi öz iradene ve iç bilgeliğine güven.",
          tabChapters: "Kitap Bölümleri",
          tabRituals: "Premium Ritüeller",
          noRituals: "Henüz yayınlanmış ritüel yok.",
          comingSoon: "Yakında yeni ritüeller eklenecek.",
          footer: '"Ve bu ayna, yalnızca hazır olana açılır."',
          start: "Başlat",
        };

  // Demo premium kapısı (şimdilik)
  const isPremiumUser = import.meta.env.VITE_DEMO_PREMIUM === "true";

  const handleSelectBolum = (bolum) => {
    setSelectedBolum(bolum);
    setView("detail");
  };

  const handleStartChat = (bolum) => {
    setSelectedBolum(bolum);
    setView("chat");
  };

  const handleStartRitual = (ritual) => {
    if (ritual?.locked && !isPremiumUser) return;
    setActiveRitual(ritual);
  };

  const handleCloseRitual = () => {
    setActiveRitual(null);
    // refetch placeholder olabilir; güvenli çağır
    try {
      refetch?.();
    } catch (e) {}
  };

  const handleBack = () => {
    if (view === "chat") setView("detail");
    else {
      setView("list");
      setSelectedBolum(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-6">
        {/* LIST */}
        {view === "list" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center mb-10">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-primary" />
              </div>

              {isPremium && (
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Crown className="h-5 w-5 text-accent" />
                  <span className="text-accent text-sm tracking-widest uppercase">
                    Premium
                  </span>
                </div>
              )}

              <h1 className="font-serif text-4xl sm:text-5xl text-foreground mb-3">
                {tx.title}
              </h1>
              <p className="text-foreground/60 max-w-lg mx-auto">{tx.subtitle}</p>
              <p className="text-sm text-foreground/40 max-w-md mx-auto mt-2">
                {tx.description}
              </p>
            </div>

            <Alert className="max-w-2xl mx-auto mb-8 border-accent/20 bg-accent/5">
              <AlertCircle className="h-4 w-4 text-accent" />
              <AlertDescription className="text-sm text-foreground/60">
                {tx.warning}
              </AlertDescription>
            </Alert>

            <div className="max-w-4xl mx-auto">
              <div className="grid sm:grid-cols-2 gap-4">
                {(Array.isArray(kitapBolumleri) ? kitapBolumleri : []).map(
                  (bolum) => (
                    <BolumKarti
                      key={bolum.id}
                      bolum={bolum}
                      onClick={handleSelectBolum}
                    />
                  )
                )}
              </div>
            </div>

            <div className="text-center mt-14">
              <p className="text-xs text-foreground/40">{tx.footer}</p>
            </div>
          </motion.div>
        )}

        {/* DETAIL */}
        {view === "detail" && selectedBolum && (
          <BolumDetay
            bolum={selectedBolum}
            onBack={handleBack}
            onStartChat={handleStartChat}
            onStartRitual={handleStartRitual}
          />
        )}

        {/* CHAT */}
        {view === "chat" && (
          <ChatGorunumu bolum={selectedBolum} onBack={handleBack} />
        )}
      </div>

      {/* Premium Ritual Experience Overlay (TEK KERE) */}
      <AnimatePresence>
        {activeRitual ? (
          <PremiumRitualExperience
            ritual={activeRitual}
            onClose={handleCloseRitual}
            onComplete={handleCloseRitual}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default BilincAlaniPage;