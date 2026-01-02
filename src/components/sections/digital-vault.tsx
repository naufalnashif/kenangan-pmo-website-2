import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { ScrollRevealWrapper } from "../scroll-reveal-wrapper";

export default function DigitalVault() {
  const qrCodeImage = PlaceHolderImages.find(img => img.id === 'qr-code');

  return (
    <ScrollRevealWrapper id="drive" className="py-32 bg-secondary/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-primary font-bold uppercase text-sm mb-4">Digital Archive</h2>
        <h3 className="text-4xl font-extrabold text-foreground mb-12">Semua Kenangan Dalam Satu Tempat</h3>
        
        <div className="bg-background rounded-[3rem] p-8 sm:p-12 shadow-2xl border">
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 sm:p-6 rounded-[2rem] shadow-inner mb-10 transform hover:scale-105 transition-transform">
              {qrCodeImage && (
                <Image
                  src={qrCodeImage.imageUrl}
                  alt="QR Code for Google Drive"
                  width={256}
                  height={256}
                  className="w-48 h-48 sm:w-64 sm:h-64 rounded-xl"
                  data-ai-hint={qrCodeImage.imageHint}
                />
              )}
            </div>
            <p className="text-muted-foreground mb-10 text-lg max-w-md">Scan QR atau klik tombol di bawah untuk masuk ke Drive khusus berisi foto & file tim.</p>
            <Button asChild size="lg" className="px-12 py-5 bg-slate-900 dark:bg-primary text-primary-foreground rounded-[2rem] font-bold shadow-2xl hover:scale-105 transition-all">
              <Link href="https://drive.google.com/drive/folders/1gAcot2WW_yWrm2bt8UvmeTjol5639zz6" target="_blank">Open Google Drive</Link>
            </Button>
          </div>
        </div>
      </div>
    </ScrollRevealWrapper>
  );
}
