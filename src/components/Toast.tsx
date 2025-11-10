"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 6 z-9999 px-4 py-3 rounded-lg shadow-[0_0_12px_rgba(0,0,0,0.25)] text-white text-sm font-medium
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
      `}
    >
      {message}
    </motion.div>
  );
}
