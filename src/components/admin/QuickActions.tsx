import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Plus,
  FileText,
  Package,
  MessageSquare,
  Settings,
  Image,
  Download,
  Eye,
  Users,
  BarChart3,
} from 'lucide-react';

const quickActions = [
  {
    icon: Plus,
    label: 'New Blog Post',
    path: '/admin/blog',
    color: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
  },
  {
    icon: Package,
    label: 'Add Plan',
    path: '/admin/plans',
    color: 'bg-green-500/10 text-green-500 hover:bg-green-500/20',
  },
  {
    icon: MessageSquare,
    label: 'Add Testimonial',
    path: '/admin/testimonials',
    color: 'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20',
  },
  {
    icon: Eye,
    label: 'View Site',
    path: '/',
    color: 'bg-orange-500/10 text-orange-500 hover:bg-orange-500/20',
    external: true,
  },
  {
    icon: Image,
    label: 'Media Library',
    path: '/admin/media-library',
    color: 'bg-pink-500/10 text-pink-500 hover:bg-pink-500/20',
  },
  {
    icon: BarChart3,
    label: 'Analytics',
    path: '/admin/analytics',
    color: 'bg-cyan-500/10 text-cyan-500 hover:bg-cyan-500/20',
  },
];

export default function QuickActions() {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.path}
              variant="ghost"
              className={`h-auto py-3 flex flex-col gap-2 ${action.color}`}
              asChild
            >
              <Link to={action.path} target={action.external ? '_blank' : undefined}>
                <action.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{action.label}</span>
              </Link>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
