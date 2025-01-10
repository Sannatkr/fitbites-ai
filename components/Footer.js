// import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h3 className="text-xl font-bold text-blue-600 dark:text-blue-400 mb-2">
              Dietitian AI
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Revolutionizing meal analysis with artificial intelligence.
            </p>
          </div>
          <div className="w-full md:w-1/3 mb-6 md:mb-0">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Contact Us
            </h4>
            <p className="text-gray-600 dark:text-gray-300">
              Email: info@dietitianai.com
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Phone: (123) 456-7890
            </p>
          </div>
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Follow Us
            </h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Facebook
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
