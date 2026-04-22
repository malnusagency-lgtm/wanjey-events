'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Services", path: "/services" },
  { label: "Packages", path: "/packages" },
  { label: "Gallery", path: "/gallery" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-700 ease-out ${
        scrolled
          ? "glass-panel shadow-[0_1px_2px_0_hsl(var(--foreground)/0.03)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className={`container flex items-center justify-between transition-all duration-700 ${
        scrolled ? "h-14" : "h-16 md:h-20"
      }`}>
        <Link href="/" className="font-serif text-xl font-bold tracking-tight md:text-2xl">
          Miss Wanjey<span className="text-accent">.</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              href={link.path}
              className={`relative px-3 py-2 text-[13px] font-medium transition-colors duration-300 ${
                pathname === link.path ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
              {pathname === link.path && (
                <span className="absolute bottom-0 left-1/2 h-px w-4 -translate-x-1/2 bg-accent" />
              )}
            </Link>
          ))}
        </nav>

        <Link href="/contact" className="hidden lg:block">
          <Button
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-sans text-xs shadow-none transition-all duration-300 hover:shadow-sm hover:shadow-accent/10"
          >
            Book a Consultation
          </Button>
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="hover:bg-accent/5">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 border-l-border/30">
            <SheetTitle className="font-serif text-lg">
              Miss Wanjey<span className="text-accent">.</span>
            </SheetTitle>
            <nav className="mt-10 flex flex-col gap-0.5">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setOpen(false)}
                  className={`rounded-lg px-4 py-3 text-[15px] font-medium transition-colors duration-300 ${
                    pathname === link.path
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link href="/contact" onClick={() => setOpen(false)} className="mt-8">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-sans">
                  Book a Consultation
                </Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Navbar;
