import { useState, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import { supabase } from "../../lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../hooks/use-toast";
import {
  User as UserIcon,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
  X,
  Info,
  Edit2,
  Trash2,
  Save,
  RotateCcw,
  Archive,
  Users,
  UserPlus,
  Trash,
  ChevronRight,
  Loader2,
  Clock,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";
import { cn } from "../../lib/utils";

interface Patient {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string;
  phone_number: string | null;
  address_line_1: string | null;
  post_code: string | null;
  city: string | null;
  date_of_birth: string | null;
  created_at: string;
  deleted_at: string | null;
}

function usePatients(showTrash: boolean) {
  return useQuery({
    queryKey: ["clients", showTrash],
    queryFn: async () => {
      let query = supabase
        .from("users")
        .select("*")
        .neq("role", "admin");
      
      if (showTrash) {
        query = query.not("deleted_at", "is", null);
      } else {
        query = query.is("deleted_at", null);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) throw error;
      return data as Patient[];
    },
  });
}

function useTodayAppointments() {
    return useQuery({
      queryKey: ["today-appointments-count"],
      queryFn: async () => {
        const today = new Date().toISOString().split("T")[0];
        const { count, error } = await supabase
          .from("bookings")
          .select("id, session:sessions!inner(start_time)", { count: "exact", head: true })
          .eq("session.start_time", today)
          .neq("status", "canceled_by_user")
          .neq("status", "canceled_by_admin");
        if (error) throw error;
        return count || 0;
      }
    });
}

function useUpdatePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Patient> & { id: string }) => {
      const { id, ...updates } = payload;
      const { error } = await supabase.from("users").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}

function useSoftDeletePatient() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, restore = false }: { id: string; restore?: boolean }) => {
      const { error } = await supabase
        .from("users")
        .update({ deleted_at: restore ? null : new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}

export default function ClientsPage() {
  const { toast } = useToast();
  const [showTrash, setShowTrash] = useState(false);
  const { data: patients = [], isLoading } = usePatients(showTrash);
  const { data: todayAppsCount = 0 } = useTodayAppointments();
  const updatePatient = useUpdatePatient();
  const deletePatient = useSoftDeletePatient();
  
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Patient>>({});

  const stats = useMemo(() => ({
    total: patients.length,
    newThisWeek: patients.filter(p => {
        const d = new Date(p.created_at);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return d > weekAgo;
    }).length,
    active: patients.filter(p => !p.deleted_at).length,
  }), [patients]);

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.first_name?.toLowerCase().includes(q) ||
      p.last_name?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q)
    );
  });

  const handleEdit = (p: Patient) => {
    setSelectedPatient(p);
    setEditForm(p);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (!selectedPatient) return;
    updatePatient.mutate(
      { id: selectedPatient.id, ...editForm },
      {
        onSuccess: () => {
          toast({ title: "Gespeichert", description: "Patientendaten wurden aktualisiert." });
          setIsEditing(false);
          setSelectedPatient(prev => prev ? { ...prev, ...editForm } : null);
        },
        onError: (err: any) => toast({ title: "Fehler", description: err.message, variant: "destructive" }),
      }
    );
  };

  const handleDelete = (p: Patient) => {
    const isPermanent = !!p.deleted_at;
    if (!confirm(isPermanent ? "Patient endgültig aus dem Papierkorb löschen?" : "Patient wirklich in den Papierkorb verschieben?")) return;
    
    deletePatient.mutate(
      { id: p.id },
      {
        onSuccess: () => {
          toast({ title: isPermanent ? "Gelöscht" : "Archiviert", variant: isPermanent ? "destructive" : "default" });
          setSelectedPatient(null);
        },
      }
    );
  };

  const handleRestore = (p: Patient) => {
    deletePatient.mutate(
      { id: p.id, restore: true },
      {
        onSuccess: () => {
          toast({ title: "Wiederhergestellt", description: "Patient ist wieder aktiv." });
          setSelectedPatient(null);
        },
      }
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-4xl font-montserrat font-bold text-stone-900 tracking-tight">Patientenverwaltung</h1>
          <p className="text-stone-500 mt-1">Zentrale Patientendatenbank & Archivierung.</p>
        </div>

        {/* 1. Metrics Grid (Reduced to 3 columns - Trash card removed) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border-stone-200 shadow-sm transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-stone-900 flex items-center justify-center text-white shadow-lg">
                  <Users size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Patienten</p>
                  <p className="text-2xl font-bold text-stone-900">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-stone-200 shadow-sm transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/10">
                  <Clock size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Termine Heute</p>
                  <p className="text-2xl font-bold text-stone-900">{todayAppsCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-stone-200 shadow-sm transition-all hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-stone-100 flex items-center justify-center text-stone-500">
                  <UserPlus size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Neu (7T)</p>
                  <p className="text-2xl font-bold text-stone-900">{stats.newThisWeek}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2. Cohesive Filter Bar (Trash text replaced with Papierkorb only) */}
        <div className="bg-white p-2 border border-stone-200 rounded-2xl shadow-sm flex flex-col md:flex-row items-center gap-4">
          <div className="flex bg-stone-50 p-1.5 rounded-xl flex-1 md:flex-none">
             <button onClick={() => setShowTrash(false)} 
               className={cn("px-6 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2", !showTrash ? "bg-white text-stone-900 shadow-md ring-1 ring-stone-900/5" : "text-stone-400 hover:text-stone-600")}>
               <Users size={14} /> Aktive Liste
             </button>
             <button onClick={() => setShowTrash(true)} 
               className={cn("px-6 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-2", showTrash ? "bg-white text-stone-900 shadow-md ring-1 ring-stone-900/5" : "text-stone-400 hover:text-stone-600")}>
               <Trash2 size={14} /> Papierkorb
             </button>
          </div>
          
          <div className="relative flex-1 group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 transition-colors group-focus-within:text-stone-900" />
            <input
              type="text"
              placeholder="Patienten suchen..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-sm rounded-xl border border-stone-100 bg-stone-50/50 focus:outline-none focus:bg-white focus:ring-1 focus:ring-stone-200 transition-all placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* 3. Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-stone-50/50 text-stone-500 font-montserrat text-[10px] uppercase tracking-[0.2em] font-bold">
                <tr>
                  <th className="px-8 py-6 border-b border-stone-100">Patient / ID</th>
                  <th className="px-8 py-6 border-b border-stone-100">Kontakt</th>
                  <th className="px-8 py-6 border-b border-stone-100 flex-1">Standort</th>
                  <th className="px-8 py-6 border-b border-stone-100 text-right">Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50 text-sm">
                {isLoading ? (
                   Array(3).fill(0).map((_, i) => <tr key={i}><td colSpan={4} className="h-20 animate-pulse bg-stone-50/20"></td></tr>)
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-32 text-center">
                       <div className="max-w-xs mx-auto space-y-4">
                        <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto text-stone-200">
                           <Archive size={32} />
                        </div>
                        <h3 className="font-montserrat font-bold text-stone-900">Nichts gefunden</h3>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((p) => (
                    <tr key={p.id} onClick={() => setSelectedPatient(p)} className="hover:bg-stone-50/80 transition-all cursor-pointer group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-500 flex items-center justify-center font-bold border border-stone-200 group-hover:bg-stone-900 group-hover:text-white transition-all">
                            {(p.first_name?.[0] || "?").toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-stone-900">{p.first_name} {p.last_name}</div>
                            <div className="text-[10px] text-stone-400 font-mono tracking-tighter">#{p.id.slice(0, 13)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-stone-600">
                           <Mail size={12} className="text-stone-300" /> {p.email}
                        </div>
                        {p.phone_number && <div className="text-[11px] text-stone-400 mt-0.5">{p.phone_number}</div>}
                      </td>
                      <td className="px-8 py-5">
                         <div className="text-stone-700 font-medium">{p.city || "—"}</div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <Button variant="ghost" size="sm" className="w-10 h-10 p-0 rounded-xl hover:bg-stone-900 hover:text-white transition-all">
                          <ChevronRight size={18} />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Slide-Over Panel */}
      <div className={cn(
        "fixed inset-0 z-50 transition-colors duration-500 pointer-events-none",
        selectedPatient ? "bg-stone-900/60 pointer-events-auto backdrop-blur-sm" : "bg-transparent pointer-events-none"
      )} onClick={() => { setSelectedPatient(null); setIsEditing(false); }}>
        <div className={cn(
          "absolute right-0 top-0 bottom-0 w-full max-w-xl bg-[#faf8f5] shadow-2xl transition-transform duration-500 flex flex-col transform",
          selectedPatient ? "translate-x-0" : "translate-x-full"
        )} onClick={e => e.stopPropagation()}>
          
          <div className="p-8 border-b border-stone-200 bg-white flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-4">
               <div className="p-3 bg-stone-900 rounded-2xl text-white">
                  <Info size={24} />
               </div>
               <div>
                  <h2 className="text-2xl font-montserrat font-bold text-stone-900">Info</h2>
                  <p className="text-xs text-stone-400 font-bold uppercase tracking-widest mt-0.5">Patientendetails</p>
               </div>
            </div>
            <button onClick={() => { setSelectedPatient(null); setIsEditing(false); }} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-stone-100 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            {selectedPatient && (
              <>
                <div className="flex flex-col items-center text-center space-y-4">
                   <div className="w-24 h-24 rounded-[1.5rem] bg-stone-900 border-[4px] border-white text-white flex items-center justify-center text-4xl font-bold shadow-xl">
                      {(selectedPatient.first_name?.[0] || "?").toUpperCase()}
                   </div>
                   <div>
                      <h3 className="text-2xl font-montserrat font-bold text-stone-900">{selectedPatient.first_name} {selectedPatient.last_name}</h3>
                      <p className="text-xs text-stone-400 font-medium">Registriert am {new Date(selectedPatient.created_at).toLocaleDateString("de-DE")}</p>
                   </div>
                </div>

                {isEditing ? (
                  <div className="bg-white p-8 rounded-3xl border border-stone-100 shadow-sm space-y-6">
                    <h4 className="font-bold text-stone-900 flex items-center gap-2">
                       <Edit2 size={16} /> Daten aktualisieren
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 font-bold uppercase text-[10px] text-stone-500">
                        <label>Vorname</label>
                        <Input value={editForm.first_name || ""} onChange={e => setEditForm({...editForm, first_name: e.target.value})} className="h-11 bg-stone-50/50" />
                      </div>
                      <div className="space-y-1.5 font-bold uppercase text-[10px] text-stone-500">
                        <label>Nachname</label>
                        <Input value={editForm.last_name || ""} onChange={e => setEditForm({...editForm, last_name: e.target.value})} className="h-11 bg-stone-50/50" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 font-bold uppercase text-[10px] text-stone-500">
                        <label>Telefon</label>
                        <Input value={editForm.phone_number || ""} onChange={e => setEditForm({...editForm, phone_number: e.target.value})} className="h-11 bg-stone-50/50" />
                      </div>
                      <div className="space-y-1.5 font-bold uppercase text-[10px] text-stone-500">
                        <label>Geburtsdatum</label>
                        <Input type="date" value={editForm.date_of_birth || ""} onChange={e => setEditForm({...editForm, date_of_birth: e.target.value})} className="h-11 bg-stone-50/50" />
                      </div>
                    </div>
                    <div className="space-y-1.5 font-bold uppercase text-[10px] text-stone-500">
                      <label>Adresse</label>
                      <Input value={editForm.address_line_1 || ""} onChange={e => setEditForm({...editForm, address_line_1: e.target.value})} className="h-11 bg-stone-50/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5 font-bold uppercase text-[10px] text-stone-500">
                         <label>PLZ</label>
                         <Input value={editForm.post_code || ""} onChange={e => setEditForm({...editForm, post_code: e.target.value})} className="h-11 bg-stone-50/50" />
                      </div>
                      <div className="space-y-1.5 font-bold uppercase text-[10px] text-stone-500">
                         <label>Stadt</label>
                         <Input value={editForm.city || ""} onChange={e => setEditForm({...editForm, city: e.target.value})} className="h-11 bg-stone-50/50" />
                      </div>
                    </div>
                    <div className="pt-4 flex gap-3">
                       <Button variant="ghost" className="flex-1 h-12 rounded-xl" onClick={() => setIsEditing(false)}>Abbrechen</Button>
                       <Button className="flex-1 h-12 rounded-xl bg-stone-900 gap-2 font-bold" onClick={handleSave} disabled={updatePatient.isPending}>
                          <Save size={16} /> Speichern
                       </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-10 pb-10">
                    <div className="grid grid-cols-1 gap-6">
                       <section className="space-y-4">
                          <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] border-b border-stone-200 pb-2">Erreichbarkeit</h4>
                          <div className="space-y-3">
                             <div className="p-4 bg-white rounded-2xl border border-stone-100 flex items-center gap-4">
                               <Mail size={16} className="text-stone-300" />
                               <span className="text-sm text-stone-700 font-medium">{selectedPatient.email}</span>
                             </div>
                             <div className="p-4 bg-white rounded-2xl border border-stone-100 flex items-center gap-4">
                               <Phone size={16} className="text-stone-300" />
                               <span className="text-sm text-stone-700 font-medium">{selectedPatient.phone_number || "Nicht hinterlegt"}</span>
                             </div>
                          </div>
                       </section>

                       <section className="space-y-4">
                          <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] border-b border-stone-200 pb-2">Anschrift</h4>
                          <div className="p-6 bg-white rounded-2xl border border-stone-100 flex gap-4">
                             <MapPin size={24} className="text-stone-300 flex-shrink-0" />
                             <div className="text-sm">
                                <p className="font-bold text-stone-900 text-base">{selectedPatient.address_line_1 || "Keine Adresse"}</p>
                                <p className="text-stone-500 font-medium">{selectedPatient.post_code} {selectedPatient.city}</p>
                             </div>
                          </div>
                       </section>
                    </div>

                    {/* Action Bar with "Löschen" button restricted to this info view only */}
                    <div className="bg-stone-900 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden">
                        <div className="text-white text-center sm:text-left">
                           <p className="text-xs font-bold uppercase tracking-widest opacity-40">Verwaltung</p>
                           <p className="text-base font-bold mt-1">Status für diesen Patienten</p>
                        </div>
                        <div className="flex gap-3 w-full sm:w-auto">
                           <Button variant="outline" onClick={() => handleEdit(selectedPatient)} className="flex-1 sm:flex-none h-14 px-8 rounded-2xl bg-white border-0 text-stone-900 font-bold hover:bg-stone-50 gap-2">
                              <Edit2 size={16} /> Bearbeiten
                           </Button>
                           {selectedPatient.deleted_at ? (
                              <Button onClick={() => handleRestore(selectedPatient)} className="flex-1 sm:flex-none h-14 px-8 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 gap-2">
                                 <RotateCcw size={16} /> Wiederherstellen
                              </Button>
                           ) : (
                              <Button onClick={() => handleDelete(selectedPatient)} className="flex-1 sm:flex-none h-14 px-8 rounded-2xl bg-red-400/10 text-red-400 border border-red-400/20 font-bold hover:bg-red-400 hover:text-white gap-2 transition-all">
                                 <Trash2 size={16} /> Löschen
                              </Button>
                           )}
                        </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
