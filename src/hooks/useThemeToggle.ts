"use client";
import { useEffect, useState } from "react";
type Theme = "light" | "dark";

export function useThemeToggle() {
    const [theme, setTheme] = useState<Theme>("light");
    useEffect(() => {
        document.documentElement.classList.remove("dark");
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTheme("light");
    }, []);
    const toggleTheme = () => {
        const newTheme: Theme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };
    return { theme, toggleTheme };
}
