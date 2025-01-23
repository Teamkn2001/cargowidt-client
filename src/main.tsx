import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ClerkProvider } from "@clerk/clerk-react";

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

createRoot(document.getElementById("root")!).render(
  <ClerkProvider
    publishableKey={PUBLISHABLE_KEY}
    afterSignOutUrl="/"
    appearance={{
      layout: {
        helpPageUrl: "https://clerk.com/support",
        logoImageUrl: "/your-logo.png", 
        privacyPageUrl: "https://clerk.com/privacy",
        termsPageUrl: "https://clerk.com/terms",
      },
    }}
  >
    <App />
  </ClerkProvider>
);
