import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Services", href: "/services" },
  { label: "Firm", href: "/firm" },
];

const isoBadges = [
  "http://localhost/riyansite/wp-content/uploads/2021/05/ISO-CERTIFIED-LOGO1.png",
  "http://localhost/riyansite/wp-content/uploads/2021/05/ISO-CERTIFIED-LOGO1.png",
];

const Footer = () => {
  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 py-12 grid md:grid-cols-3 gap-10 items-start">
        <div className="space-y-4">
          <div className="relative h-12 w-40">
            <Image
              src="http://beta.riyan.com.mv/wp-content/uploads/2021/06/lg60wn.png"
              alt="Riyan"
              fill
              className="object-contain"
              priority
            />
          </div>
          <p className="text-sm text-white/80 leading-relaxed max-w-sm">
            Integrated solutions in design, engineering, project management, and research tailored
            for the Maldives and beyond.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            {isoBadges.map((src, idx) => (
              <div key={`intro-${idx}`} className="h-12 w-12">
                <img
                  src={src}
                  alt="Certification badge"
                  className="h-full w-full object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-primary transition-colors">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-sm space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h4 className="text-lg font-semibold mb-3">Company</h4>
              <p className="text-white/80">Male, Maldives</p>
            </div>
            <div className="flex flex-wrap gap-3">
              {isoBadges.map((src, idx) => (
                <div key={`aside-${idx}`} className="h-12 w-12">
                  <img
                    src={src}
                    alt="Certification badge"
                    className="h-full w-full object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
          {/* TODO: Add social links if needed */}
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/70">
        &copy; {new Date().getFullYear()} Riyan Pvt Ltd. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;



