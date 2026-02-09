// src/pages/OnboardingPage.jsx
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Progress } from "../components/ui/progress";

const OnboardingPage = () => {
  const { language, t } = useLanguage();

  // i18n text kaynağı (sende t objesi farklıysa: t.onboarding / t şeklinde ayarla)
  const text = (t?.onboarding?.[language] || t?.[language] || t?.tr || {}) ?? {};

  // ✅ SADECE 1 KERE questions
  const questions = useMemo(() => {
    return [
      {
        key: "time_perception",
        title: text.q1_title || (language === "en" ? "Time Perception" : "Zaman Algısı"),
        subtitle:
          text.q1_subtitle ||
          (language === "en" ? "How do you feel time?" : "Zamanı nasıl algılıyorsun?"),
        options: [
          { value: "linear", label: text.q1_opt1 || (language === "en" ? "Linear" : "Lineer") },
          { value: "cyclic", label: text.q1_opt2 || (language === "en" ? "Cyclic" : "Döngüsel") },
          { value: "timeless", label: text.q1_opt3 || (language === "en" ? "Timeless" : "Zamansız") },
        ],
      },
      {
        key: "identity",
        title: text.q2_title || (language === "en" ? "Identity" : "Kimlik"),
        subtitle:
          text.q2_subtitle ||
          (language === "en" ? "Where do you live most?" : "En çok nerede yaşıyorsun?"),
        options: [
          { value: "mind", label: text.q2_opt1 || (language === "en" ? "Mind" : "Zihin") },
          { value: "body", label: text.q2_opt2 || (language === "en" ? "Body" : "Beden") },
          { value: "observer", label: text.q2_opt3 || (language === "en" ? "Observer" : "Gözlemci") },
        ],
      },
      {
        key: "purpose",
        title: text.q4_title || (language === "en" ? "Purpose" : "Amaç"),
        subtitle:
          text.q4_subtitle ||
          (language === "en" ? "What calls you more?" : "Seni daha çok ne çağırıyor?"),
        options: [
          { value: "dreams", label: text.q4_opt1 || (language === "en" ? "Dreams" : "Rüyalar") },
          { value: "rituals", label: text.q4_opt2 || (language === "en" ? "Rituals" : "Ritüeller") },
        ],
      },
    ];
  }, [language, text]);

  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({});

  // ✅ SADECE 1 KERE currentQuestion
  const currentQuestion = questions[Math.max(0, Math.min(step - 1, questions.length - 1))];
  const progress = Math.round((step / (questions.length + 1)) * 100);

  const handleSelect = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step <= questions.length) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const isAnswered = !!answers[currentQuestion?.key];

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-6 max-w-xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">
              {language === "en" ? "Onboarding" : "Başlangıç"}
            </p>
            <Progress value={progress} className="h-1" />
          </div>

          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-6">
              <h1 className="font-serif text-2xl text-foreground mb-1">
                {currentQuestion?.title}
              </h1>
              <p className="text-sm text-muted-foreground mb-5">
                {currentQuestion?.subtitle}
              </p>

              <div className="space-y-2">
                {(currentQuestion?.options || []).map((opt) => {
                  const active = answers[currentQuestion.key] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleSelect(currentQuestion.key, opt.value)}
                      className={`w-full text-left px-4 py-3 rounded-xl border transition ${
                        active
                          ? "border-accent/60 bg-accent/10"
                          : "border-border/40 hover:border-accent/30 hover:bg-accent/5"
                      }`}
                    >
                      <span className="text-foreground">{opt.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="outline" onClick={handleBack} disabled={step === 1}>
                  {language === "en" ? "Back" : "Geri"}
                </Button>

                <Button onClick={handleNext} disabled={!isAnswered}>
                  {step <= questions.length
                    ? language === "en" ? "Next" : "İleri"
                    : language === "en" ? "Finish" : "Bitir"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Debug / görmek istersen */}
          {/* <pre className="text-xs text-muted-foreground mt-6">{JSON.stringify(answers, null, 2)}</pre> */}
        </motion.div>
      </div>
    </div>
  );
};

export default OnboardingPage;