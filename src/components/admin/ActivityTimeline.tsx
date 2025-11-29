import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ShoppingCart, 
  FileText, 
  Users, 
  Settings, 
  MessageSquare,
  Award,
  Edit,
  Trash2,
  Plus,
  Clock
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

interface ActivityLog {
  id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

const actionIcons: Record<string, typeof ShoppingCart> = {
  order: ShoppingCart,
  blog: FileText,
  user: Users,
  settings: Settings,
  testimonial: MessageSquare,
  achievement: Award,
};

const actionColors: Record<string, string> = {
  create: 'bg-green-500',
  update: 'bg-blue-500',
  delete: 'bg-red-500',
  default: 'bg-muted',
};

export default function ActivityTimeline() {
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ['admin-activity-logs'],
    queryFn: async () => {
      // First try to get activity logs
      const { data: logs } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (logs && logs.length > 0) {
        return logs as ActivityLog[];
      }

      // If no activity logs, create mock data from recent orders
      const { data: orders } = await supabase
        .from('orders')
        .select('id, order_id, buyer_name, plan_name, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);

      const mockActivities: ActivityLog[] = (orders || []).map(order => ({
        id: order.id,
        action: 'create',
        entity_type: 'order',
        entity_id: order.id,
        details: { 
          order_id: order.order_id, 
          buyer: order.buyer_name,
          plan: order.plan_name,
          status: order.status 
        },
        created_at: order.created_at || new Date().toISOString()
      }));

      return mockActivities;
    }
  });

  const getIcon = (entityType: string | null) => {
    const Icon = actionIcons[entityType || ''] || Clock;
    return Icon;
  };

  const getActionColor = (action: string) => {
    if (action.includes('create') || action.includes('new')) return actionColors.create;
    if (action.includes('update') || action.includes('edit')) return actionColors.update;
    if (action.includes('delete') || action.includes('remove')) return actionColors.delete;
    return actionColors.default;
  };

  const getActionIcon = (action: string) => {
    if (action.includes('create') || action.includes('new')) return Plus;
    if (action.includes('update') || action.includes('edit')) return Edit;
    if (action.includes('delete') || action.includes('remove')) return Trash2;
    return Clock;
  };

  if (isLoading) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px]">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          {activities.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No recent activity
            </div>
          ) : (
            <div className="relative px-4">
              {/* Timeline line */}
              <div className="absolute left-7 top-0 bottom-0 w-px bg-border" />
              
              {activities.map((activity, index) => {
                const Icon = getIcon(activity.entity_type);
                const ActionIcon = getActionIcon(activity.action);
                
                return (
                  <div key={activity.id} className="relative flex gap-4 pb-4">
                    {/* Icon */}
                    <div className={`relative z-10 w-6 h-6 rounded-full flex items-center justify-center ${getActionColor(activity.action)}`}>
                      <ActionIcon className="w-3 h-3 text-white" />
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium text-sm capitalize">
                          {activity.entity_type} {activity.action}
                        </span>
                      </div>
                      {activity.details && Object.keys(activity.details).length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {Object.entries(activity.details)
                            .filter(([key]) => key !== 'status')
                            .map(([key, value]) => `${key}: ${value}`)
                            .join(' • ')}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
