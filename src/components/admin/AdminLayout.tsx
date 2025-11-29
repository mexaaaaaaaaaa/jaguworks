import { useState } from "react";
import { Link, useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  LayoutDashboard,
  Package,
  FileText,
  MessageSquare,
  BarChart3,
  Award,
  Ticket,
  Settings,
  Users,
  Menu,
  X,
  LogOut,
  ShoppingCart,
  Puzzle,
  Layers,
  Link2,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const menuItems = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "moderator"] },
  { path: "/admin/sections", label: "Section Builder", icon: Layers, roles: ["admin", "moderator"] },
  { path: "/admin/orders", label: "Orders", icon: ShoppingCart, roles: ["admin", "moderator"] },
  { path: "/admin/plans", label: "Plans", icon: Package, roles: ["admin", "moderator"] },
  { path: "/admin/addons", label: "Add-ons", icon: Puzzle, roles: ["admin", "moderator"] },
  { path: "/admin/blog", label: "Blog Posts", icon: FileText, roles: ["admin", "moderator"] },
  { path: "/admin/testimonials", label: "Testimonials", icon: MessageSquare, roles: ["admin", "moderator"] },
  { path: "/admin/stats", label: "Stats", icon: BarChart3, roles: ["admin", "moderator"] },
  { path: "/admin/achievements", label: "Achievements", icon: Award, roles: ["admin", "moderator"] },
  { path: "/admin/social-links", label: "Social Links", icon: Link2, roles: ["admin", "moderator"] },
  { path: "/admin/theme", label: "Theme", icon: Palette, roles: ["admin"] },
  { path: "/admin/coupons", label: "Coupons", icon: Ticket, roles: ["admin"] },
  { path: "/admin/settings", label: "Settings", icon: Settings, roles: ["admin"] },
  { path: "/admin/users", label: "Users", icon: Users, roles: ["admin"] },
];

export default function AdminLayout() {
  const { user, loading, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: userRole, isLoading: roleLoading } = useQuery({
    queryKey: ["userRole", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error || !data) return null;
      return data?.role;
    },
    enabled: !!user?.id,
  });

  if (loading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (!userRole || (userRole !== "admin" && userRole !== "moderator")) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center p-8 glass-card rounded-2xl max-w-md">
          <h1 className="text-2xl font-bold text-destructive mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">
            You don't have permission to access the admin dashboard.
          </p>
          <Link to="/">
            <Button>Return to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }

  const filteredMenuItems = menuItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-muted rounded-lg"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <span className="font-bold text-lg">Admin Panel</span>
        <Button variant="ghost" size="icon" onClick={signOut}>
          <LogOut size={20} />
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 bg-card border-r border-border z-40 transition-transform duration-300",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold">J</span>
            </div>
            <div>
              <h2 className="font-bold">Jagmohan</h2>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </div>
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {filteredMenuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3"
            onClick={signOut}
          >
            <LogOut size={20} />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
