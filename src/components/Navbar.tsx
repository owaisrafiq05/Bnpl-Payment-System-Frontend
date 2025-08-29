import { useState } from 'react';
import { Clock } from 'lucide-react';
import { FaPhone } from "react-icons/fa";
import { RiMailOpenLine } from "react-icons/ri";
import { FaRegComment } from "react-icons/fa";

const navItems: { label: string; href: string }[] = [
  { label: 'Home', href: 'https://ironclad.law/' },
  { label: 'About Us', href: 'https://ironclad.law/about-us/' },
  { label: 'Our Team', href: 'https://ironclad.law/our-team/' },
  { label: 'Practice Areas', href: '/#practice' },
  { label: 'Current Clients', href: '/#clients' },
  { label: 'Blog', href: 'https://ironclad.law/blog/' },
  { label: 'Reviews', href: 'https://www.lawyers.com/fort-myers/florida/ironclad-law-300050797-f/' },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="absolute top-0 z-50 w-full text-white">
      {/* Top contact strip */}
      <div className="hidden md:block bg-[#2A2A2A]/70">
        <div className="mx-auto w-full px-8">
          <div className="flex items-center justify-between text-base tracking-wide">
            <div className="flex items-center gap-2 py-2.5 font-sm text-xl text-[#CECECE]">
              <a href="tel:+19548335027" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                <FaPhone size={14} strokeWidth={1.5} className='text-[#b1976b]'/>
                <span>(954) 833-5027</span>
              </a>
              <span className="opacity-40 text-lg">·</span>
              <a href="mailto:info@ironclad.law" className="flex items-center gap-2 hover:text-amber-400 transition-colors">
                <RiMailOpenLine size={18} strokeWidth={0.1} className='text-[#b1976b]' />
                <span>info@ironclad.law</span>
              </a>
              <span className="opacity-40 text-lg">·</span>
              <div className="flex items-center gap-2">
                <Clock size={18} strokeWidth={1.5} className='text-[#b1976b]'/>
                <span>Mon - Fri 09:00AM-06:00PM</span>
              </div>
            </div>
            <a
              href="http://www.civil.ironclad.law/"
              className="rounded bg-[#B99671] px-6 py-4 font-semibold text-white hover:bg-[#B99671]/90 transition-colors flex flex-row items-center gap-2 text-sm"
            >
            <FaRegComment/>
              FREE CONSULTATION
            </a>
          </div>
        </div>
      </div>

      {/* Main nav bar */}
      <div className="bg-neutral-900/95 md:bg-transparent">
        <div className="mx-auto w-full px-4 md:px-8 lg:px-20">
          <div className="flex items-center justify-between h-[72px] md:h-auto md:py-0">
            {/* Logo */}
            <a href="/" className="flex items-center gap-3">
              <img src="./ironclad-law-logo.png" alt="" className='w-12 h-12 md:w-24 md:h-24' />
            </a>

            {/* Mobile menu button */}

            {/* Desktop menu */}
            <nav className="hidden lg:flex items-center gap-8 text-[#C1C1C1]">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-base font-semibold tracking-wide hover:text-amber-400 transition-colors"
                >
                  {item.label}
                </a>
              ))}

            </nav>
            {/* Mobile menu button */}
            <button
              className="lg:hidden inline-flex flex-col justify-center items-center gap-1.5 group p-2 ml-2"
              onClick={() => setIsMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span className={`h-0.5 w-6 bg-white transition-transform ${isMenuOpen ? 'translate-y-2 rotate-45' : ''}`}></span>
              <span className={`h-0.5 w-6 bg-white transition-opacity ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`h-0.5 w-6 bg-white transition-transform ${isMenuOpen ? '-translate-y-2 -rotate-45' : ''}`}></span>
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/10 bg-neutral-900/95 backdrop-blur-sm fixed inset-x-0 top-[72px] h-[calc(100vh-72px)] overflow-y-auto">
            <div className="mx-auto max-w-7xl px-4 py-6">
              <div className="grid gap-4">
                {navItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="py-3 text-lg font-semibold tracking-wide hover:text-amber-400 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                ))}
                <div className="grid gap-3 pt-4 border-t border-white/10">
                  <a href="tel:+19548335027" className="flex items-center gap-2 text-sm hover:text-amber-400 transition-colors">
                    <FaPhone size={16} />
                    <span>(954) 833-5027</span>
                  </a>
                  <a href="mailto:info@ironclad.law" className="flex items-center gap-2 text-sm hover:text-amber-400 transition-colors">
                    <RiMailOpenLine size={16} />
                    <span>info@ironclad.law</span>
                  </a>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock size={16} />
                    <span>Mon - Fri 09:00AM-06:00PM</span>
                  </div>
                </div>
                <a
                  href="#consultation"
                  className="mt-4 block rounded bg-[#B99671] px-4 py-3 text-white font-semibold text-center hover:bg-[#B99671]/90 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  FREE CONSULTATION
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;


