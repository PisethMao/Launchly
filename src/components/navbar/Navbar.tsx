"use client";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import styles from "./style.module.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav
      className={`font-poppins fixed top-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-md z-50 ${styles.navbarAnimated}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link
          href="/"
          className="text-2xl font-bold text-indigo-400 dark:text-indigo-400 py-4"
        >
          Launchly
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/features"
            className={`${styles.navLink} text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition`}
          >
            Features
          </Link>
          <Link
            href="/docs"
            className={`${styles.navLink} text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition`}
          >
            Docs
          </Link>
          <Link
            href="/pricing"
            className={`${styles.navLink} text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition`}
          >
            Pricing
          </Link>
          <Link
            href="/auth/signin"
            className={`${styles.deployButton} ml-4 px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition`}
          >
            Deploy Now
          </Link>
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
          <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 px-6 pb-4 border-t border-gray-200 dark:border-gray-700 shadow-md md:hidden">
            <div className="flex flex-col items-center space-y-4 py-4">
              <Link
                href="/features"
                className={`${styles.navLink} block py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition`}
                onClick={() => setIsOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/docs"
                className={`${styles.navLink} block py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition`}
                onClick={() => setIsOpen(false)}
              >
                Docs
              </Link>
              <Link
                href="/pricing"
                className={`${styles.navLink} block py-2 text-gray-700 dark:text-gray-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition`}
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/auth/signin"
                className={`${styles.deployButton} block mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition`}
                onClick={() => setIsOpen(false)}
              >
                Deploy Now
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
