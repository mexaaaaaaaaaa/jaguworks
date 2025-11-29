import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Users,
  Settings,
  Palette,
  MessageSquare,
  BarChart3,
  Image,
  Eye,
  Lock,
  Package,
  Award,
  Link2,
  Layers,
  Search,
} from 'lucide-react';

const commandItems = [
  { group: 'Navigation', items: [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', keywords: ['home', 'main'] },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders', keywords: ['sales', 'purchases'] },
    { icon: Package, label: 'Plans', path: '/admin/plans', keywords: ['pricing', 'products'] },
    { icon: FileText, label: 'Blog Posts', path: '/admin/blog', keywords: ['articles', 'content'] },
    { icon: Users, label: 'Users', path: '/admin/users', keywords: ['members', 'accounts'] },
  ]},
  { group: 'Content', items: [
    { icon: MessageSquare, label: 'Testimonials', path: '/admin/testimonials', keywords: ['reviews', 'feedback'] },
    { icon: BarChart3, label: 'Stats', path: '/admin/stats', keywords: ['numbers', 'counters'] },
    { icon: Award, label: 'Achievements', path: '/admin/achievements', keywords: ['badges', 'milestones'] },
    { icon: Layers, label: 'Section Builder', path: '/admin/section-builder', keywords: ['custom', 'dynamic'] },
    { icon: Link2, label: 'Social Links', path: '/admin/social-links', keywords: ['media', 'profiles'] },
  ]},
  { group: 'Settings', items: [
    { icon: Palette, label: 'Hero Editor', path: '/admin/hero-editor', keywords: ['banner', 'header'] },
    { icon: FileText, label: 'About Editor', path: '/admin/about-editor', keywords: ['bio', 'profile'] },
    { icon: Eye, label: 'Section Visibility', path: '/admin/section-visibility', keywords: ['toggle', 'show', 'hide'] },
    { icon: Settings, label: 'Settings', path: '/admin/settings', keywords: ['config', 'options'] },
    { icon: Lock, label: 'PIN Settings', path: '/admin/pin-settings', keywords: ['security', 'password'] },
  ]},
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (path: string) => {
    setOpen(false);
    navigate(path);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground bg-muted/50 rounded-md border border-border hover:bg-muted transition-colors"
      >
        <Search className="w-4 h-4" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {commandItems.map((group, groupIndex) => (
            <div key={group.group}>
              <CommandGroup heading={group.group}>
                {group.items.map((item) => (
                  <CommandItem
                    key={item.path}
                    onSelect={() => handleSelect(item.path)}
                    className="cursor-pointer"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
              {groupIndex < commandItems.length - 1 && <CommandSeparator />}
            </div>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
