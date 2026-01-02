import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollRevealWrapper } from "../scroll-reveal-wrapper";

const galleryItems = [
  {
    id: 'gallery-wisma',
    title: 'Wisma Mulia 2',
    description: 'Headquarters',
    width: 400,
    height: 500
  },
  {
    id: 'gallery-office',
    title: 'PMOT Office',
    description: 'Workplace',
    width: 400,
    height: 500
  },
  {
    id: 'gallery-malang',
    title: 'The Malang Trip',
    description: 'Exploration',
    width: 400,
    height: 500
  },
  {
    id: 'gallery-belitung',
    title: 'Island Hopping',
    description: 'Belitung 2025',
    width: 400,
    height: 500
  },
  {
    id: 'gallery-bonding',
    title: 'Bonding Time',
    description: 'Culinary Trip',
    width: 400,
    height: 500
  },
  {
    id: 'gallery-casual',
    title: 'Casual Moments',
    description: 'Office Life',
    width: 400,
    height: 500
  },
];

export default function MemoriesGallery() {
  const images = galleryItems.map(item => {
    const placeholder = PlaceHolderImages.find(p => p.id === item.id);
    return { ...item, ...placeholder };
  });

  return (
    <ScrollRevealWrapper id="memories" className="py-32 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-primary font-bold uppercase text-sm mb-3">Gallery of Growth</h2>
            <h3 className="text-4xl md:text-5xl font-extrabold text-foreground">Jejak Langkah di PMO OJK</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {images.map((item, index) => (
            <div key={index} className="group">
              <Card className="h-full overflow-hidden rounded-[2.5rem] bg-card p-4 shadow-xl hover:-translate-y-2 transition-all duration-500 border flex flex-col">
                <CardContent className="p-0">
                  <div className="aspect-[4/5] overflow-hidden rounded-[1.8rem] mb-6">
                    {item.imageUrl && (
                       <Image 
                        src={item.imageUrl}
                        alt={item.title} 
                        width={item.width}
                        height={item.height}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        data-ai-hint={item.imageHint}
                      />
                    )}
                  </div>
                </CardContent>
                <CardHeader className="p-4 pt-0 mt-auto">
                  <CardTitle className="text-xl font-extrabold">{item.title}</CardTitle>
                  <CardDescription className="text-sm uppercase font-bold tracking-widest pt-1">{item.description}</CardDescription>
                </CardHeader>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </ScrollRevealWrapper>
  );
}
