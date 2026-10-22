import { Landing } from "@/components/Landing";
import { LanguageProvider } from "@/components/LanguageProvider";

export default function Home() {
  return (
    <LanguageProvider>
      <Landing />
    </LanguageProvider>
  );
}
