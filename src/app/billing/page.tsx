"use client";

import { useSession } from "next-auth/react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Toast from "@/components/Toast";

export default function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: session } = useSession();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const params = useSearchParams();
  const upgradeRequired = params.get("upgradeRequired");

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (upgradeRequired) {
      showToast("Upgrade required to continue deploying.", "error");
    }
  }, [upgradeRequired]);

  return (
    <main className="max-w-4xl mx-auto px-6 py-16 font-poppins">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-semibold mb-4"
      >
        Billing & Plans
      </motion.h1>
      <AnimatePresence>
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mb-12 text-lg"
      >
        Current Plan:{}{" "}
        <span className="font-medium text-indigo-600 dark:text-indigo-400">
          {session?.user?.plan}
        </span>
      </motion.p>
      <div className="grid gap-8 sm:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          whileHover={{
            y: -6,
            scale: 1.02,
            transition: { duration: 0.25 },
          }}
          className="relative border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm overflow-hidden cursor-pointer group hover:shadow-xl transition-all"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-linear-to-br from-indigo-50 to-transparent dark:from-indigo-900/20 pointer-events-none"></div>
          <h2 className="text-2xl font-semibold mb-2">Free Plan</h2>
          <p className="mb-4">Up to 3 deployments • Basic features</p>
          <button
            type="button"
            className="cursor-pointer px-4 py-2 mt-2 w-full rounded-lg border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 active:scale-95 transition-all duration-200"
          >
            Current Plan
          </button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{
            y: -6,
            scale: 1.03,
            rotate: 0.5,
            transition: { duration: 0.25 },
          }}
          className="relative border border-indigo-300 dark:border-indigo-800 rounded-2xl p-6 shadow-md cursor-pointer group hover:shadow-2xl transition-all"
        >
          <div className="absolute -inset-1 rounded-2xl bg-linear-to-r from-indigo-400 to-purple-500 opacity-20 blur-xl group-hover:opacity-40 transition-all duration-300 pointer-events-none"></div>
          <h2 className="text-2xl font-semibold mb-2">Pro Plan</h2>
          <p className="mb-4">
            Unlimited deployments • Custom domains • Zip deploy
          </p>
          <button
            type="button"
            onClick={async () => {
              const res = await fetch("/api/billing/upgrade", {
                method: "POST",
                credentials: "include",
                headers: {
                  "Content-Type": "application/json",
                },
              });
              if (res.ok) {
                showToast("Successfully upgraded to Pro!", "success");
                await fetch("/api/auth/refresh-session");
                router.refresh();
              } else {
                showToast("Failed to upgrade.", "error");
              }
            }}
            className="cursor-pointer px-4 py-2 mt-4 w-full rounded-lg bg-indigo-600 text-white font-medium shadow-md hover:bg-indigo-700 hover:shadow-xl active:scale-95 transition-all duration-200"
          >
            Upgrage to Pro
          </button>
        </motion.div>
      </div>
    </main>
  );
}
