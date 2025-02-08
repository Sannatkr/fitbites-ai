"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import LoginForm from "@/components/LoginForm";
import WelcomeForm from "@/components/WelcomeForm";

export default function Home() {
  const [pageState, setPageState] = useState({
    isLoading: true,
    showWelcome: false,
    phoneNumber: "",
  });
  const router = useRouter();

  useEffect(() => {
    // Check if the token exists in the cookies
    const token = Cookies.get("token");
    if (token) {
      // Redirect to the dashboard if the token exists
      router.replace("/dashboard");
    } else {
      // If no token, set loading to false to show the login form
      setPageState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [router]);

  const handleLoginSuccess = (token) => {
    Cookies.set("token", token, { expires: 7 });
    router.replace("/dashboard");
  };

  const handleNewUser = (phone) => {
    setPageState((prev) => ({
      ...prev,
      phoneNumber: phone,
      showWelcome: true,
    }));
  };

  // Show loader while checking for token
  if (pageState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen my-5 flex flex-col items-center justify-center text-center px-1">
      <div className="w-full">
        {!pageState.showWelcome ? (
          <LoginForm onSuccess={handleLoginSuccess} onNewUser={handleNewUser} />
        ) : (
          <WelcomeForm
            phoneNumber={pageState.phoneNumber}
            onSuccess={handleLoginSuccess}
          />
        )}
      </div>
    </div>
  );
}
