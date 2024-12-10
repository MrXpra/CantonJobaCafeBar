import React from "react";
import { User, Menu } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">Savoria</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            {["Home", "Menu", "Reservations", "Events", "Blog", "Contact"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  {item}
                </a>
              )
            )}
          </nav>
          <div className="hidden md:flex">
            <div className="group flex items-center">
              <User className="group-hover:text-orange-700 cursor-pointer" />
              <a href="/login" className=" px-1 py-2 mr-4 rounded-full font-medium group-hover:text-orange-700 cursor-pointer">
                Ingresar
              </a>
            </div>
            <button className="bg-orange-600 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-700 transition-colors">
              Reservar
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {["Home", "Menu", "Reservations", "Events", "Blog", "Contact"].map(
              (item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                >
                  {item}
                </a>
              )
            )}
            <div className="group flex items-center">
              <User className="group-hover:text-orange-700 cursor-pointer" />
              <a href="/login" className=" px-1 py-2 mr-4 rounded-full font-medium group-hover:text-orange-700 cursor-pointer">
                Ingresar
              </a>
            </div>
            <button className="w-full bg-orange-600 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-700 transition-colors mt-4">
              Reserve Now
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
