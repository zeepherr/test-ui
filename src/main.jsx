import { createRoot } from "react-dom/client";

import { ThemeProvider } from "@/components/theme/theme-provider.jsx";

import { setupAuthInterceptors } from "./api/auth/auth.interceptor.js";
import App from "./App.jsx";
import "./index.css";
setupAuthInterceptors();
createRoot(document.getElementById("root")).render(
  <ThemeProvider defaultTheme="system" storageKey="motor-theme">
    <App />
  </ThemeProvider>,
);
