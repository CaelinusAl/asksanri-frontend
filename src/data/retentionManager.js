/**
 * Retention Manager — multi-tier engagement tracking + local notification scheduling.
 * Reads/writes localStorage to track visit patterns without any backend dependency.
 */
import { showLocalNotification, isPushOptedIn } from "./pushNotifications";

const VISITS_KEY = "sanri_visits";
const LAST_VISIT_KEY = "sanri_last_visit";
const NOTIF_SCHEDULED_KEY = "sanri_notif_scheduled";
const SESSION_KEY = "sanri_anlasilma_last";

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Engagement tiers:
 *  - new:       first ever visit
 *  - returning: came back within 1-3 days, fewer than 3 total visits
 *  - loyal:     3+ visits
 *  - lapsed:    7+ days since last visit
 */
export function checkReturnState() {
  try {
    const now = Date.now();
    const lastVisit = parseInt(localStorage.getItem(LAST_VISIT_KEY) || "0", 10);
    const visits = parseInt(localStorage.getItem(VISITS_KEY) || "0", 10);

    if (!lastVisit || visits === 0) {
      return { tier: "new", visits: 0, daysSince: 0 };
    }

    const daysSince = Math.floor((now - lastVisit) / DAY_MS);

    if (daysSince >= 7) {
      return { tier: "lapsed", visits, daysSince };
    }
    if (visits >= 3) {
      return { tier: "loyal", visits, daysSince };
    }
    if (daysSince >= 1) {
      return { tier: "returning", visits, daysSince };
    }

    return { tier: "returning", visits, daysSince: 0 };
  } catch {
    return { tier: "new", visits: 0, daysSince: 0 };
  }
}

/**
 * Returns a tier-appropriate message in the given locale.
 */
export function getRetentionMessage(tier, locale = "tr") {
  const isTR = locale !== "en";
  const messages = {
    lapsed: {
      title: isTR ? "Seni bekleyen bir his vardı…" : "A feeling was waiting for you…",
      sub: isTR ? "Geri dönmek cesaret ister." : "Coming back takes courage.",
    },
    returning: {
      title: isTR ? "Dün burada kalmıştın." : "You were here yesterday.",
      sub: isTR ? "Devam etmek ister misin?" : "Want to continue?",
    },
    loyal: {
      title: isTR ? "Her gelişinde biraz daha derinleşiyorsun." : "Each visit takes you deeper.",
      sub: isTR ? "Bugün ne hissediyorsun?" : "What are you feeling today?",
    },
    new: {
      title: isTR ? "Burası senin alanın." : "This space is yours.",
      sub: isTR ? "İlk adımını at." : "Take your first step.",
    },
  };
  return messages[tier] || messages.new;
}

/**
 * Record the current visit. Call on every Anlasilma page mount.
 */
export function recordVisit() {
  try {
    const now = Date.now();
    const lastVisit = parseInt(localStorage.getItem(LAST_VISIT_KEY) || "0", 10);
    const visits = parseInt(localStorage.getItem(VISITS_KEY) || "0", 10);

    const isNewDay = !lastVisit || (now - lastVisit) > DAY_MS * 0.5;

    localStorage.setItem(LAST_VISIT_KEY, String(now));
    if (isNewDay) {
      localStorage.setItem(VISITS_KEY, String(visits + 1));
    }
  } catch { /* localStorage unavailable */ }
}

/**
 * Check if there's a saved session (for "son kaldigin yer" style resume).
 */
export function hasLastSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const d = JSON.parse(raw);
    return Date.now() - d.ts < 7 * DAY_MS;
  } catch {
    return false;
  }
}

/**
 * Schedule a local notification to fire ~24h after inactivity.
 * Uses setTimeout — only works while the tab is open (service worker push is separate).
 */
export function scheduleRetentionNotification() {
  try {
    if (!isPushOptedIn()) return;
    const already = sessionStorage.getItem(NOTIF_SCHEDULED_KEY);
    if (already) return;

    sessionStorage.setItem(NOTIF_SCHEDULED_KEY, "1");

    const DELAY = 20 * 60 * 1000; // 20 min of idle tab -> gentle nudge
    let timer = null;
    let lastActivity = Date.now();

    const reset = () => { lastActivity = Date.now(); };
    window.addEventListener("mousemove", reset, { passive: true });
    window.addEventListener("keydown", reset, { passive: true });
    window.addEventListener("touchstart", reset, { passive: true });

    timer = setInterval(() => {
      if (Date.now() - lastActivity > DELAY) {
        showLocalNotification(
          "Sanrı",
          "İçinde kalan bir şey var mı? Burası seni bekliyor.",
          { tag: "sanri-retention" }
        );
        clearInterval(timer);
        window.removeEventListener("mousemove", reset);
        window.removeEventListener("keydown", reset);
        window.removeEventListener("touchstart", reset);
      }
    }, 60_000);
  } catch { /* silent */ }
}
