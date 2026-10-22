import type { Metadata } from "next";
import { LanguageProvider } from "@/components/LanguageProvider";
import { site } from "@/content/site";
import { AppPrototype } from "@/prototype/AppPrototype";

export const metadata: Metadata = {
  title: `Prototipe aplikasi ${site.name}`,
  description: "Prototipe yang bisa diklik dengan data contoh.",
};

export default function PrototypePage() {
  return (
    <LanguageProvider setTitle={false}>
      <AppPrototype />
    </LanguageProvider>
  );
}
