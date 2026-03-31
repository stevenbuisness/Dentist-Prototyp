import AdminLayout from "./AdminLayout";
import { useToast } from "../../hooks/use-toast";
import { useAllBookings, useUpdateBookingStatus, useBookingsRealtime } from "../../hooks/useBookings";
import {
  User as UserIcon,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

export default function BookingsPage() {
  const { toast } = useToast();
  const { data: bookings = [], isLoading, refetch } = useAllBookings();
  const updateStatus = useUpdateBookingStatus();

  // 🔴 Realtime: auto-refresh whenever bookings/sessions change
  useBookingsRealtime();

  const handleStatusChange = async (
    id: string,
    status: "attended" | "no_show" | "canceled_by_admin"
  ) => {
    updateStatus.mutate(
      { bookingId: id, status },
      {
        onSuccess: () =>
          toast({ title: "Status aktualisiert", description: "Terminstatus wurde geändert." }),
        onError: (err: any) =>
          toast({ title: "Fehler", description: err.message, variant: "destructive" }),
      }
    );
  };

  return (
    <AdminLayout>
      <div className="mb-10 flex items-center justify-between">
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
          className="text-stone-400 hover:text-stone-900"
          title="Aktualisieren"
        >
          <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
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
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-stone-400 font-montserrat">Noch keine Buchungen vorhanden.</td>
                </tr>
              ) : (
                bookings.map((b: any) => (
                  <tr key={b.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 border-b border-stone-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
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
                        b.status?.startsWith("canceled") ? "bg-red-50 text-red-700 border border-red-100" :
                        "bg-stone-100 text-stone-500 border border-stone-200"
                      )}>
                        {b.status === "confirmed" ? "Bestätigt" :
                         b.status === "attended" ? "Erschienen" :
                         b.status === "no_show" ? "Nicht Erschienen" : "Abgesagt"}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-stone-50 text-xs text-stone-400 font-bold uppercase tracking-widest">
                      {new Date(b.booking_time).toLocaleDateString("de-DE")}
                    </td>
                    <td className="px-6 py-4 border-b border-stone-50 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost" size="icon"
                          onClick={() => handleStatusChange(b.id, "attended")}
                          title="Erschienen"
                          disabled={updateStatus.isPending}
                          className="h-8 w-8 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50"
                        >
                          <CheckCircle2 size={16} />
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          onClick={() => handleStatusChange(b.id, "no_show")}
                          title="Nicht Erschienen"
                          disabled={updateStatus.isPending}
                          className="h-8 w-8 text-stone-400 hover:text-stone-600 hover:bg-stone-50"
                        >
                          <AlertCircle size={16} />
                        </Button>
                        <Button
                          variant="ghost" size="icon"
                          onClick={() => handleStatusChange(b.id, "canceled_by_admin")}
                          title="Absagen"
                          disabled={updateStatus.isPending}
                          className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                        >
                          <XCircle size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
