import { ReactNode, useState, useEffect } from "react";
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
  ChevronRight,
  Bell
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { useIdleTimeout } from "../../hooks/useIdleTimeout";

interface AdminLayoutProps {
  children: ReactNode;
}

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

interface BookingNotificationData {
  id: string;
  booking_time: string;
  users: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

const navItems = [
  { label: "Übersicht", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Sitzungen", href: "/admin/sessions", icon: Calendar },
  { label: "Behandlungsarten", href: "/admin/session-types", icon: Stethoscope },
  { label: "Buchungen", href: "/admin/bookings", icon: ClipboardList },
  { label: "Patienten", href: "/admin/clients", icon: Users },
  { label: "Verfügbarkeit", href: "/admin/calendar", icon: Settings },
  { label: "Einstellungen", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, profile } = useAuthContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("adminSidebarCollapsed");
    return saved === "true";
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [adminDarkMode, setAdminDarkMode] = useState(() => {
    return localStorage.getItem("adminDarkMode") === "true";
  });

  useEffect(() => {
    const handleDarkModeChange = () => {
      setAdminDarkMode(localStorage.getItem("adminDarkMode") === "true");
    };
    window.addEventListener("storage", handleDarkModeChange);
    // Custom event for internal changes
    window.addEventListener("admin-dark-mode-toggled", handleDarkModeChange);
    
    return () => {
      window.removeEventListener("storage", handleDarkModeChange);
      window.removeEventListener("admin-dark-mode-toggled", handleDarkModeChange);
    };
  }, []);

  // Auto Logoff after 30 minutes of inactivity
  useIdleTimeout(30 * 60 * 1000);

  useEffect(() => {
    localStorage.setItem("adminSidebarCollapsed", sidebarCollapsed.toString());
  }, [sidebarCollapsed]);

  useEffect(() => {
    // Fetch recent bookings for baseline notifications
    const fetchRecentBookings = async () => {
      const { data } = await supabase
        .from("bookings")
        .select(`
          id, 
          created_at,
          booking_time, 
          users (first_name, last_name)
        `)
        .order("created_at", { ascending: false })
        .limit(5);
      
      if (data) {
        const lastReadStr = localStorage.getItem("adminLastReadNotifications");
        const lastReadTime = lastReadStr ? new Date(lastReadStr).getTime() : 0;

        setNotifications((data as any[]).map((b) => ({
          id: b.id,
          message: `Neue Buchung: ${b.users?.first_name || 'Unbekannt'} ${b.users?.last_name || ''}`,
          time: b.created_at ? new Date(b.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '---',
          read: b.created_at ? new Date(b.created_at).getTime() <= lastReadTime : true
        })));
      }
    };
    
    fetchRecentBookings();

    // Subscribe to real-time changes
    const subscription = supabase
      .channel('bookings-channel')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, (payload) => {
        setNotifications(prev => [{
          id: payload.new.id,
          message: `Neue Buchung erhalten!`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false
        }, ...prev].slice(0, 10));
        
        toast({
          title: "Neue Online-Buchung!",
          description: "Ein Patient hat gerade einen Termin gebucht.",
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [toast]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => {
    const isOpening = !showNotifications;
    setShowNotifications(isOpening);
    
    if (isOpening) {
      localStorage.setItem("adminLastReadNotifications", new Date().toISOString());
      if (unreadCount > 0) {
        setNotifications(prev => prev.map(n => ({...n, read: true})));
      }
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Fehler beim Abmelden",
        description: error.message,
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  return (
    <div className={cn("min-h-screen bg-[#faf8f5] flex font-lato", adminDarkMode ? "dark-admin" : "")}>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 bg-white border-r border-stone-200 transition-all duration-300 lg:static lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        sidebarCollapsed ? "w-20" : "w-72"
      )}>
        <div className="h-full flex flex-col pt-8">
          <div className={cn("pb-10 flex items-center justify-between", sidebarCollapsed ? "px-4 justify-center" : "px-8")}>
            {!sidebarCollapsed ? (
              <Link to="/" className="font-montserrat text-lg font-bold tracking-tight text-stone-900 truncate">
                Dr. Schmidt <span className="text-stone-400 font-medium">| Admin</span>
              </Link>
            ) : (
              <Link to="/" className="font-montserrat text-xl font-bold tracking-tight text-stone-900 mx-auto">
                DS
              </Link>
            )}
            {!sidebarCollapsed && (
              <button className="lg:hidden p-2 -mr-2" onClick={() => setSidebarOpen(false)}>
                <X size={20} />
              </button>
            )}
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const active = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  title={sidebarCollapsed ? item.label : undefined}
                  className={cn(
                    "flex items-center gap-3 py-3 rounded-lg text-sm font-medium transition-colors group",
                    active 
                      ? "bg-stone-900 text-[#faf8f5]" 
                      : "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
                    sidebarCollapsed ? "justify-center px-0" : "px-4"
                  )}
                >
                  <item.icon size={18} className={cn(active ? "text-stone-400" : "text-stone-400 group-hover:text-stone-600")} />
                  {!sidebarCollapsed && item.label}
                  {!sidebarCollapsed && active && <ChevronRight size={14} className="ml-auto opacity-50" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-stone-100">
            {!sidebarCollapsed && (
              <div className="mb-4 px-4 py-3 bg-stone-50 rounded-lg overflow-hidden">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider">Angemeldet als</p>
                <p className="text-sm font-bold text-stone-900 truncate">{profile?.first_name} {profile?.last_name}</p>
                <p className="text-[10px] text-stone-500 truncate">{user?.email}</p>
              </div>
            )}
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              title={sidebarCollapsed ? "Abmelden" : undefined}
              className={cn("w-full text-stone-600 hover:text-destructive hover:bg-destructive/5 gap-3", sidebarCollapsed ? "justify-center px-0" : "justify-start")}
            >
              <LogOut size={18} />
              {!sidebarCollapsed && "Abmelden"}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="p-2 lg:hidden text-stone-600 hover:bg-stone-100 rounded-md transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <button 
              className="p-2 hidden lg:flex text-stone-600 hover:bg-stone-100 rounded-md transition-colors"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Menu size={20} />
            </button>
            <h2 className="font-montserrat font-bold text-lg text-stone-900">
              {navItems.find(i => i.href === location.pathname)?.label || "Dashboard"}
            </h2>
          </div>
          
          <div className="flex items-center gap-4 relative">
            <div className="relative">
              <button 
                onClick={toggleNotifications}
                className="p-2 text-stone-600 hover:bg-stone-100 rounded-md transition-colors relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1 shadow-sm border-2 border-white animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-stone-200 rounded-xl shadow-lg z-50 overflow-hidden">
                  <div className="p-3 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                    <h3 className="font-bold text-sm text-stone-900 font-montserrat">Benachrichtigungen</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs font-semibold px-2 py-0.5 bg-stone-900 text-white rounded-full">
                        {unreadCount} neu
                      </span>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-stone-500">
                        Keine Benachrichtigungen vorhanden.
                      </div>
                    ) : (
                      <div className="divide-y divide-stone-100">
                        {notifications.map((n) => (
                          <div key={n.id} className={cn("p-3 transition-colors hover:bg-stone-50", !n.read ? "bg-stone-50/80" : "")}>
                            <p className={cn("text-sm", !n.read ? "font-bold text-stone-900" : "text-stone-600")}>
                              {n.message}
                            </p>
                            <span className="text-xs text-stone-400 mt-1 block">{n.time}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="p-2 border-t border-stone-100 bg-stone-50/50">
                    <Link to="/admin/bookings" onClick={() => setShowNotifications(false)} className="text-xs text-center block w-full py-2 font-medium text-stone-600 hover:text-stone-900 transition-colors">
                      Alle Buchungen ansehen
                    </Link>
                  </div>
                </div>
              )}
            </div>
            
            <Link to="/" className="px-4 py-2 bg-white border border-stone-200 text-stone-900 rounded-md text-sm font-semibold hover:bg-stone-50 transition-colors shadow-sm hidden sm:block">
              Zur Startseite
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#faf8f5]">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
