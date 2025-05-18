// "use client";

// import { useState, useEffect } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Button } from '@/components/ui/button';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { AnalyticsData } from '@/lib/types';
// import { mockAnalytics } from '@/lib/mockData';
// import OverviewStats from '@/components/analytics/OverviewStats';
// import ClicksChart from '@/components/analytics/ClicksChart';
// import PopularUrls from '@/components/analytics/PopularUrls';
// import { Download, RefreshCw } from 'lucide-react';

// export default function Analytics() {
//   const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [timeRange, setTimeRange] = useState('30d');
  
//   useEffect(() => {
//     // Simulate API call to fetch analytics data
//     const fetchAnalyticsData = () => {
//       setTimeout(() => {
//         setAnalyticsData(mockAnalytics);
//         setIsLoading(false);
//       }, 1000);
//     };
    
//     fetchAnalyticsData();
//   }, []);
  
//   const handleRefresh = () => {
//     setIsLoading(true);
//     setTimeout(() => {
//       // Simulate data update
//       setAnalyticsData({
//         ...mockAnalytics,
//         totalClicks: mockAnalytics.totalClicks + Math.floor(Math.random() * 10),
//       });
//       setIsLoading(false);
//     }, 800);
//   };

//   return (
//     <div className="container mx-auto px-4 pt-24 pb-16">
//       <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
//         <h1 className="text-3xl font-bold">Analytics</h1>
        
//         <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
//           <Select defaultValue={timeRange} onValueChange={setTimeRange}>
//             <SelectTrigger className="w-[180px]">
//               <SelectValue placeholder="Select time range" />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="7d">Last 7 days</SelectItem>
//               <SelectItem value="30d">Last 30 days</SelectItem>
//               <SelectItem value="90d">Last 3 months</SelectItem>
//               <SelectItem value="1y">Last year</SelectItem>
//             </SelectContent>
//           </Select>
          
//           <div className="flex space-x-2">
//             <Button variant="outline" size="icon" onClick={handleRefresh} disabled={isLoading}>
//               <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
//             </Button>
//             <Button variant="outline">
//               <Download className="h-4 w-4 mr-2" />
//               Export
//             </Button>
//           </div>
//         </div>
//       </div>
      
//       <Tabs defaultValue="overview" className="space-y-8">
//         <TabsList className="bg-muted/50 border border-border/50">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="clicks">Clicks</TabsTrigger>
//           <TabsTrigger value="popular">Popular URLs</TabsTrigger>
//           <TabsTrigger value="locations" disabled>Locations</TabsTrigger>
//           <TabsTrigger value="devices" disabled>Devices</TabsTrigger>
//         </TabsList>
        
//         <TabsContent value="overview" className="space-y-6">
//           {analyticsData ? (
//             <OverviewStats data={analyticsData} isLoading={isLoading} />
//           ) : (
//             <Card>
//               <CardContent className="py-10">
//                 <div className="flex items-center justify-center">
//                   <div className="animate-pulse text-muted-foreground">Loading analytics...</div>
//                 </div>
//               </CardContent>
//             </Card>
//           )}
          
//           {analyticsData && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Clicks Over Time</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <ClicksChart data={analyticsData.clicksByDay} isLoading={isLoading} />
//               </CardContent>
//             </Card>
//           )}
//         </TabsContent>
        
//         <TabsContent value="clicks">
//           <Card>
//             <CardHeader>
//               <CardTitle>Clicks Over Time</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {analyticsData ? (
//                 <div className="h-[400px]">
//                   <ClicksChart data={analyticsData.clicksByDay} isLoading={isLoading} />
//                 </div>
//               ) : (
//                 <div className="h-[400px] flex items-center justify-center">
//                   <div className="animate-pulse text-muted-foreground">Loading chart data...</div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
        
//         <TabsContent value="popular">
//           <Card>
//             <CardHeader>
//               <CardTitle>Most Popular URLs</CardTitle>
//             </CardHeader>
//             <CardContent>
//               {analyticsData ? (
//                 <PopularUrls urls={analyticsData.popularUrls} isLoading={isLoading} />
//               ) : (
//                 <div className="py-10 flex items-center justify-center">
//                   <div className="animate-pulse text-muted-foreground">Loading popular URLs...</div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }

import React from 'react'

export default function Analytics() {
  return (
    <div>
      Analytics
    </div>
  )
}
