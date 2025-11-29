import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RevenueChart from '@/components/admin/charts/RevenueChart';
import OrdersChart from '@/components/admin/charts/OrdersChart';
import VisitorChart from '@/components/admin/charts/VisitorChart';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Eye,
  FileText,
  Package,
} from 'lucide-react';
import { format, subDays } from 'date-fns';

export default function AdminAnalytics() {
  const { data: stats } = useQuery({
    queryKey: ['admin-analytics-stats'],
    queryFn: async () => {
      const now = new Date();
      const last30Days = subDays(now, 30);
      const last60Days = subDays(now, 60);

      // Orders stats
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('total_amount, status')
        .gte('created_at', last30Days.toISOString());

      const { data: previousOrders } = await supabase
        .from('orders')
        .select('total_amount, status')
        .gte('created_at', last60Days.toISOString())
        .lt('created_at', last30Days.toISOString());

      const recentRevenue = recentOrders?.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total_amount, 0) || 0;
      const previousRevenue = previousOrders?.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total_amount, 0) || 0;
      const revenueGrowth = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

      const recentOrderCount = recentOrders?.length || 0;
      const previousOrderCount = previousOrders?.length || 0;
      const orderGrowth = previousOrderCount > 0 ? ((recentOrderCount - previousOrderCount) / previousOrderCount) * 100 : 0;

      // Blog stats
      const { count: blogCount } = await supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      // User stats
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Plans stats
      const { count: planCount } = await supabase
        .from('plans')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      return {
        revenue: {
          value: recentRevenue,
          growth: revenueGrowth.toFixed(1),
          positive: revenueGrowth >= 0
        },
        orders: {
          value: recentOrderCount,
          growth: orderGrowth.toFixed(1),
          positive: orderGrowth >= 0
        },
        users: userCount || 0,
        blogs: blogCount || 0,
        plans: planCount || 0,
      };
    }
  });

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats?.revenue.value.toLocaleString() || 0}`,
      growth: `${stats?.revenue.positive ? '+' : ''}${stats?.revenue.growth || 0}%`,
      positive: stats?.revenue.positive,
      icon: DollarSign,
      color: 'text-green-500',
    },
    {
      title: 'Orders (30d)',
      value: stats?.orders.value || 0,
      growth: `${stats?.orders.positive ? '+' : ''}${stats?.orders.growth || 0}%`,
      positive: stats?.orders.positive,
      icon: ShoppingCart,
      color: 'text-blue-500',
    },
    {
      title: 'Total Users',
      value: stats?.users || 0,
      icon: Users,
      color: 'text-purple-500',
    },
    {
      title: 'Published Posts',
      value: stats?.blogs || 0,
      icon: FileText,
      color: 'text-orange-500',
    },
    {
      title: 'Active Plans',
      value: stats?.plans || 0,
      icon: Package,
      color: 'text-cyan-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Track your portfolio performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                {stat.growth && (
                  <div className={`flex items-center gap-1 text-xs ${stat.positive ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.growth}
                  </div>
                )}
              </div>
              <p className="text-2xl font-bold mt-2">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <RevenueChart />
        </TabsContent>

        <TabsContent value="orders">
          <div className="grid md:grid-cols-2 gap-4">
            <OrdersChart />
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Order Status</CardTitle>
              </CardHeader>
              <CardContent>
                <OrderStatusBreakdown />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="pages">
          <div className="grid md:grid-cols-2 gap-4">
            <VisitorChart />
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Top Performing Content</CardTitle>
              </CardHeader>
              <CardContent>
                <TopContent />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function OrderStatusBreakdown() {
  const { data } = useQuery({
    queryKey: ['order-status-breakdown'],
    queryFn: async () => {
      const { data: orders } = await supabase
        .from('orders')
        .select('status');

      const breakdown: Record<string, number> = {};
      orders?.forEach(order => {
        const status = order.status || 'unknown';
        breakdown[status] = (breakdown[status] || 0) + 1;
      });

      return Object.entries(breakdown).map(([status, count]) => ({ status, count }));
    }
  });

  const statusColors: Record<string, string> = {
    completed: 'bg-green-500',
    pending: 'bg-yellow-500',
    failed: 'bg-red-500',
    unknown: 'bg-gray-500',
  };

  return (
    <div className="space-y-3">
      {data?.map(({ status, count }) => (
        <div key={status} className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${statusColors[status] || 'bg-gray-500'}`} />
          <span className="capitalize flex-1">{status}</span>
          <span className="font-medium">{count}</span>
        </div>
      ))}
      {(!data || data.length === 0) && (
        <p className="text-muted-foreground text-sm">No orders yet</p>
      )}
    </div>
  );
}

function TopContent() {
  const { data } = useQuery({
    queryKey: ['top-content'],
    queryFn: async () => {
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('title, views')
        .eq('is_published', true)
        .order('views', { ascending: false })
        .limit(5);

      return posts || [];
    }
  });

  return (
    <div className="space-y-3">
      {data?.map((post, index) => (
        <div key={post.title} className="flex items-center gap-3">
          <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">
            {index + 1}
          </span>
          <span className="flex-1 truncate">{post.title}</span>
          <span className="text-muted-foreground text-sm">{post.views || 0} views</span>
        </div>
      ))}
      {(!data || data.length === 0) && (
        <p className="text-muted-foreground text-sm">No blog posts yet</p>
      )}
    </div>
  );
}
