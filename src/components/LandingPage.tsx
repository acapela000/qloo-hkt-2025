import React from "react";
import { MapPin, Compass, Star, ArrowRight, Palette } from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #fef7cd 0%, #dbeafe 50%, #fef3c7 100%)",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
      }}
    >
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Van Gogh inspired background pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(2px 2px at 20px 30px, #fde047, transparent),
              radial-gradient(2px 2px at 40px 70px, #3b82f6, transparent),
              radial-gradient(1px 1px at 90px 40px, #fde047, transparent),
              radial-gradient(1px 1px at 130px 80px, #3b82f6, transparent)
            `,
            backgroundRepeat: "repeat",
            backgroundSize: "200px 100px",
          }}
        ></div>

        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Van Gogh inspired header */}
            <div className="mb-8">
              <Palette
                className="w-16 h-16 mx-auto mb-4 animate-float"
                style={{ color: "#eab308" }}
              />
              <h1
                className="text-5xl md:text-7xl font-bold mb-6"
                style={{
                  fontFamily: "Playfair Display, ui-serif, Georgia, serif",
                }}
              >
                <span
                  className="van-gogh-text"
                  style={{
                    background:
                      "linear-gradient(135deg, #fde047 0%, #f59e0b 50%, #a16207 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                  }}
                >
                  Travel Like an
                </span>
                <br />
                <span style={{ color: "#1e40af" }}>Artist</span>
              </h1>
            </div>

            <p
              className="text-xl md:text-2xl mb-12 leading-relaxed"
              style={{ color: "#57534e" }}
            >
              Paint your perfect journey with AI-powered recommendations
              <br className="hidden md:block" />
              inspired by the places that moved the masters
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button
                onClick={onGetStarted}
                className="btn-primary group"
                style={{
                  background:
                    "linear-gradient(135deg, #fde047 0%, #3b82f6 100%)",
                  color: "white",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  fontWeight: "600",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Start Your Masterpiece
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>

              <button
                className="btn-secondary"
                style={{
                  border: "2px solid #fde047",
                  color: "#a16207",
                  background: "transparent",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "0.5rem",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
              >
                View Gallery
              </button>
            </div>

            {/* Stats in Van Gogh style */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: MapPin, number: "500+", label: "Destinations" },
                { icon: Compass, number: "10K+", label: "Experiences" },
                { icon: Star, number: "4.9", label: "Rating" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="text-center group hover:scale-105 transition-transform duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(254, 247, 205, 0.9) 100%)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(234, 179, 8, 0.2)",
                    padding: "1.5rem",
                    borderRadius: "0.75rem",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <stat.icon
                    className="w-8 h-8 mx-auto mb-3"
                    style={{ color: "#eab308" }}
                  />
                  <div
                    className="text-3xl font-bold mb-1"
                    style={{ color: "#1e40af" }}
                  >
                    {stat.number}
                  </div>
                  <div style={{ color: "#57534e" }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20"
        style={{
          background:
            "linear-gradient(135deg, rgba(254, 247, 205, 0.3) 0%, rgba(219, 234, 254, 0.3) 100%)",
        }}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2
              className="text-4xl font-bold mb-4"
              style={{
                fontFamily: "Playfair Display, ui-serif, Georgia, serif",
                color: "#1e3a8a",
              }}
            >
              Brush Strokes of{" "}
              <span
                style={{
                  background:
                    "linear-gradient(135deg, #fde047 0%, #f59e0b 50%, #a16207 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Innovation
              </span>
            </h2>
            <p
              className="text-xl max-w-2xl mx-auto"
              style={{ color: "#57534e" }}
            >
              Every great painting starts with inspiration. Let us help you find
              yours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "🎨",
                title: "AI-Powered Curation",
                description:
                  "Like a master painter selecting colors, our AI curates experiences that match your unique style.",
              },
              {
                icon: "🌟",
                title: "Personalized Palettes",
                description:
                  "Your preferences blend into a perfect composition of destinations and experiences.",
              },
              {
                icon: "🗺️",
                title: "Masterpiece Itineraries",
                description:
                  "Transform scattered ideas into coherent journeys, like brushstrokes forming a masterpiece.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group hover:scale-105 transition-transform duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(254, 247, 205, 0.9) 100%)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid rgba(234, 179, 8, 0.2)",
                  padding: "1.5rem",
                  borderRadius: "0.75rem",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-6"
                  style={{
                    background: `linear-gradient(135deg, #eab308 0%, #3b82f6 100%)`,
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ color: "#1e3a8a" }}
                >
                  {feature.title}
                </h3>
                <p className="leading-relaxed" style={{ color: "#57534e" }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20 text-white relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #3b82f6 0%, #1e40af 50%, #1e293b 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              rgba(254, 247, 205, 0.3) 0px,
              rgba(254, 247, 205, 0.3) 10px,
              transparent 10px,
              transparent 20px
            )`,
          }}
        ></div>
        <div className="relative container mx-auto px-6 text-center">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "Playfair Display, ui-serif, Georgia, serif" }}
          >
            Ready to Paint Your Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of travelers who have discovered their perfect
            destinations through our artistic approach to travel planning.
          </p>
          <button
            onClick={onGetStarted}
            style={{
              background: "white",
              color: "#1e40af",
              padding: "1rem 2rem",
              borderRadius: "0.5rem",
              fontWeight: "600",
              fontSize: "1.125rem",
              transition: "all 0.3s ease",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              border: "none",
              cursor: "pointer",
            }}
          >
            Create Your Masterpiece
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
