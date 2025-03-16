import React from "react";
import { Link } from "react-router-dom";

const AboutPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">About crAIvings</h1>
            <p className="text-xl text-primary-100">
              Connecting food lovers with great restaurants through the power of
              AI
            </p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-8">
              At crAIvings, we're passionate about transforming the dining
              experience through artificial intelligence. Our mission is to
              provide diners with meaningful insights into restaurants based on
              real customer experiences, while helping restaurant owners
              understand and improve their offerings.
            </p>
            <p className="text-lg text-gray-700">
              Our AI-powered platform analyzes thousands of reviews to extract
              valuable information about food quality, service, ambiance, and
              value—giving you a comprehensive understanding of each restaurant
              before you dine.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">
            What Makes Us Different
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                AI-Powered Insights
              </h3>
              <p className="text-gray-600">
                Our advanced natural language processing breaks down reviews to
                identify what matters most, revealing trends and insights that
                would be impossible to spot manually.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Authentic Reviews</h3>
              <p className="text-gray-600">
                We prioritize genuine customer experiences with verified reviews
                and advanced sentiment analysis to ensure you get the real story
                about every restaurant.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Restaurant Owner Tools
              </h3>
              <p className="text-gray-600">
                Restaurant owners receive powerful analytics and actionable
                recommendations to enhance their business based on customer
                feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute top-0 left-8 md:left-1/2 w-1 h-full bg-primary-100 transform -translate-x-1/2"></div>

              {/* Steps */}
              <div className="space-y-12">
                <div className="relative flex flex-col md:flex-row">
                  <div className="md:w-1/2 md:pr-8 mb-4 md:mb-0">
                    <div className="md:text-right">
                      <h3 className="text-xl font-semibold mb-2">Discover</h3>
                      <p className="text-gray-600">
                        Browse restaurants by location, cuisine, price range, or
                        rating to find your next dining destination.
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-0 left-8 md:left-1/2 w-16 h-16 bg-primary-600 rounded-full transform -translate-x-1/2 flex items-center justify-center text-white font-bold text-xl">
                    1
                  </div>
                  <div className="md:w-1/2 md:pl-8"></div>
                </div>

                <div className="relative flex flex-col md:flex-row">
                  <div className="md:w-1/2 md:pr-8 mb-4 md:mb-0 md:order-2">
                    <div className="md:text-left">
                      <h3 className="text-xl font-semibold mb-2">Analyze</h3>
                      <p className="text-gray-600">
                        Review detailed AI-powered insights about food quality,
                        service, ambiance, and value before making your choice.
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-0 left-8 md:left-1/2 w-16 h-16 bg-primary-600 rounded-full transform -translate-x-1/2 flex items-center justify-center text-white font-bold text-xl">
                    2
                  </div>
                  <div className="md:w-1/2 md:pl-8 md:order-1"></div>
                </div>

                <div className="relative flex flex-col md:flex-row">
                  <div className="md:w-1/2 md:pr-8 mb-4 md:mb-0">
                    <div className="md:text-right">
                      <h3 className="text-xl font-semibold mb-2">Dine</h3>
                      <p className="text-gray-600">
                        Enjoy your meal with confidence, knowing what to expect
                        based on real customer experiences.
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-0 left-8 md:left-1/2 w-16 h-16 bg-primary-600 rounded-full transform -translate-x-1/2 flex items-center justify-center text-white font-bold text-xl">
                    3
                  </div>
                  <div className="md:w-1/2 md:pl-8"></div>
                </div>

                <div className="relative flex flex-col md:flex-row">
                  <div className="md:w-1/2 md:pr-8 mb-4 md:mb-0 md:order-2">
                    <div className="md:text-left">
                      <h3 className="text-xl font-semibold mb-2">Share</h3>
                      <p className="text-gray-600">
                        After your meal, contribute to the community by sharing
                        your own experience with a detailed review.
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-0 left-8 md:left-1/2 w-16 h-16 bg-primary-600 rounded-full transform -translate-x-1/2 flex items-center justify-center text-white font-bold text-xl">
                    4
                  </div>
                  <div className="md:w-1/2 md:pl-8 md:order-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Meet Our Team
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-56 bg-gray-200">
                <img
                  src="https://placehold.co/300x300/?text=portrait,professional,1"
                  alt="Team Member"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold">Maria Santos</h3>
                <p className="text-primary-600">Founder & CEO</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-56 bg-gray-200">
                <img
                  src="https://placehold.co/300x300/?text=portrait,professional,2"
                  alt="Team Member"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold">David Kim</h3>
                <p className="text-primary-600">CTO</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-56 bg-gray-200">
                <img
                  src="https://placehold.co/300x300/?text=portrait,professional,3"
                  alt="Team Member"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold">Sarah Johnson</h3>
                <p className="text-primary-600">Head of AI</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-56 bg-gray-200">
                <img
                  src="https://placehold.co/300x300/?text=portrait,professional,4"
                  alt="Team Member"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="text-lg font-semibold">Miguel Reyes</h3>
                <p className="text-primary-600">Lead Developer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to discover your next favorite restaurant?
          </h2>
          <p className="text-xl mb-8 text-primary-100 max-w-2xl mx-auto">
            Join thousands of diners using AI-powered insights to make better
            dining choices.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/register"
              className="btn bg-white text-primary-700 hover:bg-primary-50 px-8 py-3 rounded-lg font-medium"
            >
              Sign Up Now
            </Link>
            <Link
              to="/restaurants"
              className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary-700 px-8 py-3 rounded-lg font-medium"
            >
              Browse Restaurants
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
