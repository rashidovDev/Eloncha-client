import { createContext, useContext, useState, ReactNode } from "react";

export type Language = "ru" | "en" | "ko";

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("ru");

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};

export const AVAILABLE_LANGUAGES: {
  code: Language;
  label: string;
  icon: string;
}[] = [
  { code: "ru", label: "Рус", icon: "/flags/russia.png" },
  { code: "en", label: "Eng", icon: "/flags/usa.png" },
  { code: "ko", label: "한",  icon: "/flags/korea.png" },
];
