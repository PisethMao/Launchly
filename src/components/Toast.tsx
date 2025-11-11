"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Toast({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error" | "warning";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);
  const bgColor =
    type === "success"
      ? "bg-green-600"
      : type === "warning"
      ? "bg-yellow-500 text-black"
      : "bg-red-600";
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-9999 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${bgColor}`}
    >
      {message}
    </motion.div>
  );
}
