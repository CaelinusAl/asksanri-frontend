import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Infinity as InfinityIcon,
  Send,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Image as ImageIcon,
  X,
  Moon,
  Eye,
  Sun,
  Cloud,
  Heart,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

import { useLanguage } from "@/contexts/LanguageContext";

const API_URL = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");

// küçük koruma: map patlamasın
const safeArray = (v) => (Array.isArray(v) ? v : []);

const SanriResponseText = ({ text }) => {
  const paragraphs = String(text || "")
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4">
      {paragraphs.map((paragraph, index) => (
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
          className="text-foreground leading-relaxed font-serif text-base sm:text-lg"
        >
          {paragraph}
        </motion.p>
      ))}
    </div>
  );
};

const ImagePreview = ({ image, onRemove }) => {
  if (!image) return null;

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative inline-block">
      <img
        src={image.preview}
        alt="Yüklenen görsel"
        className="max-h-40 rounded-lg border border-border/50 object-cover"
      />
      <Button
        variant="destructive"
        size="icon"
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
        onClick={onRemove}
        type="button"
      >
        <X className="h-3 w-3" />
      </Button>
    </motion.div>
  );
};

const SanriyaSorPage = () => {
  const { t, language } = useLanguage();

  const readingModes = useMemo(
    () => ({
      dream: {
        id: "dream",
        label: t("sanri.modes.dream.label"),
        icon: Moon,
        emoji: "🌙",
        description: t("sanri.modes.dream.description"),
      },
      mirror: {
        id: "mirror",
        label: t("sanri.modes.mirror.label"),
        icon: Eye,
        emoji: "🪞",
        description: t("sanri.modes.mirror.description"),
      },
      divine: {
        id: "divine",
        label: t("sanri.modes.divine.label"),
        icon: Sun,
        emoji: "✨",
        description: t("sanri.modes.divine.description"),
      },
      shadow: {
        id: "shadow",
        label: t("sanri.modes.shadow.label"),
        icon: Cloud,
        emoji: "🌑",
        description: t("sanri.modes.shadow.description"),
      },
      light: {
        id: "light",
        label: t("sanri.modes.light.label"),
        icon: Heart,
        emoji: "🌿",
        description: t("sanri.modes.light.description"),
      },
    }),
    [t]
  );

  const modesList = useMemo(() => Object.values(readingModes), [readingModes]);

  const domainsList = useMemo(
    () => [
      { id: null, label: t("sanri.domainAuto"), subtitle: "", emoji: "✨" },
      {
        id: "awakened_cities",
        label: t("sanri.domains.awakened_cities.name"),
        subtitle: t("sanri.domains.awakened_cities.subtitle"),
        emoji: "🏛️",
      },
      {
        id: "consciousness_field",
        label: t("sanri.domains.consciousness_field.name"),
        subtitle: t("sanri.domains.consciousness_field.subtitle"),
        emoji: "🧠",
      },
      {
        id: "frequency_field",
        label: t("sanri.domains.frequency_field.name"),
        subtitle: t("sanri.domains.frequency_field.subtitle"),
        emoji: "〰️",
      },
      {
        id: "ritual_space",
        label: t("sanri.domains.ritual_space.name"),
        subtitle: t("sanri.domains.ritual_space.subtitle"),
        emoji: "🕯️",
      },
      {
        id: "neural_ecstasy",
        label: t("sanri.domains.neural_ecstasy.name"),
        subtitle: t("sanri.domains.neural_ecstasy.subtitle"),
        emoji: "⚡",
      },
      {
        id: "book_112",
        label: t("sanri.domains.book_112.name"),
        subtitle: t("sanri.domains.book_112.subtitle"),
        emoji: "📖",
      },
    ],
    [t]
  );

  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [sessionId, setSessionId] = useState("default");
  const [error, setError] = useState(null);

  const [activeMode, setActiveMode] = useState(readingModes.mirror);
  const [selectedDomain, setSelectedDomain] = useState(null);

  const [uploadedImage, setUploadedImage] = useState(null);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // dil değişince seçili mode’u koru
    setActiveMode((prev) => readingModes[prev?.id] || readingModes.mirror);
  }, [language, readingModes]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const currentMode = activeMode || readingModes.mirror;

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result || "");
      setUploadedImage({
        file,
        preview: result,
        base64: result.includes(",") ? result.split(",")[1] : null,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setUploadedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleExampleClick = () => {
    const examples = t("sanri.examples");
    const modeId = currentMode.id;
    setInput(examples?.[modeId] || examples?.mirror || "");
  };

  const handleReset = () => {
    setConversation([]);
    setInput("");
    setError(null);
    setSelectedDomain(null);
    setSessionId("default");
    handleRemoveImage();
  };

  const buildMessage = (userInput) => {
  // Görsel varsa kısa not ekle
  let msg = userInput;

  if (uploadedImage) {
    const prefix =
      language === "en"
        ? "[User shared an image]\n\nUser's question: "
        : "[Kullanıcı bir görsel paylaştı]\n\nKullanıcının sorusu: ";

    msg = prefix + userInput;
  }

  // Mode etiketi (backend "mode" ile karıştırmıyoruz)
  return "[SANRI_MODE=" + (currentMode?.id || "mirror") + "]\n" + msg;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!String(input).trim() || isThinking) return;

    if (!API_URL) {
      setError("VITE_BACKEND_URL tanımlı değil (Vercel Env).");
      return;
    }

    const userInput = String(input).trim();
    setInput("");
    setError(null);

    setConversation((prev) => [
      ...safeArray(prev),
      {
        type: "user",
        content: userInput,
        image: uploadedImage?.preview || null,
        mode: currentMode.id,
        domain: selectedDomain,
      },
    ]);

    setIsThinking(true);

    const requestBody = {
      message: buildMessage(userInput),
      session_id: sessionId || "default",
      mode: "user", // backend için: user/test/cocuk
      system_language: language,
    };

    if (selectedDomain) requestBody.domain = selectedDomain;

    // Görseli backend şu an kullanmıyorsa bile, ileride hazır olsun
    if (uploadedImage?.base64) requestBody.image_base64 = uploadedImage.base64;

    handleRemoveImage();

    try {
      const res = await fetch(${API_URL}/bilinc-alani/ask, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "SANRI dinleniyor… tekrar dene.");
      }

      const data = await res.json();

      setSessionId(data?.session_id || "default");

      setConversation((prev) => [
        ...safeArray(prev),
        {
          type: "sanri",
          content: data?.response || "Buradayım.",
          mode: currentMode.id,
          domain: selectedDomain,
        },
      ]);
    } catch (err) {
      setError(err?.message || t("common.error"));
      // son user mesajını geri almayalım; sadece error göster
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6 animate-breathe">
              <InfinityIcon className="h-10 w-10 text-accent" />
            </div>
            <span className="text-accent text-base tracking-widest uppercase mb-4 block font-medium">
              {t("sanri.subtitle")}
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground mb-6">
              {t("sanri.title")}
            </h1>

            <div className="space-y-3 text-foreground/70 text-base sm:text-lg leading-relaxed font-serif italic">
              <p>{t("sanri.introLine1")}</p>
              <p className="text-foreground/60">
                {t("sanri.introLine2")}
                <br />
                {t("sanri.introLine3")}
              </p>
              <p className="text-sm text-foreground/50">{t("sanri.introLine4")}</p>
              <p className="text-foreground/60 mt-4">
                {t("sanri.introLine5")}
                <br />
                {t("sanri.introLine6")}
              </p>
              <p className="text-accent/80 text-sm mt-4">{t("sanri.introReady")}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <AnimatePresence>
        {showDisclaimer && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="container mx-auto px-6 mb-6"
          >
            <Alert className="max-w-2xl mx-auto border-accent/30 bg-accent/5">
              <AlertCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
              <AlertDescription className="text-sm text-foreground/70 whitespace-pre-line">
                {t("sanri.disclaimer")}
                <Button
                  variant="link"
                  className="text-accent p-0 h-auto ml-2 text-sm"
                  onClick={() => setShowDisclaimer(false)}
                  type="button"
                >
                  {t("sanri.disclaimerButton")}
                </Button>
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main */}
      <section className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Mode Selection */}
          <div className="mb-6">
            <Label className="text-sm text-foreground/60 mb-4 block text-center font-serif italic">
              {t("sanri.modeSelect")}
            </Label>

            <div className="flex flex-wrap justify-center gap-3">
              {safeArray(modesList).map((mode) => (
                <Button
                  key={mode.id}
                  variant={currentMode.id === mode.id ? "default" : "outline"}
                  size="lg"
                  className={`rounded-full gap-2 transition-all duration-300 px-5 py-3 ${
                    currentMode.id === mode.id
                      ? "bg-accent/15 border border-accent/40 shadow-lg"
                      : "border-border/50 hover:border-accent/50 hover:bg-accent/5"
                  }`}
                  onClick={() => setActiveMode(mode)}
                  type="button"
                >
                  <span className="text-base">{mode.emoji}</span>
                  <span>{mode.label}</span>
                </Button>
              ))}
            </div>

            <p className="text-xs text-foreground/50 mt-3 text-center">{currentMode.description}</p>
          </div>

          {/* Domain Selection */}
          <div className="mb-8">
            <details className="group">
              <summary className="text-xs text-foreground/40 mb-2 cursor-pointer text-center hover:text-foreground/60 transition-colors list-none flex items-center justify-center gap-2">
                <span>{t("sanri.domainSelect")}</span>
                <svg className="w-3 h-3 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </summary>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 max-w-lg mx-auto">
                {safeArray(domainsList).map((domain) => (
                  <button
                    key={domain.id || "auto"}
                    className={`relative p-3 rounded-xl text-left transition-all ${
                      selectedDomain === domain.id
                        ? "bg-accent/15 border border-accent/40 shadow-sm"
                        : "bg-background/50 border border-border/30 hover:border-accent/30 hover:bg-accent/5"
                    }`}
                    onClick={() => setSelectedDomain(domain.id)}
                    type="button"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-base">{domain.emoji}</span>
                      <span className={text-xs font-medium ${selectedDomain === domain.id ? "text-accent" : "text-foreground/80"}}>
                        {domain.label}
                      </span>
                    </div>
                    {domain.subtitle ? (
                      <p className="text-[10px] text-foreground/50 leading-tight pl-6">{domain.subtitle}</p>
                    ) : null}
                  </button>
                ))}
              </div>
            </details>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-6">
                <Alert className="border-destructive/30 bg-destructive/5">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-sm">{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          <div className="min-h-[350px] mb-6 space-y-6">
            {safeArray(conversation).length === 0 && (
              <motion.div key={currentMode.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8">
                <div className="space-y-3 mb-6">
                  <Sparkles className="h-8 w-8 text-accent/50 mx-auto mb-4" />
                  <p className="text-foreground/70 font-serif italic text-lg">
                    &quot;{t(sanri.modes.${currentMode.id}.intro)}&quot;
                  </p>
                </div>

                <Button variant="outline" size="sm" className="rounded-full" onClick={handleExampleClick} type="button">
                  {t("sanri.exampleQuestion")}
                </Button>
              </motion.div>
            )}

            {safeArray(conversation).map((message, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
                {message.type === "user" ? (
                  <div className="flex justify-end">
                    <Card className="max-w-md bg-primary/10 border-primary/20">
                      <CardContent className="p-4">
                        {message.image ? (
                          <img src={message.image} alt="Paylaşılan görsel" className="max-h-32 rounded-lg mb-3" />
                        ) : null}
                        <p className="text-foreground text-base">{message.content}</p>
                        <span className="text-xs text-foreground/40 mt-2 block">
                          {(modesList.find((m) => m.id === message.mode)?.label || message.mode) + " modu"}
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <Card className="border-accent/20 bg-accent/5">
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex items-start justify-between gap-3 mb-6">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                            <InfinityIcon className="h-5 w-5 text-accent" />
                          </div>
                          <p className="text-sm text-accent uppercase tracking-wider font-medium pt-2">SANRI</p>
                        </div>
                      </div>

                      <SanriResponseText text={message.content} />

                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="text-sm text-foreground/50 text-center italic pt-6 mt-6 border-t border-accent/10"
                      >
                        &quot;{t("sanri.signature")}&quot;
                      </motion.p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            ))}

            {isThinking && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <InfinityIcon className="h-5 w-5 text-accent animate-pulse" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-base text-foreground/60 italic">{t("sanri.thinking")}</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-accent/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-accent/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-accent/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Image preview */}
          {uploadedImage ? (
            <div className="mb-4">
              <ImagePreview image={uploadedImage} onRemove={handleRemoveImage} />
            </div>
          ) : null}

          {/* Input */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("sanri.placeholder")}
                className="min-h-[100px] pr-24 resize-none bg-background border-border focus:border-accent text-base"
                disabled={isThinking}
              />

              <div className="absolute bottom-3 right-3 flex gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isThinking}
                >
                  <ImageIcon className="h-5 w-5 text-foreground/50" />
                </Button>

                <Button type="submit" size="icon" disabled={!String(input).trim() || isThinking} className="rounded-full bg-accent hover:bg-accent/90 h-10 w-10">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {safeArray(conversation).length > 0 && (
              <div className="flex justify-center">
                <Button type="button" variant="ghost" size="sm" onClick={handleReset} className="text-foreground/60 hover:text-foreground">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t("sanri.newReflection")}
                </Button>
              </div>
            )}
          </form>

          <div className="mt-10 text-center">
            <p className="text-sm text-foreground/50">{t("sanri.footerNote")}</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SanriyaSorPage;