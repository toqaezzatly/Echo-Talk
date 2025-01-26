import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import FeatureCard from "../components/FeatureCard";
import ThemePreview from "../components/ThemePreview";
import { useAuthStore } from "../store/useAuthStore";
import { useThemeStore } from "../store/useThemeStore";

const LandingPage = () => {
  const { authUser: user } = useAuthStore();
  const { theme } = useThemeStore();

  const themeGradients = {
    light: "bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20",
    dark: "bg-gradient-to-br from-neutral-800 via-neutral-700 to-neutral-900",
    cupcake: "bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20",
    bumblebee: "bg-gradient-to-br from-warning/20 via-neutral-100 to-warning/10",
    emerald: "bg-gradient-to-br from-success/20 via-accent/20 to-success/10",
    corporate: "bg-gradient-to-br from-neutral-100 via-primary/10 to-neutral-100",
    synthwave: "bg-gradient-to-br from-primary/60 via-accent/60 to-secondary/60",
    halloween: "bg-gradient-to-br from-warning/30 via-error/30 to-neutral-800",
    valentine: "bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30",
  };

  return (
    <div className={`min-h-screen font-poppins ${themeGradients[theme] || themeGradients.light}`}>
      <Navbar />

      <main className="max-w-6xl mx-auto py-12 px-6">
        {/* Hero Section */}
        <section className="text-center py-16 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-base-content">
              Connect Meaningfully
            </h1>
            <p className="text-xl text-base-content/80">
              Secure, intuitive messaging for everyone
            </p>
          </div>

                        <div className="relative inline-block">
                <img
                    className="mx-auto h-64 object-contain opacity-90 hover:opacity-100 transition-opacity rounded-lg"
                    src="https://c.tenor.com/jyGwTwdZGegAAAAd/slack.gif"
                    alt="Chat illustration"
                    border="50%"
                />
                </div>

          <div className="flex justify-center gap-4">
            {!user ? (
              <>
                <Link
                  to="/signup"
                  className="btn btn-primary text-lg px-8 py-3 shadow-lg hover:scale-105 transition-transform"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="btn btn-secondary text-lg px-8 py-3 shadow-lg hover:scale-105 transition-transform"
                >
                  Login
                </Link>
              </>
            ) : (
              <Link
                to="/chat"
                className="btn btn-accent text-lg px-8 py-3 shadow-lg hover:scale-105 transition-transform"
              >
                Go to Chat
              </Link>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-base-content">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Instant Messaging"
              description="Real-time conversations with friends and family"
              icon="⏱️"
              color="bg-primary/10"
            />
            <FeatureCard
              title="Bank-grade Security"
              description="End-to-end encrypted communications"
              icon="🔐"
              color="bg-secondary/10"
            />
            <FeatureCard
              title="Custom Profiles"
              description="Express yourself with personalized details"
              icon="🖌️"
              color="bg-accent/10"
            />
          </div>
        </section>

        {/* Theme Preview */}
        <section className="py-16">
          <div className="bg-base-100 rounded-xl p-8 shadow-xl">
            <h2 className="text-3xl font-bold text-center mb-8 text-base-content">
              Personalize Your Experience
            </h2>
            <ThemePreview />
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16">
          <div className="bg-base-200 rounded-xl p-8 text-center">
            <p className="text-xl text-base-content/80 italic">
              "The perfect balance of simplicity and functionality."
            </p>
            <p className="mt-4 text-base-content/60">
              - Satisfied User
            </p>
          </div>
        </section>

        {/* Final CTA */}
        {!user && (
          <section className="text-center py-16 space-y-6">
            <h2 className="text-3xl font-bold text-base-content">
              Ready to Connect?
            </h2>
            <div className="flex justify-center gap-4">
              <Link
                to="/signup"
                className="btn btn-primary text-lg px-8 py-3 shadow-lg hover:scale-105 transition-transform"
              >
                Join Now
              </Link>
              <Link
                to="/login"
                className="btn btn-secondary text-lg px-8 py-3 shadow-lg hover:scale-105 transition-transform"
              >
                Existing User? Login
              </Link>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-base-300 text-base-content py-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-lg">
            © {new Date().getFullYear()} ConnectApp
          </p>
          <div className="mt-2 flex justify-center gap-4">
            <Link to="/terms" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;