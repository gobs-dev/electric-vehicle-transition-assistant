import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const LandingPage = () => (
  <main className="flex flex-col min-h-screen">
    {/* Navigation */}
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">EV Transition Assistant</h1>
      </div>
    </nav>

    {/* Hero Section */}
    <section className="bg-blue-500 text-white text-center py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
          Transition to Electric Vehicles
        </h2>
        <p className="text-lg mb-6">
          Discover your pathway to a cleaner, greener future with personalized
          electric vehicle recommendations.
        </p>
        <Link href="/login">
          <Button className="mt-4">Get Started</Button>
        </Link>
      </div>
    </section>

    {/* Features Section */}
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-2">
              Personalized Recommendations
            </h3>
            <p>
              Get AI-driven suggestions tailored to your driving habits and
              preferences.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Cost Analysis</h3>
            <p>
              Calculate your potential savings and projections of ownership
              costs.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-2">Compare Models</h3>
            <p>
              Evaluate multiple electric vehicles side-by-side to find the best
              fit for you.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-gray-900 text-gray-400 py-4 text-center">
      <p>
        &copy; {new Date().getFullYear()} EV Transition Assistant. All rights
        reserved.
      </p>
    </footer>
  </main>
);

export default LandingPage;
