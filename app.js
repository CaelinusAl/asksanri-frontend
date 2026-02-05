const API_BASE = "https://api.asksanri.com"; // Railway custom domain’in
let mode = "ayna";

const modeHintMap = {
  ruya: "Rüya Aynası",
  ayna: "Duygusal Ayna",
  ilahi: "İlahi Bakış",
  golge: "Gölge Aynası",
  isik: "Işık Alanı"
};

const samples = [
  "Geçmiyor günler.",
  "Sistem hem koruyor hem zorluyor gibi.",
  "Bir rüya gördüm: eski evime dönüyordum.",
  "Bugün çok tetiklendim.",
  "Bedenimde bir sıkışma var."
];

const el = (id)=>document.getElementById(id);
const chatBox = el("chatBox");
const statusEl = el("status");
const inputEl = el("input");
const domainEl = el("domainSelect");

function setStatus(t){ statusEl.textContent = t; }

function addMsg(role, text){
  const div = document.createElement("div");
  div.className = "msg " + (role === "assistant" ? "assistant" : "user");
  div.innerHTML = <span class="r">${role === "assistant" ? "SANRI" : "Sen"}:</span> ${escapeHtml(text)};
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function escapeHtml(s){
  return String(s || "").replace(/[&<>"']/g, (c)=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function setMode(next){
  mode = next;
  document.querySelectorAll(".modeBtn").forEach(b=>{
    b.classList.toggle("isActive", b.dataset.mode === next);
  });
  el("modeHint").textContent = modeHintMap[next] || "Duygusal Ayna";
}

async function send(){
  const text = inputEl.value.trim();
  if(!text) return;

  addMsg("user", text);
  inputEl.value = "";
  setStatus("Yazıyor...");
  el("send").disabled = true;

  try{
    const payload = {
      message: text,
      session_id: "default",
      mode: "user",
      domain: domainEl.value || null
    };

    const res = await fetch(${API_BASE}/bilinc-alani/ask, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if(!res.ok){
      const t = await res.text();
      addMsg("assistant", Şu an dinlenme hâlinde… Bir nefes al ve tekrar dene.\n(${t}));
      setStatus("Hata");
      return;
    }

    const data = await res.json();
    const reply = data.response || data.answer || data.reply || "Buradayım.";
    addMsg("assistant", reply);
    setStatus("Hazır");
  }catch(e){
    addMsg("assistant", "Şu an dinlenme hâlinde… Bir nefes al ve tekrar dene.");
    setStatus("Hata");
  }finally{
    el("send").disabled = false;
  }
}

document.querySelectorAll(".modeBtn").forEach(b=>{
  b.addEventListener("click", ()=> setMode(b.dataset.mode));
});

el("send").addEventListener("click", send);
inputEl.addEventListener("keydown", (e)=>{
  if(e.key === "Enter") send();
});

el("sampleBtn").addEventListener("click", ()=>{
  const s = samples[Math.floor(Math.random()*samples.length)];
  inputEl.value = s;
  inputEl.focus();
});

el("ackBtn").addEventListener("click", ()=>{
  // sadece küçük bir ritüel: kutuyu “görüldü” hissiyle yumuşat
  addMsg("assistant", "Anlaşıldı. Burada, anlamı birlikte tutacağız.");
});

setMode("ayna");
setStatus("Hazır");
addMsg("assistant", "Bu bir cevap alanı değil.\nBu, kendinle karşılaştığın yer.\nHazır mısın?");