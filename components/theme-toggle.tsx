/**
 * @file components/theme-toggle.tsx
 * @description 다크모드/라이트모드 토글 컴포넌트
 *
 * 모던한 디자인의 테마 토글 버튼
 */

"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Theme = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 저장된 테마 설정 불러오기
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme("system");
    }
  }, []);

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement;
    
    if (newTheme === "system") {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", systemDark);
    } else {
      root.classList.toggle("dark", newTheme === "dark");
    }
  };

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  // 시스템 테마 변경 감지
  useEffect(() => {
    if (theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("system");
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  // 서버 렌더링 중에는 아무것도 표시하지 않음 (hydration mismatch 방지)
  if (!mounted) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        aria-label="테마 변경" 
        disabled
        className="rounded-full w-10 h-10"
      >
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          aria-label="테마 변경"
          aria-haspopup="menu"
          className="rounded-full w-10 h-10 hover:bg-primary/10 hover:text-primary transition-all duration-300"
        >
          {theme === "dark" ? (
            <Moon className="h-5 w-5 transition-transform duration-300 hover:rotate-12" />
          ) : theme === "light" ? (
            <Sun className="h-5 w-5 transition-transform duration-300 hover:rotate-45" />
          ) : (
            <Monitor className="h-5 w-5" />
          )}
          <span className="sr-only">테마 변경</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-card border-border/50 rounded-xl p-1">
        <DropdownMenuItem 
          onClick={() => handleThemeChange("light")}
          className="cursor-pointer rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Sun className="mr-2 h-4 w-4 text-chart-5" />
          <span className="font-medium">라이트</span>
          {theme === "light" && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("dark")}
          className="cursor-pointer rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Moon className="mr-2 h-4 w-4 text-chart-2" />
          <span className="font-medium">다크</span>
          {theme === "dark" && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleThemeChange("system")}
          className="cursor-pointer rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
        >
          <Monitor className="mr-2 h-4 w-4 text-muted-foreground" />
          <span className="font-medium">시스템</span>
          {theme === "system" && <span className="ml-auto text-primary">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
