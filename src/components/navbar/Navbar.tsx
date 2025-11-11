"use client";
import { Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import styles from "./style.module.css";
import { navItems } from "@/data/navItemData";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import { usePathname } from "next/navigation";
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, toggleTheme } = useThemeToggle();
  const pathName = usePathname();
  const hideOnAuth =
    pathName.startsWith("/login") || pathName.startsWith("/register");
  if (hideOnAuth) {
    return null;
  }
  return (
    <nav
      className={`font-poppins fixed top-0 left-0 w-full bg-(--background)/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-(--foreground)/10 dark:border-gray-700 shadow-md z-50 ${styles.navbarAnimated}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-(--launchly-primary) py-4"
        >
          Launchly
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <Link
              key={index}
              className={`${styles.navLink} text-(--foreground) hover:text-indigo-500 dark:hover:text-indigo-400 transition`}
              href={item.href}
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/login"
            className="px-3 py-1.5 rounded-lg border dark:border-gray-700"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white"
          >
            Sign up
          </Link>
          <button
            type="button"
            aria-label="Toggle Theme"
            onClick={toggleTheme}
            className="ml-3 p-2 rounded-md hover:bg-indigo-600 transition cursor-pointer"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <button
          type="button"
          className="md:hidden text-gray-700 dark:text-gray-300 focus:outline-none transition-transform duration-200 hover:scale-110"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="transition-transform duration-300 ease-in-out">
            {isOpen ? <X size={26} /> : <Menu size={26} />}
          </span>
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 w-full bg-(--background) dark:bg-gray-900 px-6 pb-4 border-t border-gray-200 dark:border-gray-700 shadow-md md:hidden">
            <div className="flex flex-col items-center space-y-4 py-4">
              {navItems.map((item, index) => (
                <div key={index}>
                  <Link
                    className={`${styles.navLink} text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition`}
                    href={item.href}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-lg border dark:border-gray-700"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white"
              >
                Sign up
              </Link>
              <button
                type="button"
                onClick={toggleTheme}
                className="mt-2 flex items-center gap-2 dark:text-gray-300 hover:text-indigo-500 transition"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
