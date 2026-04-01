import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PaymentPages.module.css";

const API_BASE = (
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_URL ||
  "https://sanri-api-production-4a7b.up.railway.app"
).replace(/\/$/, "");

export default function IyzicoCallbackPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setTimeout(() => navigate("/payment/cancel?reason=no_token"), 1500);
      return;
    }

    const form = new FormData();
    form.append("token", token);

    fetch(`${API_BASE}/billing/iyzico/callback`, {
      method: "POST",
      body: form,
    })
      .then((res) => {
        if (res.redirected) {
          window.location.href = res.url;
        } else {
          navigate("/payment/success?provider=iyzico");
        }
      })
      .catch(() => {
        navigate("/payment/cancel?reason=callback_error");
      });
  }, [navigate]);

  return (
    <div className={styles.cancelPage}>
      <div className={styles.cancelCard}>
        <div style={{ fontSize: 32, marginBottom: 16 }}>◈</div>
        <h2 style={{ fontSize: 18, color: "#f0ecf8", margin: 0 }}>
          {status === "error" ? "Bir hata oluştu." : "Ödeme doğrulanıyor..."}
        </h2>
        <p style={{ fontSize: 14, color: "#a8a0c0", marginTop: 8 }}>
          Lütfen bekleyin, işleminiz kontrol ediliyor.
        </p>
      </div>
    </div>
  );
}
