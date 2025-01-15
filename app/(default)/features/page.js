import {
  Camera,
  Save,
  Search,
  Database,
  Smartphone,
  Calendar,
  Activity,
  Share2,
} from "lucide-react";

export default function Features() {
  const currentFeatures = [
    {
      icon: Camera,
      title: "Image Upload",
      description:
        "Upload food images and get instant nutritional metrics like calories, protein, and carbs.",
    },
    {
      icon: Save,
      title: "Analysis History",
      description:
        "Save your food analysis history for future reference and tracking.",
    },
    {
      icon: Search,
      title: "Accurate Recognition",
      description:
        "Powered by Google Cloud Vision for precise food identification.",
    },
    {
      icon: Database,
      title: "Nutrition API Integration",
      description:
        "Access to comprehensive nutritional data through our integrated Nutrition API.",
    },
    {
      icon: Smartphone,
      title: "Mobile-Friendly Design",
      description:
        "Use the app on-the-go with our responsive, mobile-first design.",
    },
  ];

  const futureFeatures = [
    {
      icon: Calendar,
      title: "Personalized Meal Planning",
      description:
        "Get AI-generated meal plans tailored to your nutritional needs and preferences.",
    },
    {
      icon: Activity,
      title: "Fitness Tracker Integration",
      description:
        "Sync with popular fitness trackers for a holistic view of your health.",
    },
    {
      icon: Share2,
      title: "Community Sharing",
      description:
        "Share your meals and progress with a supportive community of health enthusiasts.",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Dietitian AI Features
        </h1>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Current Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {currentFeatures.map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-blue-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-700 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Coming Soon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {futureFeatures.map((feature, index) => (
              <div key={index} className="flex items-start">
                <div className="flex-shrink-0">
                  <feature.icon className="h-6 w-6 text-green-500" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-700 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 text-center">
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
            Experience the power of AI-driven nutrition tracking today!
          </p>
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}
