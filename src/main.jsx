import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App";
import "@/index.css";

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://asksanri-frontend-52xeuimg-caelinus-ai-d01e5346.vercel.app",
        "https://asksanri.vercel.app",  # varsa custom domain
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
 
 