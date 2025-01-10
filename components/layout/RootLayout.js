import Header from "../Header";
import Footer from "../Footer";

export default function RootLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      <main className="flex-grow"> {children}</main>
      <Footer />
    </div>
  );
}
