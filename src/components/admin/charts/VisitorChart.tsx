import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(142 76% 36%)', 'hsl(38 92% 50%)', 'hsl(280 65% 60%)'];

export default function VisitorChart() {
  const { data: pageData, isLoading } = useQuery({
    queryKey: ['admin-visitor-chart'],
    queryFn: async () => {
      const { data } = await supabase
        .from('page_analytics')
        .select('page_path, views')
        .order('views', { ascending: false })
        .limit(5);

      if (!data || data.length === 0) {
        // Return mock data if no analytics yet
        return [
          { name: 'Home', value: 150 },
          { name: 'Minecraft Plans', value: 80 },
          { name: 'Discord Plans', value: 60 },
          { name: 'Blog', value: 40 },
          { name: 'Contact', value: 30 }
        ];
      }

      return data.map(item => ({
        name: item.page_path === '/' ? 'Home' : item.page_path.replace('/', '').replace(/-/g, ' '),
        value: item.views
      }));
    }
  });

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Top Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Top Pages</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pageData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                paddingAngle={5}
                dataKey="value"
              >
                {pageData?.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend 
                formatter={(value) => <span className="text-xs text-muted-foreground capitalize">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
