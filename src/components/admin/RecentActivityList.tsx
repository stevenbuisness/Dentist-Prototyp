import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  PlusCircle, 
  UserCheck,
  ClipboardList
} from "lucide-react";
import { cn } from "../../lib/utils";
import { formatDistanceToNow } from "date-fns";
import { de } from "date-fns/locale";

interface Activity {
  id: string;
  action: string;
  entity_id: string;
  created_at: string;
  actor: {
    first_name: string | null;
    last_name: string | null;
    role: string;
  } | null;
  booking: {
    id: string;
    user: {
      first_name: string | null;
      last_name: string | null;
    } | null;
    session: {
      start_time: string;
      session_type: {
        name: string;
      } | null;
    } | null;
  } | null;
}

interface RecentActivityListProps {
  activities: Activity[];
  isLoading?: boolean;
}

export function RecentActivityList({ activities, isLoading }: RecentActivityListProps) {
  const [filter, setFilter] = useState<'all' | 'admin' | 'patient'>('all');

  const filteredActivities = activities.filter(activity => {
    if (filter === 'all') return true;
    return activity.actor?.role === filter;
  });

  const getActionConfig = (action: string) => {
    switch (action) {
      case "created":
        return {
          label: "Neu gebucht",
          icon: PlusCircle,
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-100"
        };
      case "confirmed":
        return {
          label: "Bestätigt",
          icon: CheckCircle2,
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          border: "border-emerald-100"
        };
      case "canceled_by_user":
      case "canceled_by_admin":
        return {
          label: "Storniert",
          icon: XCircle,
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-100"
        };
      case "attended":
        return {
          label: "Erschienen",
          icon: UserCheck,
          color: "text-emerald-600",
          bg: "bg-emerald-100",
          border: "border-emerald-200"
        };
      case "no_show":
        return {
          label: "Nicht erschienen",
          icon: AlertCircle,
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-100"
        };
      case "treatment_recorded":
        return {
          label: "Dokumentiert",
          icon: ClipboardList,
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-100"
        };
      default:
        return {
          label: action,
          icon: Clock,
          color: "text-stone-600",
          bg: "bg-stone-50",
          border: "border-stone-100"
        };
    }
  };

  return (
    <Card className="border-stone-200 shadow-sm bg-white overflow-hidden flex flex-col h-full">
      <CardHeader className="border-b border-stone-50 bg-stone-50/50 flex flex-row items-center justify-between py-3">
        <CardTitle className="text-[10px] font-montserrat font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
          <Clock size={14} /> Neuste Aktivitäten
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setFilter('all')}
            className={cn(
              "h-6 px-2 text-[9px] uppercase font-bold transition-all",
              filter === 'all' ? "bg-stone-900 text-white hover:bg-stone-800" : "text-stone-400 hover:text-stone-900"
            )}
          >
            Alle
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setFilter('admin')}
            className={cn(
              "h-6 px-2 text-[9px] uppercase font-bold transition-all",
              filter === 'admin' ? "bg-amber-500 text-white hover:bg-amber-600" : "text-stone-400 hover:text-stone-900"
            )}
          >
            Admin
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setFilter('patient')}
            className={cn(
              "h-6 px-2 text-[9px] uppercase font-bold transition-all",
              filter === 'patient' ? "bg-emerald-500 text-white hover:bg-emerald-600" : "text-stone-400 hover:text-stone-900"
            )}
          >
            Patient
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-y-auto max-h-[850px] scrollbar-thin scrollbar-thumb-stone-100">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-stone-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-stone-100 rounded w-3/4" />
                  <div className="h-3 bg-stone-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-10 opacity-40">
            <Calendar size={40} className="mx-auto mb-3 text-stone-300" />
            <p className="text-sm italic">Bisher keine Aktivitäten</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line (Pixel-Perfect Alignment: 16px padding + 18px half-width of icon) */}
            <div className="absolute left-[34px] top-0 bottom-0 w-px bg-stone-200 hidden sm:block" />
            
            <div className="space-y-0">
              {filteredActivities.map((activity) => {
                const config = getActionConfig(activity.action);
                const roleLabel = activity.actor?.role === 'admin' ? 'Admin' : 'Patient';
                
                const patientName = activity.booking?.user 
                  ? `${activity.booking.user.first_name || ''} ${activity.booking.user.last_name || ''}`.trim()
                  : "Unbekannt";

                return (
                  <div key={activity.id} className="p-4 hover:bg-stone-50/10 transition-colors group relative">
                    <div className="flex gap-6 relative z-10">
                      <div className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 bg-white shadow-sm transition-all group-hover:scale-110 group-hover:shadow-md",
                        config.color, config.border
                      )}>
                        <config.icon size={16} />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-[0.1em] flex items-center gap-2",
                            activity.actor?.role === 'admin' ? "text-amber-500" : "text-emerald-500"
                          )}>
                            <div className={cn(
                              "w-1.5 h-1.5 rounded-full shrink-0",
                              activity.actor?.role === 'admin' ? "bg-amber-500" : "bg-emerald-500"
                            )} />
                            {roleLabel}
                          </span>
                          <span className="text-[9px] text-stone-400 font-bold bg-stone-100/80 px-2 py-0.5 rounded-full border border-stone-100">
                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true, locale: de })}
                          </span>
                        </div>
                        
                        <div className="text-sm font-bold text-stone-900 group-hover:text-stone-950 transition-colors truncate">
                          <span className="text-stone-400 font-medium">{config.label === "Neu gebucht" ? "Buchung" : config.label}:</span> {patientName}
                        </div>
                        
                        {activity.booking?.session && (
                          <div className="mt-2 flex items-center gap-3">
                            <Badge variant="outline" className="text-[9px] py-0 px-2 h-4 bg-white border-stone-200 text-stone-500 font-bold uppercase tracking-tighter">
                              {activity.booking.session.session_type?.name}
                            </Badge>
                            <span className="text-[10px] text-stone-400 font-medium flex items-center gap-1.5">
                              <Calendar size={10} className="text-stone-300" />
                              {new Date(activity.booking.session.start_time).toLocaleDateString("de-DE", { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
