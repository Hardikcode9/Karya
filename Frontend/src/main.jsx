import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RootApp from "./RootApp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RootApp />
  </StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Service worker registration failing (e.g. unsupported browser) should
      // never block the app from working online.
    });
  });
}
