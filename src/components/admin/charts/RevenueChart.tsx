import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays, startOfDay } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function RevenueChart() {
  const { data: revenueData, isLoading } = useQuery({
    queryKey: ['admin-revenue-chart'],
    queryFn: async () => {
      const last30Days = Array.from({ length: 30 }, (_, i) => {
        const date = subDays(new Date(), 29 - i);
        return {
          date: format(date, 'yyyy-MM-dd'),
          label: format(date, 'MMM dd'),
          revenue: 0,
          orders: 0
        };
      });

      const { data: orders } = await supabase
        .from('orders')
        .select('total_amount, created_at, status')
        .eq('status', 'completed')
        .gte('created_at', subDays(new Date(), 30).toISOString());

      if (orders) {
        orders.forEach(order => {
          const orderDate = format(new Date(order.created_at!), 'yyyy-MM-dd');
          const dayData = last30Days.find(d => d.date === orderDate);
          if (dayData) {
            dayData.revenue += order.total_amount;
            dayData.orders += 1;
          }
        });
      }

      // Calculate trend
      const firstHalf = last30Days.slice(0, 15).reduce((sum, d) => sum + d.revenue, 0);
      const secondHalf = last30Days.slice(15).reduce((sum, d) => sum + d.revenue, 0);
      const trend = firstHalf > 0 ? ((secondHalf - firstHalf) / firstHalf) * 100 : 0;

      return {
        chartData: last30Days,
        totalRevenue: last30Days.reduce((sum, d) => sum + d.revenue, 0),
        totalOrders: last30Days.reduce((sum, d) => sum + d.orders, 0),
        trend: trend.toFixed(1)
      };
    }
  });

  if (isLoading) {
    return (
      <Card className="col-span-2 bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Revenue Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const trendPositive = parseFloat(revenueData?.trend || '0') >= 0;

  return (
    <Card className="col-span-2 bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-lg">Revenue Overview</CardTitle>
          <p className="text-sm text-muted-foreground">Last 30 days</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">₹{revenueData?.totalRevenue.toLocaleString()}</p>
          <div className={`flex items-center gap-1 text-sm ${trendPositive ? 'text-green-500' : 'text-red-500'}`}>
            {trendPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>{trendPositive ? '+' : ''}{revenueData?.trend}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData?.chartData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis 
                dataKey="label" 
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
                tickFormatter={(value) => `₹${value}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fill="url(#revenueGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
