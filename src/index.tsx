import "premy";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

if ("serviceWorker" in navigator) {
  await navigator.serviceWorker.register("./dist/serviceWorker.js", {
    type: "module",
  });
}

const container = document.createElement("div");
document.body.append(container);
createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
