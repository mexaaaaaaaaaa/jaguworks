import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, DollarSign, FileText, Users, TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import RevenueChart from "@/components/admin/charts/RevenueChart";
import OrdersChart from "@/components/admin/charts/OrdersChart";
import ActivityTimeline from "@/components/admin/ActivityTimeline";
import QuickActions from "@/components/admin/QuickActions";
import QRGenerator from "@/components/admin/QRGenerator";

export default function AdminDashboard() {
  const { data: ordersStats } = useQuery({
    queryKey: ["adminOrdersStats"],
    queryFn: async () => {
      const { data } = await supabase.from("orders").select("*");
      const total = data?.length || 0;
      const pending = data?.filter((o) => o.status === "pending").length || 0;
      const completed = data?.filter((o) => o.status === "completed").length || 0;
      const revenue = data?.filter((o) => o.status === "completed").reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;
      return { total, pending, completed, revenue };
    },
  });

  const { data: recentOrders } = useQuery({
    queryKey: ["adminRecentOrders"],
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);
      return data;
    },
  });

  const { data: blogStats } = useQuery({
    queryKey: ["adminBlogStats"],
    queryFn: async () => {
      const { data } = await supabase.from("blog_posts").select("id, is_published");
      const total = data?.length || 0;
      const published = data?.filter((p) => p.is_published).length || 0;
      return { total, published };
    },
  });

  const stats = [
    { title: "Total Orders", value: ordersStats?.total || 0, icon: ShoppingCart, color: "from-blue-500 to-cyan-500" },
    { title: "Revenue", value: `₹${ordersStats?.revenue?.toLocaleString() || 0}`, icon: DollarSign, color: "from-green-500 to-emerald-500" },
    { title: "Pending", value: ordersStats?.pending || 0, icon: Users, color: "from-yellow-500 to-orange-500" },
    { title: "Blog Posts", value: blogStats?.published || 0, icon: FileText, color: "from-purple-500 to-pink-500" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-4">
        <RevenueChart />
        <OrdersChart />
      </div>

      {/* Activity & Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ActivityTimeline />
        <QuickActions />
        <QRGenerator />
      </div>

      {/* Recent Orders */}
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link to="/admin/orders" className="text-sm text-primary hover:underline">View all</Link>
        </CardHeader>
        <CardContent>
          {recentOrders && recentOrders.length > 0 ? (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div>
                    <p className="font-medium">{order.buyer_name}</p>
                    <p className="text-sm text-muted-foreground">{order.plan_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{order.total_amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "completed" ? "bg-green-500/20 text-green-500" :
                      order.status === "paid" ? "bg-blue-500/20 text-blue-500" : "bg-yellow-500/20 text-yellow-500"
                    }`}>{order.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No orders yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
