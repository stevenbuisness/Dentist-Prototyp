import AdminLayout from "./AdminLayout";
import { useToast } from "../../hooks/use-toast";
import { useAllBookings, useUpdateBookingStatus, useBookingsRealtime, BookingStatus } from "../../hooks/useBookings";
import {
  User as UserIcon,
  Calendar as CalendarIcon,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  RotateCcw,
  Clock,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";

type TimeFilter = "all" | "today" | "this_week" | "this_month" | "custom";

export default function BookingsPage() {
  const { toast } = useToast();
  const { data: bookings = [], isLoading, refetch } = useAllBookings();
  const updateStatus = useUpdateBookingStatus();
  
  const [dateFilter, setDateFilter] = useState<TimeFilter>("all");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [pendingUpdate, setPendingUpdate] = useState<{ id: string; status: BookingStatus } | null>(null);

  // 🔴 Realtime: auto-refresh whenever bookings/sessions change
  useBookingsRealtime();

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    updateStatus.mutate(
      { bookingId: id, status },
      {
        onSuccess: () =>
          toast({ title: "Status aktualisiert", description: `Terminstatus wurde auf '${getStatusLabel(status)}' geändert.` }),
        onError: (err: any) =>
          toast({ title: "Fehler", description: err.message, variant: "destructive" }),
      }
    );
    setPendingUpdate(null);
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed": return "Bestätigt";
      case "attended": return "Erschienen";
      case "no_show": return "Nicht erschienen";
      case "canceled_by_admin": return "Abgesagt (Admin)";
      case "canceled_by_user": return "Abgesagt (User)";
      default: return status;
    }
  };

  const isFuture = (startTime: string) => {
    return new Date(startTime) > new Date();
  };

  // ── FILTER LOGIC ─────────────────────────────────────────────────────────────
  const filteredBookings = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    return bookings.filter((b: any) => {
      if (!b.session?.start_time) return dateFilter === "all";
      const start = new Date(b.session.start_time);
      const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());

      if (dateFilter === "today") return startDay.getTime() === today.getTime();
      
      if (dateFilter === "this_week") {
        // Start of week (Monday)
        const monday = new Date(today);
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        monday.setDate(diff);
        
        // End of week (Sunday)
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        return startDay >= monday && startDay <= sunday;
      }

      if (dateFilter === "this_month") {
        return start.getMonth() === now.getMonth() && start.getFullYear() === now.getFullYear();
      }

      if (dateFilter === "custom") {
        if (!customRange.start && !customRange.end) return true;
        const startR = customRange.start ? new Date(customRange.start) : null;
        const endR = customRange.end ? new Date(customRange.end) : null;
        
        if (startR) startR.setHours(0, 0, 0, 0);
        if (endR) endR.setHours(23, 59, 59, 999);
        
        return (!startR || start >= startR) && (!endR || start <= endR);
      }

      return true;
    });
  }, [bookings, dateFilter, customRange]);

  return (
    <AdminLayout>
      <div className="mb-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-montserrat font-bold text-stone-900">Patienten-Buchungen</h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live
              </span>
            </div>
            <p className="text-stone-500 mt-1">Überwachen und verwalten Sie alle eingehenden Terminreservierungen.</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            className="text-stone-400 hover:text-stone-900 h-9 w-9 bg-white border border-stone-200 shadow-sm self-end"
            title="Aktualisieren"
          >
            <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
          </Button>
        </div>

        {/* ── FILTER BUTTON ROW ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex p-1 bg-stone-100 rounded-lg border border-stone-200">
            {[
              { id: "all", label: "Alle Termine" },
              { id: "today", label: "Heute" },
              { id: "this_week", label: "Diese Woche" },
              { id: "this_month", label: "Diesen Monat" },
              { id: "custom", label: "Eigener Zeitraum" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setDateFilter(f.id as TimeFilter)}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md transition-all",
                  dateFilter === f.id 
                    ? "bg-white text-stone-900 shadow-sm" 
                    : "text-stone-500 hover:text-stone-700 hover:bg-stone-50/50"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {dateFilter === "custom" && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
              <input 
                type="date" 
                value={customRange.start}
                onChange={(e) => setCustomRange(prev => ({ ...prev, start: e.target.value }))}
                className="bg-white border border-stone-200 rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-stone-900 outline-none" 
              />
              <span className="text-stone-400 text-xs">bis</span>
              <input 
                type="date" 
                value={customRange.end}
                onChange={(e) => setCustomRange(prev => ({ ...prev, end: e.target.value }))}
                className="bg-white border border-stone-200 rounded-md px-3 py-1.5 text-xs focus:ring-1 focus:ring-stone-900 outline-none" 
              />
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50/80 text-stone-500 font-montserrat text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 border-b border-stone-100">Patient / Nachricht</th>
                <th className="px-6 py-4 border-b border-stone-100">Behandlung / Termin</th>
                <th className="px-6 py-4 border-b border-stone-100">Status</th>
                <th className="px-6 py-4 border-b border-stone-100">Buchungszeit</th>
                <th className="px-6 py-4 border-b border-stone-100 text-right">Optionen</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-stone-400 animate-pulse">Lade Buchungsdaten...</td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-stone-400 font-montserrat">
                    <div className="flex flex-col items-center gap-2">
                       <Clock size={32} className="text-stone-200" />
                       <p>Keine Buchungen für diesen Zeitraum gefunden.</p>
                       <Button variant="link" onClick={() => setDateFilter("all")} className="text-xs">Alle Termine anzeigen</Button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b: any) => {
                  const future = isFuture(b.session?.start_time);
                  const isCanceled = b.status?.includes("canceled");

                  return (
                  <tr key={b.id} className={cn(
                    "hover:bg-stone-50/50 transition-colors",
                    (isCanceled || b.status === "no_show") && "opacity-60 bg-stone-50/30"
                  )}>
                    <td className="px-6 py-4 border-b border-stone-50">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-stone-500",
                          b.status === "attended" ? "bg-emerald-100 text-emerald-600" : "bg-stone-100 text-stone-500"
                        )}>
                          <UserIcon size={14} />
                        </div>
                        <div>
                          <div className="font-bold text-stone-900">{b.user?.first_name} {b.user?.last_name}</div>
                          <div className="text-xs text-stone-500">{b.user?.email}</div>
                          {b.notes && <div className="mt-1 text-[10px] italic text-stone-400 line-clamp-1">"{b.notes}"</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-stone-50">
                      <div className="font-medium text-stone-800">{b.session?.session_type?.name || "Unbekannte Behandlung"}</div>
                      <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-1.5 font-bold uppercase tracking-widest text-[#d6d3d1]">
                        <CalendarIcon size={12} className="text-stone-300" />
                        {b.session?.start_time
                          ? new Date(b.session.start_time).toLocaleDateString("de-DE", {
                              day: "2-digit", month: "2-digit", year: "numeric",
                              hour: "2-digit", minute: "2-digit",
                            })
                          : "n.a."}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-stone-50">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                        b.status === "confirmed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                        b.status === "attended" ? "bg-blue-50 text-blue-700 border border-blue-100" :
                        b.status === "no_show" ? "bg-stone-200 text-stone-600 border border-stone-300" :
                        "bg-red-50 text-red-700 border border-red-100"
                      )}>
                        {getStatusLabel(b.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-stone-50 text-xs text-stone-400 font-bold uppercase tracking-widest">
                      {new Date(b.booking_time).toLocaleDateString("de-DE")}
                    </td>
                    <td className="px-6 py-4 border-b border-stone-50 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Menü öffnen</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuLabel>Aktionen</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          
                          {/* PRIMARY ACTIONS based on time */}
                          {!future && b.status !== "attended" && (
                            <DropdownMenuItem 
                              className="text-emerald-600 focus:text-emerald-700 focus:bg-emerald-50"
                              onClick={() => handleStatusChange(b.id, "attended")}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              <span>Erschienen</span>
                            </DropdownMenuItem>
                          )}
                          
                          {!future && b.status !== "no_show" && (
                            <DropdownMenuItem 
                              className="text-stone-600"
                              onClick={() => setPendingUpdate({ id: b.id, status: "no_show" })}
                            >
                              <AlertCircle className="mr-2 h-4 w-4" />
                              <span>Nicht erschienen</span>
                            </DropdownMenuItem>
                          )}

                          {b.status === "confirmed" && (
                             <DropdownMenuItem 
                               className="text-red-600 focus:text-red-700 focus:bg-red-50"
                               onClick={() => setPendingUpdate({ id: b.id, status: "canceled_by_admin" })}
                             >
                               <XCircle className="mr-2 h-4 w-4" />
                               <span>Termin absagen</span>
                             </DropdownMenuItem>
                          )}

                          {/* REVERT ACTIONS */}
                          {(b.status !== "confirmed") && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleStatusChange(b.id, "confirmed")}>
                                <RotateCcw className="mr-2 h-4 w-4" />
                                <span>Rückgängig (Reset)</span>
                              </DropdownMenuItem>
                            </>
                          )}

                          {future && b.status === "confirmed" && (
                            <div className="px-2 py-1.5 text-[10px] text-stone-400 italic">
                               Check-in erst am Termin möglich
                            </div>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!pendingUpdate} onOpenChange={(open) => !open && setPendingUpdate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sind Sie sicher?</AlertDialogTitle>
            <AlertDialogDescription>
              Sie möchten den Status auf <strong>{pendingUpdate ? getStatusLabel(pendingUpdate.status) : ""}</strong> ändern. 
              {pendingUpdate?.status === "canceled_by_admin" && " Der Patient wird über die Absage benachrichtigt."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => pendingUpdate && handleStatusChange(pendingUpdate.id, pendingUpdate.status)}
              className={cn(pendingUpdate?.status === "canceled_by_admin" ? "bg-red-600 hover:bg-red-700" : "")}
            >
              Bestätigen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
