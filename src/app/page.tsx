import Image from "next/image";
import Link from "next/link";
import React from "react";
import Hero from "../components/hero";
import AboutSection from "../components/sections/aboutSection";
export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <div className="ml-[10%] mr-[10%]">
        <AboutSection />

        {/* About Section */}
        

        {/* Contact Section */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Contact Us
              </h2>
              <div className="grid md:grid-cols-3 gap-8 mt-12">
                <div>
                  <h6 className="text-sm uppercase tracking-wider text-primary font-semibold mb-3">
                    Email us directly
                  </h6>
                  <h4 className="text-2xl font-semibold text-gray-900">
                    <a
                      href="mailto:info@riyan.com.mv"
                      className="hover:text-primary transition-colors"
                    >
                      info@riyan.com.mv
                    </a>
                  </h4>
                </div>
                <div>
                  <h6 className="text-sm uppercase tracking-wider text-primary font-semibold mb-3">
                    Call us directly
                  </h6>
                  <h4 className="text-2xl font-semibold text-gray-900">
                    <a
                      href="tel:+9603315049"
                      className="hover:text-primary transition-colors"
                    >
                      +960 331 5049
                    </a>
                  </h4>
                </div>
                <div>
                  <h6 className="text-sm uppercase tracking-wider text-primary font-semibold mb-3">
                    On Social Media
                  </h6>
                  <div className="flex justify-center space-x-4">
                    {/* Social media links placeholder */}
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      F
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      T
                    </a>
                    <a
                      href="#"
                      className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                      L
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
