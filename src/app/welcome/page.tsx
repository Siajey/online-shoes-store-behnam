import type { Metadata } from "next";
import { WelcomeScreen } from "@/features/welcome/components/welcome-screen";

export const metadata: Metadata = {
  title: "خوش آمدید",
  robots: { index: false, follow: false },
};

export default function WelcomePage() {
  return <WelcomeScreen />;
}
