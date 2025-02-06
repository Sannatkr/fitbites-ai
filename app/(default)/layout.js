import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DefaultLayout({ children }) {
  return (
    <div className="min-h-screen w-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow w-full">{children}</main>
      <Footer />
    </div>
  );
}
