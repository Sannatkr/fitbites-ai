// app/dashboard/layout.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.replace("/");
    }
  }, [router]);

  return (
    <div className="w-full min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      <main className="w-full">{children}</main>
      <Footer />
    </div>
  );
}
