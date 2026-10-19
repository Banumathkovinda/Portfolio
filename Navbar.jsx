import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { SunDim, Moon, Menu, X } from "lucide-react";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ IMPORTANT: ids must match your section ids EXACTLY (case-sensitive)
  const navItems = [
    { id: "home", title: "Home" },
    { id: "about", title: "About" },
    { id: "projects", title: "Projects" },
    { id: "certifications", title: "Certifications" },
    { id: "contact", title: "Contact" },
  ];

  // ✅ smooth scroll (Tailwind way is adding scroll-smooth on html, but this works too)
  const scrollToId = (id) => {
    const el = document.getElementById(id);
    if (!el) return;

    // offset for fixed navbar
    const yOffset = -110;
    const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: "smooth" });
  };

  // Detect active section on scroll
  useEffect(() => {
    const onScroll = () => {
      let current = "home";

      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (!el) continue;

        const rect = el.getBoundingClientRect();
        if (rect.top <= 140 && rect.bottom >= 140) {
          current = item.id;
          break;
        }
      }
      setActiveSection(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = (id) => {
    setActiveSection(id);
    setIsMenuOpen(false);
    scrollToId(id); // ✅ use smooth scroll with offset
  };

  const navBg = darkMode
    ? "bg-[#18181b]/90 border-white/10"
    : "bg-white/80 border-gray-200";

  const linkBase = darkMode ? "text-gray-200" : "text-gray-700";
  const linkHover = darkMode ? "hover:text-white" : "hover:text-gray-900";
  const linkActive = darkMode ? "text-white" : "text-gray-900";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
        <motion.nav
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className={`relative flex items-center justify-between
            px-4 sm:px-6 py-3
            rounded-full overflow-hidden
            backdrop-blur-xl border ${navBg}
            shadow-md`}
        >
          {/* Logo */}
          <button
            type="button"
            onClick={() => handleClick("home")}
            className="flex items-center gap-1 cursor-pointer outline-none"
          >
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
              <span className="text-[#0052cc]">B</span>
              <span className={darkMode ? "text-white" : "text-gray-900"}>K</span>
              <span className="text-[#0052cc]">.</span>
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => handleClick(item.id)}
                  className="relative px-2 py-1 cursor-pointer outline-none"
                >
                  <span
                    className={`font-medium transition-colors duration-200 ${
                      isActive ? linkActive : `${linkBase} ${linkHover}`
                    }`}
                  >
                    {item.title}
                  </span>

                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className={`absolute -bottom-2 left-0 right-0 mx-auto h-1 w-8 rounded-full ${
                        darkMode
                          ? "bg-[#00d4ff] shadow-[0_0_12px_rgba(0,212,255,0.75)]"
                          : "bg-[#0066cc] shadow-[0_0_10px_rgba(0,102,204,0.45)]"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Dark Mode */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className={`p-2 rounded-full border transition cursor-pointer outline-none ${
                darkMode
                  ? "bg-white/5 border-white/10 hover:bg-white/10"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <SunDim className="w-5 h-5 text-blue-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700" />
              )}
            </button>

            {/* Desktop CTA */}
            <button
              type="button"
              onClick={() => handleClick("contact")}
              className="hidden lg:inline-flex items-center justify-center
              px-5 py-2 rounded-full font-semibold
              text-white bg-gradient-to-r from-[#0066cc] to-[#0052a3] hover:from-[#0077ee] hover:to-[#005ec4] transition
              shadow-[0_4px_14px_rgba(0,102,204,0.4)] hover:shadow-[0_6px_20px_rgba(0,192,255,0.55)]
              hover:-translate-y-0.5 active:translate-y-0 cursor-pointer outline-none"
            >
              Hire Me
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className={`lg:hidden p-2 rounded-full border transition cursor-pointer outline-none ${
                darkMode
                  ? "bg-white/5 border-white/10 hover:bg-white/10"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <X className={darkMode ? "text-white" : "text-gray-900"} />
              ) : (
                <Menu className={darkMode ? "text-white" : "text-gray-900"} />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`lg:hidden absolute left-0 right-0 top-full mt-3
                  rounded-2xl border shadow-xl overflow-hidden
                  ${
                    darkMode
                      ? "bg-[#111]/95 border-white/10 backdrop-blur-xl"
                      : "bg-white border-gray-200"
                  }`}
              >
                <div className="p-3 flex flex-col">
                  {navItems.map((item) => (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => handleClick(item.id)}
                      className={`text-left px-4 py-3 rounded-xl font-medium transition cursor-pointer outline-none ${
                        activeSection === item.id
                          ? darkMode
                            ? "bg-white/10 text-white font-semibold"
                            : "bg-gray-100 text-gray-900 font-semibold"
                          : darkMode
                            ? "text-gray-200 hover:bg-white/5"
                            : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {item.title}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => handleClick("contact")}
                    className="mt-2 px-4 py-3 rounded-xl font-semibold text-center
                    text-white bg-gradient-to-r from-[#0066cc] to-[#0052a3] hover:from-[#0077ee] hover:to-[#005ec4] transition cursor-pointer outline-none
                    shadow-[0_4px_14px_rgba(0,102,204,0.4)]"
                  >
                    Hire Me
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>
    </header>
  );
};

export default Navbar;
