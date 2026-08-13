import { createRoot } from "react-dom/client";

import { ThemeProvider } from "@/components/theme/theme-provider.jsx";

import { setupAuthInterceptors } from "./api/auth/auth.interceptor.js";
import { setupGlobalErrorInterceptors } from "./api/error.interceptor.js";
import App from "./App.jsx";
import "./index.css";
setupAuthInterceptors();
setupGlobalErrorInterceptors();
createRoot(document.getElementById("root")).render(
  <ThemeProvider defaultTheme="system" storageKey="motor-theme">
    <App />
  </ThemeProvider>,
);
