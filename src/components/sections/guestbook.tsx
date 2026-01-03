'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { ScrollRevealWrapper } from '../scroll-reveal-wrapper';
import { Send, MessageSquare, User, Clock, BookOpen } from 'lucide-react';


const formSchema = z.object({
  name: z.string().min(2, {
    message: "Nama harus berisi minimal 2 karakter.",
  }).max(50, {
    message: "Nama tidak boleh lebih dari 50 karakter."
  }),
  message: z.string().min(5, {
    message: 'Pesan harus berisi minimal 5 karakter.',
  }).max(500, {
    message: 'Pesan tidak boleh lebih dari 500 karakter.'
  }),
});

type GuestbookMessage = {
  id: string;
  name: string;
  message: string;
  timestamp: Timestamp;
};

const MessageItem = ({ msg }: { msg: GuestbookMessage }) => (
    <Card className="p-6 rounded-2xl bg-background/70 shadow-lg border">
        <CardContent className="p-0">
            <div className="flex justify-between items-center mb-4">
              <p className="font-bold text-primary flex items-center gap-2">
                <User size={14}/> 
                {msg.name}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Clock size={12} />
                {msg.timestamp ? formatDistanceToNow(msg.timestamp.toDate(), { addSuffix: true, locale: id }) : 'beberapa saat yang lalu'}
              </p>
            </div>
            <p className="text-muted-foreground text-justify">{msg.message}</p>
        </CardContent>
    </Card>
);


export default function Guestbook() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      message: '',
    },
  });

  useEffect(() => {
    const q = query(collection(db, 'guestbook'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs: GuestbookMessage[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Basic validation
        if (data.name && data.message && data.timestamp) {
          msgs.push({
            id: doc.id,
            name: data.name,
            message: data.message,
            timestamp: data.timestamp,
          });
        }
      });
      setMessages(msgs);
    }, (error) => {
        console.error("Error fetching guestbook: ", error);
        toast({
            variant: "destructive",
            title: "Gagal memuat pesan",
            description: "Tidak bisa terhubung ke database. Pastikan koneksi internet Anda stabil.",
        });
    });

    return () => unsubscribe();
  }, [toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      await addDoc(collection(db, 'guestbook'), {
        name: values.name,
        message: values.message,
        timestamp: serverTimestamp(),
      });
      form.reset();
      toast({
        title: 'Pesan Terkirim!',
        description: 'Terima kasih atas ucapan dan doanya.',
      });
    } catch (error) {
      console.error('Error adding document: ', error);
      toast({
        variant: 'destructive',
        title: 'Gagal Mengirim Pesan',
        description: 'Terjadi kesalahan. Silakan coba lagi.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const hasMoreMessages = messages.length > 3;

  return (
    <ScrollRevealWrapper id="guestbook" className="py-32 bg-secondary/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-primary font-bold uppercase tracking-widest text-sm mb-3">Guestbook</h2>
          <h3 className="text-4xl font-extrabold text-foreground">Tinggalkan Ucapan & Doa</h3>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Setiap kata dan doa dari Anda sangat berarti. Silakan tinggalkan jejak kenangan di sini.
          </p>
        </div>

        <Card className="p-6 sm:p-8 rounded-[2rem] shadow-xl border">
          <CardContent className="p-0">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold flex items-center gap-2"><User size={14}/> Nama Panggilan</FormLabel>
                      <FormControl>
                        <Input placeholder="Tulis nama panggilan Anda..." className="rounded-xl" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-bold flex items-center gap-2"><MessageSquare size={14}/> Pesan</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tulis pesan Anda di sini..."
                          className="min-h-[120px] rounded-2xl text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className='flex justify-end'>
                    <Button type="submit" disabled={isLoading} className="font-bold rounded-xl px-8 py-3">
                      <Send className="mr-2 h-4 w-4" />
                      {isLoading ? 'Mengirim...' : 'Kirim Pesan'}
                    </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="mt-16">
            <h4 className='text-2xl font-bold flex items-center gap-3 text-foreground mb-6'>
                <MessageSquare />
                <span>Pesan dari Rekan-Rekan</span>
            </h4>
            <div className='relative'>
              <div className="space-y-6">
                  {messages.slice(0, 3).map((msg) => (
                      <MessageItem key={msg.id} msg={msg} />
                  ))}
              </div>

              {hasMoreMessages && (
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-secondary/50 to-transparent pointer-events-none" />
              )}
            </div>

            {hasMoreMessages && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-8 rounded-xl font-bold">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Lihat Semua {messages.length} Pesan
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl w-[calc(100%-2rem)] h-[80vh] flex flex-col p-0">
                  <DialogHeader className='p-6 pb-4'>
                    <DialogTitle className='flex items-center gap-3'><MessageSquare/> Semua Pesan ({messages.length})</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="flex-grow px-6">
                    <div className="space-y-4 pb-6">
                      {messages.map((msg) => (
                        <MessageItem key={msg.id} msg={msg} />
                      ))}
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            )}

            {messages.length === 0 && (
                <p className='text-center text-muted-foreground py-10'>Belum ada pesan. Jadilah yang pertama!</p>
            )}
        </div>
      </div>
    </ScrollRevealWrapper>
  );
}
