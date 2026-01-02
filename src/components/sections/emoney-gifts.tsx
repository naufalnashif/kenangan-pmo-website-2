import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { ScrollRevealWrapper } from "../scroll-reveal-wrapper";

const emoneyCards = [
  {
    id: "emoney-1",
    alt: "E-money design 1",
    transformClass: "hover:scale-105"
  },
  {
    id: "emoney-2",
    alt: "E-money design 2",
    transformClass: "hover:rotate-2"
  },
  {
    id: "emoney-3",
    alt: "E-money design 3",
    transformClass: "hover:-rotate-2"
  },
];

export default function EmoneyGifts() {
  const images = emoneyCards.map(card => {
    const placeholder = PlaceHolderImages.find(p => p.id === card.id);
    return { ...card, ...placeholder };
  });

  return (
    <ScrollRevealWrapper id="emooney" className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 relative overflow-hidden shadow-2xl">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/20 rounded-full filter blur-[100px]"></div>
          <div className="relative z-10 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h3 className="text-4xl md:text-5xl font-black text-white mb-8">Limited Edition <br /><span className="text-accent">Emooney Design.</span></h3>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                Kenang-kenangan spesial untuk tim. Tiga desain kartu eksklusif yang bisa Anda unduh dan cetak untuk kartu E-Money personal.
              </p>
              <Button asChild size="lg" className="px-10 py-5 rounded-2xl text-base bg-accent text-accent-foreground hover:bg-accent/90 transition-all shadow-xl shadow-accent/20">
                <Link href="https://github.com/naufalnashif/public-assets/tree/main/kenangan-pmo/design_emoneey" target="_blank">
                  <Download className="h-6 w-6 mr-4" />
                  <span>Download Assets</span>
                </Link>
              </Button>
            </div>
            <div className="flex space-x-4 overflow-x-auto no-scrollbar pb-6 -mx-4 px-4">
              {images.map((card, index) => (
                <div key={index} className="flex-shrink-0">
                  {card.imageUrl && (
                    <Image
                      src={card.imageUrl}
                      alt={card.alt}
                      width={256}
                      height={161}
                      className={`w-64 h-auto rounded-3xl shadow-2xl border border-white/10 transform transition-transform ${card.transformClass}`}
                      data-ai-hint={card.imageHint}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScrollRevealWrapper>
  );
}
