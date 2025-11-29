import { ChevronRight, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const pathLabels: Record<string, string> = {
  admin: 'Dashboard',
  orders: 'Orders',
  plans: 'Plans',
  addons: 'Add-ons',
  blog: 'Blog Posts',
  users: 'Users',
  testimonials: 'Testimonials',
  stats: 'Stats',
  achievements: 'Achievements',
  coupons: 'Coupons',
  settings: 'Settings',
  theme: 'Theme',
  'social-links': 'Social Links',
  'section-builder': 'Section Builder',
  'hero-editor': 'Hero Editor',
  'about-editor': 'About Editor',
  'section-visibility': 'Section Visibility',
  'pin-settings': 'PIN Settings',
  analytics: 'Analytics',
  'media-library': 'Media Library',
  backup: 'Backup & Restore',
  designer: 'Designer',
  scheduler: 'Scheduler',
  trash: 'Trash',
  logs: 'Logs',
  notes: 'Notes',
};

export default function AdminBreadcrumbs() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);

  if (pathParts.length <= 1) return null;

  const breadcrumbs = pathParts.map((part, index) => {
    const path = '/' + pathParts.slice(0, index + 1).join('/');
    const label = pathLabels[part] || part.charAt(0).toUpperCase() + part.slice(1);
    const isLast = index === pathParts.length - 1;

    return { path, label, isLast };
  });

  return (
    <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
      <Link 
        to="/admin" 
        className="hover:text-foreground transition-colors flex items-center gap-1"
      >
        <Home className="w-4 h-4" />
      </Link>
      {breadcrumbs.slice(1).map((crumb, index) => (
        <div key={crumb.path} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4" />
          {crumb.isLast ? (
            <span className="text-foreground font-medium">{crumb.label}</span>
          ) : (
            <Link to={crumb.path} className="hover:text-foreground transition-colors">
              {crumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
