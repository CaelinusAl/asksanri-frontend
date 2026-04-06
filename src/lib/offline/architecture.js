/**
 * SANRI offline-first + yerel ağ — mimari özeti (kod içi referans).
 *
 * N.O.M.A.D. (IndexedDB v2, DB_VERSION 2)
 * - purchased_contents, user_notes, ritual_states, city_content_cache, frequency_cache,
 *   pending_actions, user_session_cache (+ v1: entitlements, contentSnapshots, syncOutbox, meshMessages).
 * - putEntitlement → purchased_contents aynası (contentArchive).
 * - Benim Alanım: mirrorShopierUnlockedToNomad; Defterim: user_notes + pending_actions user_notes_sync.
 * - Frekans Alanı: frequency_cache + getLatestFrequencyChakraSnapshot / mergeChakraSnapshotWithBundle (cache-first UI).
 * - Matrix Rol: user_session_cache matrix_rol_last_reading (rolReadingCache.js) — offline doğrudan sonuç; ağ hatasında fallback.
 * - Benim Alanım: listPurchasedContents + getUnlockedItems birleşik liste.
 * - Auth: ağ/sunucu hatasında localStorage sanri_user_cache ile oturum (offlineStale).
 * - Şehir detay: city_content_cache; Ritüel: ritual_states + ritual_session_complete.
 * - runNomadSync: önce flushSyncOutbox, sonra pending_actions (http_fetch | nomad tipleri).
 *   404/501 → status skipped (sonsuz deneme yok). Ağ hatası → failed (yeniden dene).
 *
 * OFFLINE (PWA)
 * - vite-plugin-pwa → precache, navigateFallback index.html, public/offline.html statik yedek sayfa.
 * - Okuma: putContentSnapshot; çevrimdışı SW önbelleği + IDB.
 * - pullAndMergeOkuma: syncPolicy LWW.
 *
 * MESH (WebRTC) — FAZ 4 gerçekçi MVP
 * - Şu an: SDP kopyala-yapıştır + pairingProof + şifreli data channel; BroadcastChannel + isteğe bağlı HTTP beacon.
 * - Eksik / 2. aşama: kalıcı sinyal sunucusu (WebSocket), kullanıcı kimliği, TURN ile NAT traversal,
 *   mDNS / yerel IP keşfi tarayıcıda kısıtlı; “aynı Wi‑Fi komşu” tam listesi için mobil/native veya ayrı discovery servisi.
 *
 * SINIRLAR
 * - Saf HTTPS web’de LAN multicast yok; komşu listesi beacon veya aynı makine sekmeleri ile sınırlı.
 * - Backend nomad sync uçları: backendSyncPlan.js.
 */

export const SANRI_OFFLINE_MESH_VERSION = "1.1.0";
