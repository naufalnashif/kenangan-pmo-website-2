import { cn } from "@/lib/utils";

export default function ScrollingBanner() {
  const bannerItems = [
    "Terima Kasih PMO OJK",
    "Workstream Sistem Informasi",
    "Apresiasi atas Kolaborasi dan Perjalanan Profesional",
  ];

  // Duplicate items to ensure smooth infinite scroll
  const fullBannerItems = [...bannerItems, ...bannerItems];

  return (
    <div className="fixed top-16 sm:top-20 w-full z-40 bg-primary text-primary-foreground py-1.5 overflow-hidden border-y border-primary/80 shadow-md">
      <div className="flex animate-infinite-scroll whitespace-nowrap items-center">
        {fullBannerItems.map((item, index) => (
          <div key={index} className="flex items-center">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mx-4">{item}</span>
            {index < fullBannerItems.length -1 && <span className="text-accent text-[10px] sm:text-xs font-bold mx-4">•</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
