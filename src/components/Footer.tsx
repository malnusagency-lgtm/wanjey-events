'use client';
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Mail, Phone, MapPin } from "lucide-react";

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className}>
    <defs>
      <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#feda75" />
        <stop offset="25%" stopColor="#fa7e1e" />
        <stop offset="50%" stopColor="#d62976" />
        <stop offset="75%" stopColor="#962fbf" />
        <stop offset="100%" stopColor="#4f5bd5" />
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-grad)" strokeWidth="2" />
    <circle cx="12" cy="12" r="5" stroke="url(#ig-grad)" strokeWidth="2" />
    <circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig-grad)" />
  </svg>
);

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.73a8.19 8.19 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.16z" fill="#fff" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M24 12c0-6.627-5.373-12-12-12S0 5.373 0 12c0 5.99 4.388 10.954 10.125 11.854V15.47H7.078V12h3.047V9.356c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.875V12h3.328l-.532 3.469h-2.796v8.385C19.612 22.954 24 17.99 24 12z" fill="#1877F2" />
  </svg>
);

const socialLinks = [
  { icon: InstagramIcon, href: "https://www.instagram.com/wanjey_events.marketing?igsh=MTNjZGN2MTc1ZjVuOQ==", label: "Instagram" },
  { icon: TikTokIcon, href: "https://www.tiktok.com/@wanjey_events?_r=1&_t=ZS-94O6gd06jWn", label: "TikTok" },
  { icon: FacebookIcon, href: "https://www.facebook.com/", label: "Facebook" },
];

const Footer = () => {
  const pathname = usePathname();
  
  // Strict alternation mapping for 6 pages
  const bgImage = 
    pathname === '/' || pathname === '/packages'
      ? '/assets/footer.jpg'
      : pathname === '/about' || pathname === '/gallery'
      ? '/assets/footer1.jpg'
      : pathname === '/services' || pathname === '/contact'
      ? '/assets/footer2.jpg'
      : '/assets/footer.jpg'; // Default

  return (
    <footer className="relative border-t border-border bg-white/20 text-foreground overflow-hidden">
      {/* Background Image Overlay - Strict alternation */}
      <div className="absolute inset-0 z-0">
        <Image 
          src={bgImage} 
          alt="Elegant event background" 
          fill 
          className="object-cover opacity-25 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-[#FFF5F0]/90" />
      </div>

      <div className="container relative z-10 py-20 md:py-24">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-serif text-xl font-bold">
              Wanjey Events<span className="text-accent">.</span>
            </h3>
            <p className="mt-5 max-w-xs text-sm leading-[1.7] text-foreground/70">
              Strategic events management and brand marketing that elevate your business in Kenya and beyond.
            </p>
            <div className="mt-8 flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 transition-all duration-300 hover:bg-accent/20 hover:scale-105"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent">Quick Links</h4>
            <nav className="mt-6 flex flex-col gap-3">
              {["About", "Services", "Packages", "Gallery", "Contact"].map((label) => (
                <Link
                  key={label}
                  href={`/${label.toLowerCase()}`}
                  className="text-sm text-foreground/70 transition-colors duration-300 hover:text-accent"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent">Services</h4>
            <ul className="mt-6 flex flex-col gap-3">
              {["Corporate Events", "Brand Activations", "Digital Marketing", "Event Amplification"].map((s) => (
                <li key={s} className="text-sm text-foreground/70">{s}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[11px] font-medium uppercase tracking-[0.2em] text-accent">Contact</h4>
            <ul className="mt-6 flex flex-col gap-4">
              <li className="flex items-center gap-3 text-sm text-foreground/70">
                <MapPin className="h-4 w-4 shrink-0 text-accent" /> Nairobi, Kenya
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground/70">
                <Phone className="h-4 w-4 shrink-0 text-accent" /> +254 790 381039
              </li>
              <li className="flex items-center gap-3 text-sm text-foreground/70">
                <Mail className="h-4 w-4 shrink-0 text-accent" /> hello@misswanjey.co.ke
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 h-px w-full bg-foreground/10" />
        <div className="pt-8 text-center">
          <p className="text-xs text-foreground/40">
            © {new Date().getFullYear()} Wanjey Events & Marketing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
