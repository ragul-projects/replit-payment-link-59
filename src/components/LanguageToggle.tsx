import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageToggle() {
  const [language, setLanguage] = useState<"en" | "hi">("en");

  const handleLanguageChange = (lang: "en" | "hi") => {
    setLanguage(lang);
    // In a real implementation, this would trigger i18n language change
    console.log(`Language switched to: ${lang}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 hover:bg-white/10 dark:hover:bg-white/10"
          aria-label="Change language"
        >
          <Globe className="h-4 w-4" />
          <span className="text-xs font-medium">{language.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("en")}
          className={language === "en" ? "bg-accent" : ""}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleLanguageChange("hi")}
          className={language === "hi" ? "bg-accent" : ""}
        >
          हिंदी
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}