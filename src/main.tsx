import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "sonner";
import App from "./App";
import { LanguageProvider } from "./utils/i18n";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <App />
        <Toaster position="top-center" richColors closeButton />
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
);
