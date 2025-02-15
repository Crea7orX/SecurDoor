"use client";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

const ThemeToggle = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    const { theme, setTheme } = useTheme();

    return (
      <Button
        variant="outline"
        size="icon"
        className={className}
        onClick={() =>
          theme === "dark" ? setTheme("light") : setTheme("dark")
        }
        ref={ref}
        {...props}
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>
    );
  },
);
ThemeToggle.displayName = "ThemeToggle";

export { ThemeToggle };
