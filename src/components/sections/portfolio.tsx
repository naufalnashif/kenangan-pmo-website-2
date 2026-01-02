'use client';

import Image from "next/image";
import Link from "next/link";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ScrollRevealWrapper } from "../scroll-reveal-wrapper";
import { ArrowRight, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const portfolioItems = [
  {
    id: 'project-1',
    title: 'Project Data Profiling OJK',
    description: 'Ini adalah projek dalam rangka persiapan peluncuran platform Financial Institutions Directory. Saya berperan untuk melakukan ETL dan membentuk datamart serta membuat dashboard profiling. Klik untuk melihat detail lebih lanjut.',
    fileUrl: 'https://www.linkedin.com/posts/naufalnashif_tableau-dashboard-activity-7335742602463313920-cbjS?utm_source=share&utm_medium=member_desktop&rcm=ACoAADGpr9kBOaqynHUXP6ekc0wuA9pMiv9Yv4I',
    tools: ['Python', 'SQL', 'PostgreSQL', 'Tableau'],
    duration: '8 Bulan'
  },
  {
    id: 'project-2',
    title: 'Project Remake Dashboard Management Internal OJK',
    description: 'Ini adalah projek remake Dashboard Management Internal meliputi Dashboard HR, Finance, Audit, IKU, dan Procurement. Klik untuk melihat detail lebih lanjut.',
    fileUrl: '#',
    tools: ['Tableau Desktop', 'Tableau Server', 'Oracle', 'SQL'],
    duration: '6 Bulan'
  },
  {
    id: 'project-3',
    title: 'Explore N8N for AI Automation',
    description: 'Project Gamma adalah inisiatif terbaru dengan fokus pada pengalaman pengguna.',
    fileUrl: 'https://www.linkedin.com/posts/naufalnashif_my-first-ai-agent-project-with-n8n-telegram-activity-7352778399095967744-Whjs?utm_source=share&utm_medium=member_desktop&rcm=ACoAADGpr9kBOaqynHUXP6ekc0wuA9pMiv9Yv4I',
    tools: ['N8N', 'Telegram Bot', 'Javascript', 'AI Agent'],
    duration: '1 Bulan'
  },
  {
    id: 'project-4',
    title: 'AI Speech to Text Platform',
    description: 'Contoh proyek lain untuk mengisi carousel.',
    fileUrl: 'https://www.linkedin.com/posts/naufalnashif_new-project-convert-meeting-audio-into-activity-7352717217693667328--A8i?utm_source=share&utm_medium=member_desktop&rcm=ACoAADGpr9kBOaqynHUXP6ekc0wuA9pMiv9Yv4I',
    tools: ['Python', 'Steamlit', 'Whisper AI'],
    duration: '2 Bulan'
  },
];

export default function Portfolio() {
  const projects = portfolioItems.map(item => {
    const placeholder = PlaceHolderImages.find(p => p.id === item.id);
    return { ...item, ...placeholder, imageUrl: placeholder?.imageUrl || "https://picsum.photos/seed/default/600/400" };
  });

  return (
    <ScrollRevealWrapper id="portfolio" className="py-32 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-3">Portfolio</h2>
          <h3 className="text-4xl font-extrabold text-foreground">Karya yang Pernah Dibuat</h3>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Beberapa proyek dan hasil kerja yang telah saya selesaikan selama di PMO OJK.
          </p>
        </div>

        <Carousel 
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-5xl mx-auto"
        >
          <CarouselContent>
            {projects.map((project, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="h-full overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-shadow flex flex-col bg-background">
                    <CardContent className="p-0">
                      <div className="aspect-video overflow-hidden">
                        <Image 
                          src={project.imageUrl}
                          alt={project.title}
                          width={600}
                          height={400}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          data-ai-hint={project.imageHint}
                        />
                      </div>
                    </CardContent>
                    <CardHeader>
                      <CardTitle>{project.title}</CardTitle>
                      <div className="flex items-center text-xs text-muted-foreground pt-2">
                        <Clock className="h-3 w-3 mr-2" />
                        <span>Durasi: {project.duration}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-4">
                        {project.tools.map(tool => (
                          <Badge key={tool} variant="secondary" className="text-xs">{tool}</Badge>
                        ))}
                      </div>
                      <CardDescription className="pt-4 min-h-[60px]">{project.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto bg-background/50 p-4">
                      <Button asChild className="w-full rounded-xl">
                        <Link href={project.fileUrl} target="_blank">
                          <span>Lihat Detail</span>
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="ml-12 hidden sm:flex" />
          <CarouselNext className="mr-12 hidden sm:flex" />
        </Carousel>

        <div className="text-center mt-12">
            <p className="text-sm text-muted-foreground">
                Geser untuk melihat proyek lainnya.
            </p>
        </div>
      </div>
    </ScrollRevealWrapper>
  );
}
