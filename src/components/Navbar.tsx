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

const practiceAreas: { label: string; href: string; hasSubmenu?: boolean }[] = [
  { label: 'Civil Litigation', href: '/#civil-litigation' },
  { label: 'Strategic Business Planning', href: '/#strategic-planning', hasSubmenu: true },
  { label: 'General Counsel', href: '/#general-counsel', hasSubmenu: true },
  { label: 'Corporate Counsel Service', href: '/#corporate-counsel' },
];

const strategicBusinessPlanning: { label: string; href: string }[] = [
  { label: 'Mergers & Acquisitions', href: '/#mergers-acquisitions' },
  { label: 'Transition & Breakaway Services', href: '/#transition-breakaway' },
  { label: 'Corporate & Business Formation', href: '/#corporate-formation' },
  { label: 'Succession Planning & Counsel', href: '/#succession-planning' },
];

const generalCounsel: { label: string; href: string }[] = [
  { label: 'Contract Review', href: '/#contract-review' },
  { label: 'Corporate Governance', href: '/#corporate-governance' },
  { label: 'Family Office Counsel', href: '/#family-office' },
  { label: 'Employment Law & Labor Services', href: '/#employment-law' },
  { label: 'Intellectual Property Law Services', href: '/#intellectual-property' },
  { label: 'Cryptocurrency & Digital Asset Counsel', href: '/#cryptocurrency' },
];

