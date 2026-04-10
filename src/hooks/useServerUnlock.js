import { useState, useEffect } from "react";
import { isShopierUnlocked, checkServerUnlock } from "../data/shopierConfig";
import { useAuth } from "../contexts/AuthContext";

/**
 * Checks if content is unlocked — first from localStorage (instant),
 * then verifies against the server. Returns [unlocked, loading].
 * If the server says yes but localStorage didn't, it auto-updates localStorage
 * and flips the state to unlocked.
 */
export default function useServerUnlock(...contentIds) {
  const localCheck = contentIds.some((id) => isShopierUnlocked(id));
  const [unlocked, setUnlocked] = useState(localCheck);
  const [loading, setLoading] = useState(!localCheck);

  let userEmail = "";
  try {
    const auth = useAuth();
    userEmail = auth?.user?.email || "";
  } catch {}

  useEffect(() => {
    if (localCheck) {
      setUnlocked(true);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function verify() {
      for (const id of contentIds) {
        const ok = await checkServerUnlock(id, userEmail);
        if (ok && !cancelled) {
          setUnlocked(true);
          setLoading(false);
          return;
        }
      }
      if (!cancelled) setLoading(false);
    }

    verify();
    return () => { cancelled = true; };
  }, [localCheck, userEmail, ...contentIds]);

  return [unlocked, loading];
}
