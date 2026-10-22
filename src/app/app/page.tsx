import type { Metadata } from "next";
import { AppRoot } from "@/components/app/AppRoot";
import { LanguageProvider } from "@/components/LanguageProvider";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `${site.name}: menu keluarga hari ini`,
  description: "Menu harian bergizi untuk ibu hamil, ibu menyusui, dan anak, dengan target gizi AKG 2019.",
};

export default function AppPage() {
  return (
    <LanguageProvider setTitle={false}>
      <AppRoot />
    </LanguageProvider>
  );
}
