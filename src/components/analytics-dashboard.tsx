'use client';

import { useState, useEffect, useMemo } from 'react';
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { Eye, Users, BarChart2, ChevronDown } from 'lucide-react';
import { NameType, ValueType } from 'recharts/types/component/DefaultTooltipContent';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from './ui/button';
import { ScrollRevealWrapper } from './scroll-reveal-wrapper';

interface Visit {
  id: string;
  timestamp: Timestamp;
  userAgent: string;
}

interface ProcessedData {
  totalVisits: number;
  uniqueVisitors: number;
  visitsByDay: { date: string; visits: number }[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Date
            </span>
            <span className="font-bold text-muted-foreground">
              {label}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              Visits
            </span>
            <span className="font-bold">
              {payload[0].value}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};


export default function AnalyticsDashboard() {
  const [data, setData] = useState<ProcessedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const q = query(collection(db, 'visits'), orderBy('timestamp', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const visits: Visit[] = [];
      querySnapshot.forEach((doc) => {
        const docData = doc.data();
        if (docData.timestamp) { // Ensure timestamp exists
          visits.push({
            id: doc.id,
            timestamp: docData.timestamp,
            userAgent: docData.userAgent
          });
        }
      });
      processAnalytics(visits);
      setError(null);
    }, (err) => {
      console.error("Error fetching analytics: ", err);
      setError("Could not load analytics. Please ensure Firestore is set up correctly and you have permission to read the 'visits' collection.");
    });

    return () => unsubscribe();
  }, [isOpen]);
  
  const processAnalytics = (visits: Visit[]) => {
    // Total visits
    const totalVisits = visits.length;

    // Unique visitors (based on user agent, a simple proxy)
    const uniqueVisitors = new Set(visits.map(v => v.userAgent)).size;

    // Visits by day (last 7 days)
    const visitsByDay: { [key: string]: number } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const dateString = d.toLocaleDateString('en-CA'); // YYYY-MM-DD
        visitsByDay[dateString] = 0;
    }
    
    visits.forEach(visit => {
      if (visit.timestamp) {
        const visitDate = visit.timestamp.toDate();
        const dateString = visitDate.toLocaleDateString('en-CA');
        if (dateString in visitsByDay) {
          visitsByDay[dateString]++;
        }
      }
    });

    const chartData = Object.entries(visitsByDay).map(([date, visits]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visits
    })).reverse();


    setData({
      totalVisits,
      uniqueVisitors,
      visitsByDay: chartData
    });
  };

  const formattedTotalVisits = useMemo(() => {
    if (data?.totalVisits === undefined) return '...';
    return new Intl.NumberFormat().format(data.totalVisits);
  }, [data?.totalVisits]);

  const formattedUniqueVisitors = useMemo(() => {
    if (data?.uniqueVisitors === undefined) return '...';
    return new Intl.NumberFormat().format(data.uniqueVisitors);
  }, [data?.uniqueVisitors]);


  return (
    <ScrollRevealWrapper id="analytics" className="py-32 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <div className='flex justify-between items-center cursor-pointer group'>
              <div>
                <h2 className="text-primary font-bold uppercase text-sm mb-3">ANALYTICS</h2>
                <h3 className="text-4xl font-extrabold text-foreground">Visitor Insights</h3>
              </div>
              <Button variant="outline" size="icon" className="w-16 h-16 rounded-full group-hover:bg-accent transition-transform group-data-[state=open]:rotate-180">
                <ChevronDown />
              </Button>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 pt-12">
            <p className="text-muted-foreground">Real-time analytics for your farewell page.</p>
            
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg">
                  <p>{error}</p>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data ? formattedTotalVisits : "..."}</div>
                  <p className="text-xs text-muted-foreground">Total number of times the page has been loaded.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unique Visitors (Estimated)</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data ? formattedUniqueVisitors : "..."}</div>
                  <p className="text-xs text-muted-foreground">Based on unique browser signatures.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Real-time</CardTitle>
                  <div className="h-4 w-4 relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Live</div>
                  <p className="text-xs text-muted-foreground">Data is updated in real-time from Firestore.</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart2 className="h-5 w-5"/> Visits Over Last 7 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  {data ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.visitsByDay}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                        <XAxis 
                          dataKey="date" 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          allowDecimals={false}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{fill: 'hsl(var(--background))'}}/>
                        <Bar dataKey="visits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      {isOpen ? "Loading chart data..." : "Open to view analytics"}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </ScrollRevealWrapper>
  );
}
