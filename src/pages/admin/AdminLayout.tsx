import { ReactNode, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { useToast } from "../../hooks/use-toast";
import { 
  LayoutDashboard, 
  Settings, 
  Users, 
  Calendar, 
  ClipboardList, 
  LogOut, 
  Menu, 
  X,
  Stethoscope,
  ChevronRight
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";

interface AdminLayoutProps {
  children: ReactNode;
}

const navItems = [
  { label: "Übersicht", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Sitzungen", href: "/admin/sessions", icon: Calendar },
  { label: "Behandlungsarten", href: "/admin/session-types", icon: Stethoscope },
  { label: "Buchungen", href: "/admin/bookings", icon: ClipboardList },
  { label: "Patienten", href: "/admin/clients", icon: Users },
  { label: "Einstellungen", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, profile } = useAuthContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Fehler beim Abmelden",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Abgemeldet",
        description: "Admin-Sitzung beendet.",
      });
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] flex font-lato">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-stone-200 transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col pt-8">
          <div className="px-8 pb-10 flex items-center justify-between">
            <Link to="/" className="font-montserrat text-lg font-bold tracking-tight text-stone-900">
              Dr. Schmidt <span className="text-stone-400 font-medium">| Admin</span>
            </Link>
            <button className="lg:hidden p-2 -mr-2" onClick={() => setSidebarOpen(false)}>
              <X size={20} />
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors group",
                    active 
                      ? "bg-stone-900 text-[#faf8f5]" 
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
                  )}
                >
                  <item.icon size={18} className={cn(active ? "text-stone-400" : "text-stone-400 group-hover:text-stone-600")} />
                  {item.label}
                  {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-stone-100">
            <div className="mb-4 px-4 py-3 bg-stone-50 rounded-lg">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Angemeldet als</p>
              <p className="text-sm font-bold text-stone-900 truncate">{profile?.first_name} {profile?.last_name}</p>
              <p className="text-[10px] text-stone-500 truncate">{user?.email}</p>
            </div>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="w-full justify-start text-stone-600 hover:text-destructive hover:bg-destructive/5 gap-3"
            >
              <LogOut size={18} />
              Abmelden
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 lg:hidden text-stone-600 hover:bg-stone-100 rounded-md"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h2 className="font-montserrat font-bold text-lg text-stone-900">
              {navItems.find(i => i.href === location.pathname)?.label || "Dashboard"}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xs font-semibold text-stone-500 hover:text-stone-900 uppercase tracking-widest transition-colors">
              Zur Website
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#faf8f5]">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
