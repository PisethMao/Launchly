"use client";
import Navbar from "@/components/navbar/Navbar";
import { usePathname } from "next/navigation";
import React from "react";
const HIDE_NAV_ROUTES = ["/login", "/register"];
export default function ClientShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const hideNavbar = HIDE_NAV_ROUTES.includes(pathName);
  return (
    <>
      {!hideNavbar && <Navbar />} {children}
    </>
  );
}
