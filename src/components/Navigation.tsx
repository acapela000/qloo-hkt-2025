import React, { useState } from "react";

interface NavigationProps {
  currentPage?: string;
  onPageChange?: (page: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({
  currentPage,
  onPageChange,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* FIXED: Logo with Van Gogh gradient Q */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 via-orange-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">Q</span>
            </div>
            <span className="text-xl font-bold text-gray-900">loo</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <button
              onClick={() => onPageChange?.("home")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === "home"
                  ? "bg-gradient-to-r from-yellow-400 via-orange-400 to-blue-500 text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onPageChange?.("discover")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                currentPage === "discover"
                  ? "bg-gradient-to-r from-yellow-400 via-orange-400 to-blue-500 text-white"
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              Discover
            </button>
          </div>

          {/* FIXED: Mobile Burger Menu with Van Gogh gradient */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gradient-to-r from-yellow-400 via-orange-400 to-blue-500 text-white hover:from-yellow-500 hover:via-orange-500 hover:to-blue-600 transition-all duration-200 shadow-lg"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* FIXED: Mobile Menu - Keep Normal Background */}
      {isMenuOpen && (
        <>
          {/* Backdrop - Semi-transparent, not black */}
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* FIXED: Menu Panel - Normal white background */}
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
                  aria-label="Close menu"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Navigation Items */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onPageChange?.("home");
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    currentPage === "home"
                      ? "bg-gradient-to-r from-yellow-400 via-orange-400 to-blue-500 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>🏠</span>
                  <span>Home</span>
                </button>

                <button
                  onClick={() => {
                    onPageChange?.("discover");
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    currentPage === "discover"
                      ? "bg-gradient-to-r from-yellow-400 via-orange-400 to-blue-500 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>🔍</span>
                  <span>Discover</span>
                </button>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  <span>📍</span>
                  <span>My Trips</span>
                </button>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  <span>❤️</span>
                  <span>Favorites</span>
                </button>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-full flex items-center space-x-3 p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  <span>👤</span>
                  <span>Profile</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navigation;
