import React from "react";

export default function App() {
  return (
    <div style={{ width: "100vw", height: "100vh", backgroundColor: "#000" }}>
      <iframe
        src="https://asksanri.com"
        title="AskSanri"
        style={{ width: "100%", height: "100%", border: "none" }}
        allow="camera; microphone; autoplay; clipboard-read; clipboard-write"
      />
    </div>
  );
}
