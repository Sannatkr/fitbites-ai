import { Button } from "@/utils/ui/button";

export default function Hero() {
  return (
    <section className="bg-blue-50 dark:bg-gray-900 py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-600 dark:text-blue-400 mb-4">
          Dietitian AI
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8">
          Analyze your meals with precision
        </p>
        <Button size="lg">Get Started</Button>
      </div>
    </section>
  );
}
