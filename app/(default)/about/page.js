import { ArrowRight } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="bg-white mt-10 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          About FitBites AI
        </h1>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Our Mission
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            At Dietitian AI, we're on a mission to revolutionize the way people
            understand and manage their nutrition. Our food detection app is
            designed to empower gym enthusiasts, fitness-conscious individuals,
            and health enthusiasts to effortlessly track their nutrition with
            unprecedented accuracy and convenience.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            We believe that knowledge is power, especially when it comes to your
            health. By providing detailed nutritional information at your
            fingertips, we aim to help you make informed decisions about your
            diet and achieve your fitness goals.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Our Story
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Dietitian AI was born out of a simple yet powerful idea: what if we
            could instantly know the nutritional content of any food just by
            taking a picture? Our founders, a team of health-conscious tech
            enthusiasts, set out to turn this idea into reality.
          </p>
          <p className="text-gray-700 dark:text-gray-300">
            After months of research, development, and countless taste tests
            (someone had to do it!), we launched Dietitian AI with the goal of
            making nutrition tracking as simple as snapping a photo.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Our Vision
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We envision a world where everyone has the tools and knowledge to
            make healthier food choices. Our app is just the beginning. We're
            constantly innovating and expanding our capabilities to provide you
            with the most comprehensive and user-friendly nutrition companion
            possible.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            The Technology Behind Dietitian AI
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Dietitian AI harnesses the power of cutting-edge technology to
            deliver accurate and instant nutritional information:
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
            <li>Advanced AI algorithms for precise food recognition</li>
            <li>
              Integration with Google Cloud Vision for superior image analysis
            </li>
            <li>
              Comprehensive Nutrition APIs for detailed and accurate nutritional
              data
            </li>
            <li>Machine learning models that improve accuracy over time</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300">
            We're committed to staying at the forefront of technological
            advancements to provide you with the best possible nutrition
            tracking experience.
          </p>
        </section>

        <div className="mt-12 text-center">
          <a
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
