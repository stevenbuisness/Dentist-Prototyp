import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Settings, Moon, Sun, History as HistoryIcon, ChevronRight, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

export default function SettingsPage() {
  const [adminDarkMode, setAdminDarkMode] = useState(() => {
    return localStorage.getItem("adminDarkMode") === "true";
  });

  const toggleDarkMode = () => {
    const newState = !adminDarkMode;
    setAdminDarkMode(newState);
    localStorage.setItem("adminDarkMode", newState.toString());
    window.dispatchEvent(new Event("admin-dark-mode-toggled"));
  };

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-montserrat font-bold text-stone-900 border-stone-100">Einstellungen</h1>
        <p className="text-stone-500 mt-1">Globale Praxis-Einstellungen und System-Konfiguration.</p>
      </div>

      <div className="space-y-6">
        {/* Erscheinungsbild */}
        <Card className="border-stone-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-stone-50/50 border-b border-stone-100">
            <CardTitle className="text-lg font-montserrat font-bold text-stone-900 flex items-center gap-2">
              <Settings size={18} className="text-stone-400" />
              Erscheinungsbild
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Admin Dark Mode</h3>
                <p className="text-stone-500 text-xs mt-1">
                  Aktiviert ein dunkles Theme exklusiv für den Administrationsbereich. Dieser Modus schont die Augen bei längerer Nutzung.
                </p>
              </div>
              
              <button 
                onClick={toggleDarkMode}
                className={cn(
                  "relative w-14 h-8 rounded-full transition-colors duration-300 flex items-center px-1 shrink-0",
                  adminDarkMode ? "bg-stone-900" : "bg-stone-300"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full bg-white flex items-center justify-center transition-transform duration-300 transform",
                  adminDarkMode ? "translate-x-6 shadow-[inset_0px_-2px_4px_rgba(0,0,0,0.2)]" : "translate-x-0 shadow-sm"
                )}>
                  {adminDarkMode ? <Moon size={12} className="text-stone-800" /> : <Sun size={12} className="text-stone-400" />}
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Praxis-Konfiguration */}
        <Card className="border-stone-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-stone-50/50 border-b border-stone-100">
            <CardTitle className="text-lg font-montserrat font-bold text-stone-900 flex items-center gap-2">
              <Clock size={18} className="text-stone-400" />
              Praxis-Konfiguration
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">Öffnungszeiten & Verfügbarkeit</h3>
                <p className="text-stone-500 text-xs mt-1">
                  Verwalten Sie die Kern-Öffnungszeiten der Praxis und definieren Sie globale Verfügbarkeitsregeln.
                </p>
              </div>
              
              <Link to="/admin/calendar">
                <Button 
                  className={cn(
                    "gap-2 transition-all h-10 px-4 rounded-xl font-bold flex items-center shadow-sm",
                    "bg-stone-900 text-white hover:bg-stone-800",
                    "dark-admin-btn" // Special class for our hackless dark mode
                  )}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">Zeiten verwalten</span>
                  <ChevronRight size={14} />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Sicherheit & Protokollierung */}
        <Card className="border-stone-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-stone-50/50 border-b border-stone-100">
            <CardTitle className="text-lg font-montserrat font-bold text-stone-900 flex items-center gap-2">
              <HistoryIcon size={18} className="text-stone-400" />
              Sicherheit & Protokollierung
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-sm">System-Audit-Logs</h3>
                <p className="text-stone-500 text-xs mt-1">
                  Revisionssichere Einsicht in alle Datenbankänderungen, Buchungsverläufe und Benutzeraktionen.
                </p>
              </div>
              
              <Link to="/admin/audit-logs">
                <Button 
                  className={cn(
                    "gap-2 transition-all h-10 px-4 rounded-xl font-bold flex items-center shadow-sm",
                    "bg-stone-900 text-white hover:bg-stone-800",
                    "dark-admin-btn" // Special class for our hackless dark mode
                  )}
                >
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">Logs einsehen</span>
                  <ChevronRight size={14} />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
