import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { supabase } from "../../lib/supabase";
import { useToast } from "../../hooks/use-toast";
import { 
  User as UserIcon, 
  Calendar as CalendarIcon, 
  CheckCircle2, 
  XCircle, 
  AlertCircle
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

interface Profile {
  first_name: string | null;
  last_name: string | null;
  email: string;
}

interface Session {
  start_time: string;
  session_types?: {
    name: string;
  };
}

interface Booking {
  id: string;
  user_id: string;
  session_id: string;
  status: 'confirmed' | 'canceled_by_user' | 'canceled_by_admin' | 'attended' | 'no_show';
  booking_time: string;
  notes: string | null;
  users: Profile | null;
  sessions: Session | null;
}

export default function BookingsPage() {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    // Join bookings with users (profiles) and sessions (with their types)
    const { data, error } = await supabase
      .from("bookings")
      .select(`
        *,
        users (first_name, last_name, email),
        sessions (
          start_time,
          session_types (name)
        )
      `)
      .order("booking_time", { ascending: false });

    if (error) {
      toast({ title: "Fehler beim Laden", description: error.message, variant: "destructive" });
    } else {
      setBookings(data as any || []);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, newStatus: Booking['status']) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({ title: "Fehler beim Update", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Status aktualisiert", description: "Terminstatus wurde geändert." });
      fetchBookings();
    }
  };

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-montserrat font-bold text-stone-900 border-stone-100">Patienten-Buchungen</h1>
        <p className="text-stone-500 mt-1">Überwachen und verwalten Sie alle eingehenden Terminreservierungen.</p>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden border-stone-100">
        <div className="overflow-x-auto overflow-hidden">
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
            <tbody className="text-sm border-stone-100 overflow-hidden">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-stone-400">Lade Buchungsdaten...</td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-stone-400 font-montserrat">Noch keine Buchungen vorhanden.</td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 border-b border-stone-50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500">
                          <UserIcon size={14} />
                        </div>
                        <div>
                          <div className="font-bold text-stone-900">{b.users?.first_name} {b.users?.last_name}</div>
                          <div className="text-xs text-stone-500 underline-offset-4">{b.users?.email}</div>
                          {b.notes && <div className="mt-1 text-[10px] italic text-stone-400 line-clamp-1">"{b.notes}"</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-stone-50">
                      <div className="font-medium text-stone-800">{b.sessions?.session_types?.name || "Unbekannte Behandlung"}</div>
                      <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-1.5 font-bold uppercase tracking-widest text-[#d6d3d1]">
                        <CalendarIcon size={12} className="text-stone-300" /> 
                        {b.sessions?.start_time ? new Date(b.sessions.start_time).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "n.a."}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-stone-50">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                        b.status === 'confirmed' ? "bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm" :
                        b.status === 'attended' ? "bg-blue-50 text-blue-700 border border-blue-100 shadow-sm" :
                        b.status.startsWith('canceled') ? "bg-red-50 text-red-700 border border-red-100 shadow-sm" :
                        "bg-stone-100 text-stone-500 border border-stone-200 shadow-sm"
                      )}>
                        {b.status === 'confirmed' ? "Bestätigt" : 
                         b.status === 'attended' ? "Erschienen" : 
                         b.status === 'no_show' ? "Nicht Erschienen" : 
                         "Abgesagt"}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-stone-50 text-xs text-stone-400 font-bold uppercase tracking-widest">
                      {new Date(b.booking_time).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-6 py-4 border-b border-stone-50 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => updateStatus(b.id, 'attended')}
                          title="Erschienen"
                          className="h-8 w-8 text-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 shadow-sm"
                        >
                          <CheckCircle2 size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => updateStatus(b.id, 'no_show')}
                          title="Nicht Erschienen"
                          className="h-8 w-8 text-stone-400 hover:text-stone-600 hover:bg-stone-50 shadow-sm"
                        >
                          <AlertCircle size={16} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => updateStatus(b.id, 'canceled_by_admin')}
                          title="Absagen"
                          className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 shadow-sm"
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
