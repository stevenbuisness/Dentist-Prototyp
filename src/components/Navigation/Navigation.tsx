import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

export const Navigation = (): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, target: string) => {
    // If we're not on the landing page, we need to go there first
    // Using window.location.href handles the cross-page anchor jump most reliably
    if (location.pathname !== "/") {
      e.preventDefault();
      window.location.href = "/" + target;
    }
    // If we are on /, the default <a> behavior will handle the scroll/jump
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-[1840px] mx-auto px-4 sm:px-8 py-4 sm:py-6 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-12">
          <Link
            to="/"
            className="flex items-center gap-2 [font-family:'Kollektif-Bold',Helvetica] font-bold text-stone-900 text-lg sm:text-2xl tracking-[-0.5px] hover:opacity-80 transition-opacity"
          >
            <img 
              src="/logo.png" 
              alt="Dr. Schmidt Logo" 
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            />
            <span className="hidden sm:inline whitespace-nowrap">Zahnarztpraxis</span> Dr. Schmidt
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <a
              href="#leistungen"
              onClick={(e) => handleNavClick(e, "#leistungen")}
              className="[font-family:'Kollektif-Regular',Helvetica] font-normal text-[#282828] text-base tracking-[0.5px] hover:text-blue-600 transition-colors"
            >
              Leistungen
            </a>
            <a
              href="#team"
              onClick={(e) => handleNavClick(e, "#team")}
              className="[font-family:'Kollektif-Regular',Helvetica] font-normal text-[#282828] text-base tracking-[0.5px] hover:text-blue-600 transition-colors"
            >
              Unser Team
            </a>
            <a
              href="#standards"
              onClick={(e) => handleNavClick(e, "#standards")}
              className="[font-family:'Kollektif-Regular',Helvetica] font-normal text-[#282828] text-base tracking-[0.5px] hover:text-blue-600 transition-colors"
            >
              Qualität
            </a>
            <a
              href="#kontakt"
              onClick={(e) => handleNavClick(e, "#kontakt")}
              className="[font-family:'Kollektif-Regular',Helvetica] font-normal text-[#282828] text-base tracking-[0.5px] hover:text-blue-600 transition-colors"
            >
              Kontakt
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="tel:02111593482"
            className="hidden md:flex items-center gap-2 [font-family:'Kollektif-Regular',Helvetica] font-normal text-[#282828] text-base tracking-[0.5px] hover:text-blue-600 transition-colors"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            0211 1593 482
          </a>

          <button className="px-2 py-1.5 sm:px-6 sm:py-3 bg-blue-600 text-white [font-family:'Kollektif-Bold',Helvetica] font-bold text-[9px] sm:text-xs tracking-normal sm:tracking-[0.70px] hover:bg-blue-700 transition-colors rounded whitespace-nowrap">
            TERMIN BUCHEN
          </button>

          <button
            className="lg:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 12h18M3 6h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-200 px-8 py-4">
          <div className="flex flex-col gap-4">
            <a
              href="#leistungen"
              onClick={(e) => { handleNavClick(e, "#leistungen"); setIsMenuOpen(false); }}
              className="[font-family:'Kollektif-Regular',Helvetica] font-normal text-[#282828] text-base tracking-[0.5px] hover:text-blue-600 transition-colors py-2"
            >
              Leistungen
            </a>
            <a
              href="#team"
              onClick={(e) => { handleNavClick(e, "#team"); setIsMenuOpen(false); }}
              className="[font-family:'Kollektif-Regular',Helvetica] font-normal text-[#282828] text-base tracking-[0.5px] hover:text-blue-600 transition-colors py-2"
            >
              Unser Team
            </a>
            <a
              href="#standards"
              onClick={(e) => { handleNavClick(e, "#standards"); setIsMenuOpen(false); }}
              className="[font-family:'Kollektif-Regular',Helvetica] font-normal text-[#282828] text-base tracking-[0.5px] hover:text-blue-600 transition-colors py-2"
            >
              Qualität
            </a>
            <a
              href="#kontakt"
              onClick={(e) => { handleNavClick(e, "#kontakt"); setIsMenuOpen(false); }}
              className="[font-family:'Kollektif-Regular',Helvetica] font-normal text-[#282828] text-base tracking-[0.5px] hover:text-blue-600 transition-colors py-2"
            >
              Kontakt
            </a>
            <a
              href="tel:02111593482"
              className="flex items-center gap-2 [font-family:'Kollektif-Regular',Helvetica] font-normal text-[#282828] text-base tracking-[0.5px] hover:text-blue-600 transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              0211 1593 482
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};
