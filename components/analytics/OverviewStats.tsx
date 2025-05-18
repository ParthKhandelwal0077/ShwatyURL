import { AnalyticsData } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LinkIcon, MousePointerClick, TrendingUp, Calendar } from 'lucide-react';

interface OverviewStatsProps {
  data: AnalyticsData;
  isLoading: boolean;
}

const OverviewStats = ({ data, isLoading }: OverviewStatsProps) => {
  // Calculate click rate (clicks per URL)
  const clickRate = data.totalUrls > 0 ? data.totalClicks / data.totalUrls : 0;
  
  // Calculate click trend (percentage increase in last 7 days compared to previous 7 days)
  const calculateTrend = () => {
    if (data.clicksByDay.length < 14) return 0;
    
    const last7Days = data.clicksByDay.slice(-7);
    const previous7Days = data.clicksByDay.slice(-14, -7);
    
    const last7DaysClicks = last7Days.reduce((sum, day) => sum + day.clicks, 0);
    const previous7DaysClicks = previous7Days.reduce((sum, day) => sum + day.clicks, 0);
    
    if (previous7DaysClicks === 0) return 100;
    
    return ((last7DaysClicks - previous7DaysClicks) / previous7DaysClicks) * 100;
  };
  
  const trend = calculateTrend();
  
  const stats = [
    {
      title: 'Total URLs',
      value: data.totalUrls,
      icon: <LinkIcon className="h-6 w-6 text-teal-400" />,
      format: (val: number) => val.toLocaleString()
    },
    {
      title: 'Total Clicks',
      value: data.totalClicks,
      icon: <MousePointerClick className="h-6 w-6 text-purple-400" />,
      format: (val: number) => val.toLocaleString()
    },
    {
      title: 'Avg. Clicks per URL',
      value: clickRate,
      icon: <Calendar className="h-6 w-6 text-amber-400" />,
      format: (val: number) => val.toFixed(1)
    },
    {
      title: '7-Day Trend',
      value: trend,
      icon: <TrendingUp className="h-6 w-6 text-emerald-400" />,
      format: (val: number) => `${val > 0 ? '+' : ''}${val.toFixed(1)}%`,
      color: trend > 0 ? 'text-emerald-500' : trend < 0 ? 'text-red-500' : ''
    }
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card 
          key={index} 
          className="border-border/50 bg-card/70 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
        >
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            {stat.icon}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color || ''}`}>
              {isLoading ? '—' : stat.format(stat.value)}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OverviewStats;