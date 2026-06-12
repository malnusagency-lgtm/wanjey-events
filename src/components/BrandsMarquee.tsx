'use client';

const brands = [
  "Safaricom",
  "Toto Kingdom",
  "EABL",
  "Coca-Cola",
  "Big Voices",
  "Royal Media Services",
  "Unilever",
  "Kenya Airways",
  "NCBA Bank",
  "Naivas",
  "KCB Group",
  "Kenyatta University",
];

export default function BrandsMarquee() {
  return (
    <div className="relative w-full overflow-hidden border-y border-[#CAA365]/30 bg-[#FFE5D9] py-6 z-10 shadow-sm">
      <div className="flex items-center">
        {/* Subtitle label left */}
        <div className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#FFE5D9] via-[#FFE5D9]/90 to-transparent z-20 px-6 flex items-center shrink-0 pointer-events-none md:pr-16">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2D1A10]/60 mr-2">
            Trusted By
          </span>
          <div className="h-4 w-px bg-[#CAA365]/35 hidden md:block" />
        </div>

        {/* Scrolling list */}
        <div className="flex animate-marquee-brands whitespace-nowrap gap-12 px-6">
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <div key={i} className="flex items-center gap-4">
              <span className="font-sans text-[15px] md:text-[18px] font-black uppercase tracking-[0.25em] text-[#2D1A10] hover:text-[#D48C70] transition-colors cursor-pointer">
                {brand}
              </span>
              <span className="text-[#CAA365] font-bold text-lg">✦</span>
            </div>
          ))}
        </div>

        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-[#FFE5D9] via-[#FFE5D9]/80 to-transparent z-20 w-16 pointer-events-none" />
      </div>

      <style jsx>{`
        .animate-marquee-brands {
          display: flex;
          width: max-content;
          animation: marquee-brands 45s linear infinite;
        }
        @keyframes marquee-brands {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
      `}</style>
    </div>
  );
}