const currentClients: { label: string; href: string }[] = [
  { label: 'Speak With Your Attorney', href: '/#speak-attorney' },
  { label: 'Make a Payment', href: '/#make-payment' },
  { label: 'Client Portal', href: '/#client-portal' },
  { label: 'What to Expect', href: '/#what-to-expect' },
  { label: 'Dispute an Invoice', href: '/#dispute-invoice' },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPracticeDropdownOpen, setIsPracticeDropdownOpen] = useState(false);
  const [isStrategicDropdownOpen, setIsStrategicDropdownOpen] = useState(false);
  const [isGeneralCounselDropdownOpen, setIsGeneralCounselDropdownOpen] = useState(false);
  const [isCurrentClientsDropdownOpen, setIsCurrentClientsDropdownOpen] = useState(false);

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
                <div key={item.label} className="relative">
                  {item.label === 'Practice Areas' ? (
                    <div
                      className="relative group"
                      onMouseEnter={() => setIsPracticeDropdownOpen(true)}
                      onMouseLeave={() => {
                        setTimeout(() => {
                          if (!document.querySelector('.group:hover')) {
                            setIsPracticeDropdownOpen(false);
                            setIsStrategicDropdownOpen(false);
                            setIsGeneralCounselDropdownOpen(false);
                          }
                        }, 100);
                      }}
                    >
                      <a
                        href={item.href}
                        className="text-base font-semibold tracking-wide hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        {item.label}
                      </a>
                      {isPracticeDropdownOpen && (
                        <div 
                          className="absolute top-full left-0 mt-2 w-64 bg-[#1c1c1c] border border-neutral-700 rounded-md shadow-lg z-50 group"
                          onMouseEnter={() => setIsPracticeDropdownOpen(true)}
                          onMouseLeave={() => {
                            setTimeout(() => {
                              if (!document.querySelector('.group:hover')) {
                                setIsPracticeDropdownOpen(false);
                                setIsStrategicDropdownOpen(false);
                                setIsGeneralCounselDropdownOpen(false);
                              }
                            }, 100);
                          }}
                        >
                          <div className="py-2">
                            {practiceAreas.map((practice) => (
                              <div key={practice.label} className="relative">
                                {practice.hasSubmenu ? (
                                  <div
                                    className="block px-4 py-3 text-white hover:bg-neutral-700 transition-colors text-sm cursor-pointer"
                                    onMouseEnter={() => {
                                      if (practice.label === 'Strategic Business Planning') {
                                        setIsStrategicDropdownOpen(true);
                                      } else if (practice.label === 'General Counsel') {
                                        setIsGeneralCounselDropdownOpen(true);
                                      }
                                    }}
                                    onMouseLeave={() => {
                                      if (practice.label === 'Strategic Business Planning') {
                                        setIsStrategicDropdownOpen(false);
                                      } else if (practice.label === 'General Counsel') {
                                        setIsGeneralCounselDropdownOpen(false);
                                      }
                                    }}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span>{practice.label}</span>
                                      <span className="text-xs">›</span>
                                    </div>
                                                                         {practice.label === 'Strategic Business Planning' && isStrategicDropdownOpen && (
                                       <div 
                                         className="absolute left-full top-0 ml-1 w-64 bg-[#1c1c1c] border border-neutral-700 rounded-md shadow-lg strategic-submenu"
                                         onMouseEnter={() => setIsStrategicDropdownOpen(true)}
                                         onMouseLeave={() => {
                                           setTimeout(() => {
                                             if (!document.querySelector('.strategic-submenu:hover')) {
                                               setIsStrategicDropdownOpen(false);
                                             }
                                           }, 100);
                                         }}
                                       >
                                        <div className="py-2">
                                          {strategicBusinessPlanning.map((subItem) => (
                                            <a
                                              key={subItem.label}
                                              href={subItem.href}
                                              className="block px-4 py-3 text-white hover:bg-neutral-700 transition-colors text-sm"
                                            >
                                              {subItem.label}
                                            </a>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                                                         {practice.label === 'General Counsel' && isGeneralCounselDropdownOpen && (
                                       <div 
                                         className="absolute left-full top-0 ml-1 w-64 bg-[#1c1c1c] border border-neutral-700 rounded-md shadow-lg submenu"
                                         onMouseEnter={() => setIsGeneralCounselDropdownOpen(true)}
                                         onMouseLeave={() => {
                                           setTimeout(() => {
                                             if (!document.querySelector('.submenu:hover')) {
                                               setIsGeneralCounselDropdownOpen(false);
                                             }
                                           }, 100);
                                         }}
                                       >
                                        <div className="py-2">
                                          {generalCounsel.map((subItem) => (
                                            <a
                                              key={subItem.label}
                                              href={subItem.href}
                                              className="block px-4 py-3 text-white hover:bg-neutral-700 transition-colors text-sm"
                                            >
                                              {subItem.label}
                                            </a>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <a
                                    href={practice.href}
                                    className="block px-4 py-3 text-white hover:bg-neutral-700 transition-colors text-sm"
                                  >
                                    {practice.label}
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : item.label === 'Current Clients' ? (
                    <div
                      className="relative group"
                      onMouseEnter={() => setIsCurrentClientsDropdownOpen(true)}
                      onMouseLeave={() => {
                        setTimeout(() => {
                          if (!document.querySelector('.group:hover')) {
                            setIsCurrentClientsDropdownOpen(false);
                          }
                        }, 100);
                      }}
                    >
                      <a
                        href={item.href}
                        className="text-base font-semibold tracking-wide hover:text-amber-400 transition-colors cursor-pointer"
                      >
                        {item.label}
                      </a>
                      {isCurrentClientsDropdownOpen && (
                        <div 
                          className="absolute top-full left-0 mt-2 w-64 bg-[#1c1c1c] border border-neutral-700 rounded-md shadow-lg z-50 group"
                          onMouseEnter={() => setIsCurrentClientsDropdownOpen(true)}
                          onMouseLeave={() => {
                            setTimeout(() => {
                              if (!document.querySelector('.group:hover')) {
                                setIsCurrentClientsDropdownOpen(false);
                              }
                            }, 100);
                          }}
                        >
                          <div className="py-2">
                            {currentClients.map((clientItem) => (
                              <a
                                key={clientItem.label}
                                href={clientItem.href}
                                className="block px-4 py-3 text-white hover:bg-neutral-700 transition-colors text-sm"
                              >
                                {clientItem.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                  href={item.href}
                  className="text-base font-semibold tracking-wide hover:text-amber-400 transition-colors"
                >
                  {item.label}
                </a>
                  )}
                </div>
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


