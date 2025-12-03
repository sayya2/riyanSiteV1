"use client";
import { ChevronRightCircle,Facebook,Instagram,Twitter } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";


interface MenuItem {
  id: number;
  title: string;
  url: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  { id: 1, title: "Home", url: "/" },
  { id: 2, title: "Projects", url: "/projects" },
  { id: 3, title: "Services", url: "/services" },
  { id: 4, title: "Firm", url: "/firm" },
];

export default function Navbar() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 100);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const borderColor = isSticky ? "border-gray-200" : "border-white/30";
  const textColor = isSticky ? "text-gray-900" : "text-white";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b ${borderColor} transition-all duration-300 ${
        isSticky ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex ">
            <Link href="/" className="flex items-center">
              <div className="relative w-36 h-12">
                <Image
                  src={
                    isSticky
                      ? "http://beta.riyan.com.mv/wp-content/uploads/2021/06/lg60n.png"
                      : "http://beta.riyan.com.mv/wp-content/uploads/2021/06/lg60wn.png"
                  }
                  alt="Riyan"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className={`text-sm font-medium transition-colors ${
                  isSticky
                    ? "text-gray-900 hover:text-primary"
                    : "text-white hover:text-white/80"
                }`}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          {/* Contact Panel Toggle */}
          <button
            onClick={() => setIsPanelOpen(true)}
            className="flex flex-col items-center justify-center w-11 h-11 space-y-1.5 rounded-full border border-transparent hover:border-white/40 hover:bg-white/10 transition-colors"
            aria-label="Open contact panel"
            aria-expanded={isPanelOpen}
          >
            <span
              className={`block w-6 h-0.5 transition-all ${
                isSticky ? "bg-gray-900" : "bg-white"
              }`}
            />
            <span
              className={`block w-6 h-0.5 transition-all ${
                isSticky ? "bg-gray-900" : "bg-white"
              }`}
            />
            <span
              className={`block w-6 h-0.5 transition-all ${
                isSticky ? "bg-gray-900" : "bg-white"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Contact Slide Panel */}
      <div
        className={`fixed inset-0 z-50 transition duration-300 ease-in-out ${
          isPanelOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!isPanelOpen}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
            isPanelOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsPanelOpen(false)}
        />
        <aside
          className={`absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ${
            isPanelOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-start justify-between px-6 py-10 border-b border-gray-200">
            <div>
              <p className="text-3xl uppercase tracking-[0.35em] text-primary mb-8">
                Contact Us
              </p>
              <p className="text-md font-semibold text-gray-900">
                Great things in business are never done by one.
              </p>
            </div>
            <button
              onClick={() => setIsPanelOpen(false)}
              aria-label="Close contact panel"
              className="p-2 rounded-full text-gray-500 hover:text-primary hover:bg-gray-100 transition"
            >
              ×
            </button>
          </div>

          <div className="relative h-full overflow-y-auto">
            <div className="px-6 py-6 space-y-6 max-w-xl">
              <p className="text-gray-700 leading-relaxed">
                Reach out to us, let&apos;s discuss about how we can help you.
              </p>

              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Need Help?
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Email us directly
                  </p>
                  <a
                    href="mailto:info@riyan.com.mv"
                    className="text-lg font-semibold text-primary hover:underline"
                  >
                    info@riyan.com.mv
                  </a>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Call us directly
                  </p>
                  <a
                    href="tel:+9603315049"
                    className="text-lg font-semibold text-primary hover:underline"
                  >
                    +960 331 5049
                  </a>
                </div>
                <div >
                  <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">
                    On Social Media
                  </p>
                  <div className="flex gap-6 flex-wrap">
                    <a
                      href="#"
                      className="text-gray-700 hover:text-primary font-medium"
                    >
                       <Facebook />
                      
                    </a>
                    <a
                      href="#"
                      className="text-gray-700 hover:text-primary font-medium"
                    >
                     
                     <Twitter/>
                    </a>
                    <a
                      href="#"
                      className="text-gray-700 hover:text-primary font-medium"
                    >
                       <Instagram />
                    </a>
                  </div>
                </div>
              </div>

              {/* <div className="pt-4 border-t border-gray-200 space-y-2">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Navigation
                </p>
                <div className="flex flex-col gap-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.id}
                      href={item.url}
                      className="text-gray-900 hover:text-primary font-medium"
                      onClick={() => setIsPanelOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div> */}
              <button className=" right-4 top-20 text-xs tracking-[0.25em] uppercase text-gray-300 h-16 w-60 bg-primary flex items-center justify-center hover:bg-primary-dark transition-colors rounded-md shadow-md">
                Get in Touch 
                 <ChevronRightCircle className="ml-3 h-7 w-7 animate-wiggle-right" />

              </button>
            </div>
          </div>
        </aside>
      </div>
    </header>
  );
}
