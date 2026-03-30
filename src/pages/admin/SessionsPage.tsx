import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { supabase } from "../../lib/supabase";
import { useToast } from "../../hooks/use-toast";
import { Plus, Edit2, Trash2, Calendar } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { cn } from "../../lib/utils";

interface SessionType {
  id: string;
  name: string;
}

interface Session {
  id: string;
  session_type_id: string;
  title: string | null;
  description: string | null;
  start_time: string;
  end_time: string;
  max_slots: number;
  price: number | null;
  status: 'open' | 'fully_booked' | 'canceled' | 'completed';
  session_types?: SessionType;
}

export default function SessionsPage() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [types, setTypes] = useState<SessionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [typeId, setTypeId] = useState("");
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [maxSlots, setMaxSlots] = useState(1);
  const [status, setStatus] = useState<'open' | 'fully_booked' | 'canceled' | 'completed'>('open');
  
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Fetch types for selection
    const { data: typeData } = await supabase.from("session_types").select("id, name");
    setTypes(typeData || []);

    // Fetch sessions with type info
    const { data: sessionData, error } = await supabase
      .from("sessions")
      .select("*, session_types(id, name)")
      .order("start_time", { ascending: true });

    if (error) {
      toast({ title: "Fehler beim Laden", description: error.message, variant: "destructive" });
    } else {
      setSessions(sessionData || []);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      session_type_id: typeId,
      title: title || null,
      start_time: new Date(startTime).toISOString(),
      end_time: new Date(endTime).toISOString(),
      max_slots: maxSlots,
      status,
    };

    if (editingId) {
      const { error } = await supabase.from("sessions").update(payload).eq("id", editingId);
      if (error) {
        toast({ title: "Fehler beim Bearbeiten", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Termin aktualisiert", description: "Speicherung erfolgreich." });
        resetForm();
        fetchData();
      }
    } else {
      const { error } = await supabase.from("sessions").insert([payload]);
      if (error) {
        toast({ title: "Fehler beim Erstellen", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Termin erstellt", description: "Neuer Slot wurde hinzugefügt." });
        resetForm();
        fetchData();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Termin wirklich löschen?")) return;
    const { error } = await supabase.from("sessions").delete().eq("id", id);
    if (error) {
      toast({ title: "Fehler beim Löschen", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Gelöscht", description: "Der Slot wurde entfernt." });
      fetchData();
    }
  };

  const resetForm = () => {
    setTypeId("");
    setTitle("");
    setStartTime("");
    setEndTime("");
    setMaxSlots(1);
    setStatus('open');
    setEditingId(null);
    setIsAdding(false);
  };

  return (
    <AdminLayout>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-montserrat font-bold text-stone-900">Termine & Slots</h1>
          <p className="text-stone-500 mt-1">Verwalten Sie die verfügbaren Zeitfenster für Ihre Patienten.</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="bg-stone-900 text-[#faf8f5] hover:bg-stone-800 gap-2 shadow-md h-11 px-6">
            <Plus size={18} /> Neuer Termin-Slot
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="mb-10 border-stone-200 shadow-sm bg-white">
          <CardHeader className="bg-stone-50/50 border-b border-stone-100">
            <CardTitle className="text-xl font-montserrat text-stone-900 border-stone-100">
              {editingId ? "Slot bearbeiten" : "Neuen Slot definieren"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Behandlungsart</label>
                  <select 
                    value={typeId} 
                    onChange={(e) => setTypeId(e.target.value)}
                    required
                    className="w-full rounded-md border border-stone-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900"
                  >
                    <option value="">Kategorie wählen...</option>
                    {types.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Interner Titel (Optional)</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="z.B. Vormittags-Block" className="border-stone-200" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Startzeitpunkt</label>
                  <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="border-stone-200" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Endzeitpunkt</label>
                  <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="border-stone-200" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Kapazität (Patienten)</label>
                  <Input type="number" value={maxSlots} onChange={(e) => setMaxSlots(parseInt(e.target.value))} min={1} className="border-stone-200" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Status</label>
                  <select 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full rounded-md border border-stone-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900"
                  >
                    <option value="open">Offen</option>
                    <option value="fully_booked">Ausgebucht</option>
                    <option value="canceled">Abgesagt</option>
                    <option value="completed">Abgeschlossen</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-stone-100">
                <Button variant="ghost" type="button" onClick={resetForm}>Abbrechen</Button>
                <Button type="submit" className="bg-stone-900 text-[#faf8f5] hover:bg-stone-800 px-8 font-semibold shadow-sm h-11">Speichern</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50/80 text-stone-500 font-montserrat text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 border-b border-stone-100">Kategorie / Titel</th>
                <th className="px-6 py-4 border-b border-stone-100">Datum & Uhrzeit</th>
                <th className="px-6 py-4 border-b border-stone-100">Status</th>
                <th className="px-6 py-4 border-b border-stone-100">Slots</th>
                <th className="px-6 py-4 border-b border-stone-100 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="text-sm border-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-stone-400 animate-pulse font-medium">Lade Termindaten...</td>
                </tr>
              ) : sessions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-stone-400">Keine aktiven Terminslots gefunden.</td>
                </tr>
              ) : (
                sessions.map((s) => (
                  <tr key={s.id} className="hover:bg-stone-50/50 transition-colors">
                    <td className="px-6 py-4 border-b border-stone-50">
                      <div className="font-bold text-stone-900 font-montserrat">{s.session_types?.name || "Unbekannt"}</div>
                      <div className="text-xs text-stone-500">{s.title || "Standardtermin"}</div>
                    </td>
                    <td className="px-6 py-4 border-b border-stone-50">
                      <div className="flex items-center gap-2 text-stone-700">
                        <Calendar size={14} className="text-stone-300" /> {new Date(s.start_time).toLocaleDateString('de-DE')}
                      </div>
                      <div className="text-xs text-stone-500 mt-1">
                        {new Date(s.start_time).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} - {new Date(s.end_time).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 border-b border-stone-50">
                      <span className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                        s.status === 'open' ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                        s.status === 'canceled' ? "bg-red-50 text-red-700 border border-red-100" :
                        s.status === 'fully_booked' ? "bg-stone-100 text-stone-700 border border-stone-200" :
                        "bg-blue-50 text-blue-700 border border-blue-100"
                      )}>
                        {s.status === 'open' ? "Offen" : s.status === 'canceled' ? "Abgesagt" : s.status === 'fully_booked' ? "Ausgebucht" : "Beendet"}
                      </span>
                    </td>
                    <td className="px-6 py-4 border-b border-stone-50 text-stone-600 font-medium">
                      {s.max_slots > 1 ? s.max_slots : "1 Patient"}
                    </td>
                    <td className="px-6 py-4 border-b border-stone-50 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setEditingId(s.id);
                          setTypeId(s.session_type_id);
                          setTitle(s.title || "");
                          setStartTime(s.start_time.slice(0, 16));
                          setEndTime(s.end_time.slice(0, 16));
                          setMaxSlots(s.max_slots);
                          setStatus(s.status);
                          setIsAdding(true);
                        }} className="h-8 w-8 text-stone-400 hover:text-stone-900 border-stone-100">
                          <Edit2 size={14} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)} className="h-8 w-8 text-stone-400 hover:text-destructive border-stone-100">
                          <Trash2 size={14} />
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
