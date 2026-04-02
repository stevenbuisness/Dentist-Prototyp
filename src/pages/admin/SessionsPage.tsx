import { useState, useEffect, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import { useToast } from "../../hooks/use-toast";
import { supabase } from "../../lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  useSessionTypes,
  useSessions,
  useCreateSession,
  useUpdateSession,
  useDeleteSession,
} from "../../hooks/useSessions";
import { useUpdateBooking, useCreateBooking } from "../../hooks/useBookings";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ClipboardList, 
  Sparkles, 
  Search, 
  MoreVertical, 
  Timer,
  UserPlus
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";
import { cn } from "../../lib/utils";
import { Badge } from "../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

type SessionStatus = "open" | "fully_booked" | "canceled" | "completed";
type TabType = "todo" | "today" | "upcoming" | "history";

export default function SessionsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: types = [] } = useSessionTypes();
  const { data: sessions = [], isLoading } = useSessions({ ascending: true });
  const createSession = useCreateSession();
  const updateSession = useUpdateSession();
  const deleteSession = useDeleteSession();
  const createBooking = useCreateBooking();

  const { data: adminPatients = [] } = useQuery({
    queryKey: ["admin_clients_lookup"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, first_name, last_name, email")
        .neq("role", "admin")
        .is("deleted_at", null);
      if (error) throw error;
      return data;
    }
  });

  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<TabType>("todo");
  const [searchQuery, setSearchQuery] = useState("");

  // Documentation Logic
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedSessionToComplete, setSelectedSessionToComplete] = useState<string | null>(null);
  const [selectedSessionData, setSelectedSessionData] = useState<any>(null);
  const [docNotes, setDocNotes] = useState("");
  const updateBooking = useUpdateBooking();
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [patientSearchQuery, setPatientSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCreatingPatient, setIsCreatingPatient] = useState(false);
  const [newPatientForm, setNewPatientForm] = useState({ first_name: "", last_name: "", email: "", phone_number: "", address_line_1: "", post_code: "", city: "" });

  const createPatient = useMutation({
    mutationFn: async (payload: any) => {
      const tempId = globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);
      const { data, error } = await supabase.from("users").insert({ 
        id: tempId,
        first_name: payload.first_name, 
        last_name: payload.last_name, 
        role: "patient",
        email: payload.email || null,
        phone_number: payload.phone_number || null,
        address_line_1: payload.address_line_1 || null,
        post_code: payload.post_code || null,
        city: payload.city || null
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin_clients_lookup"] });
      setPatientSearchQuery(`${data.first_name} ${data.last_name}`);
      setSelectedPatientId(data.id);
      setTitle("");
      setIsCreatingPatient(false);
      setNewPatientForm({ first_name: "", last_name: "", email: "", phone_number: "", address_line_1: "", post_code: "", city: "" });
      toast({ title: "Patient angelegt!" });
    },
    onError: (err: any) => toast({ title: "Fehler beim Anlegen", description: err.message, variant: "destructive" })
  });

  const filteredPatients = useMemo(() => {
     if (!patientSearchQuery) return adminPatients;
     return adminPatients.filter((p: any) => `${p.first_name} ${p.last_name}`.toLowerCase().includes(patientSearchQuery.toLowerCase()));
  }, [adminPatients, patientSearchQuery]);

  const handlePatientSearch = (val: string) => {
     setPatientSearchQuery(val);
     setShowDropdown(true);
     const found = adminPatients.find((p: any) => `${p.first_name} ${p.last_name}`.toLowerCase() === val.toLowerCase());
     if (found && `${found.first_name} ${found.last_name}` === val) {
         setSelectedPatientId(found.id);
         setTitle("");
     } else {
         setSelectedPatientId("");
         setTitle(val);
     }
  };

  const handleSelectPatient = (p: any) => {
      setPatientSearchQuery(`${p.first_name} ${p.last_name}`);
      setSelectedPatientId(p.id);
      setTitle("");
      setShowDropdown(false);
  };

  const [isAdding, setIsAdding] = useState(false);
  const [typeId, setTypeId] = useState("");
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [maxSlots, setMaxSlots] = useState(1);
  const [status, setStatus] = useState<SessionStatus>("open");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Grouping and Filtering
  const filteredData = useMemo(() => {
    const now = new Date();
    
    const searchFilter = (s: any) => {
        if (!searchQuery) return true;
        const patientName = s.bookings?.[0]?.user?.last_name || "";
        const typeName = s.session_type?.name || "";
        const sessionTitle = s.title || "";
        return patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
               typeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
               sessionTitle.toLowerCase().includes(searchQuery.toLowerCase());
    };

    if (activeTab === "todo") {
        return sessions.filter(s => {
            const isPast = new Date(s.end_time) < now;
            const hasBooking = (s.bookings || []).length > 0;
            const needsNotes = hasBooking && !s.bookings[0].notes;
            return isPast && needsNotes && searchFilter(s);
        });
    }

    if (activeTab === "today") {
        const todayStr = now.toDateString();
        return sessions.filter(s => new Date(s.start_time).toDateString() === todayStr && searchFilter(s));
    }

    if (activeTab === "upcoming") {
        return sessions.filter(s => new Date(s.start_time) > now && searchFilter(s));
    }

    if (activeTab === "history") {
        return sessions.filter(s => new Date(s.start_time) < now && (s.status === "completed" || s.bookings?.[0]?.notes) && searchFilter(s));
    }

    return sessions.filter(searchFilter);
  }, [sessions, activeTab, searchQuery]);

  const stats = useMemo(() => {
    const now = new Date();
    const todo = sessions.filter(s => new Date(s.end_time) < now && (s.bookings || []).length > 0 && !s.bookings?.[0]?.notes).length;
    const today = sessions.filter(s => new Date(s.start_time).toDateString() === now.toDateString()).length;
    const upcoming = sessions.filter(s => new Date(s.start_time) > now).length;
    const history = sessions.filter(s => new Date(s.start_time) < now && (s.status === "completed" || s.bookings?.[0]?.notes)).length;
    return { todo, today, upcoming, history };
  }, [sessions]);

  const availableSlots = useMemo(() => {
    if (!selectedDate) return [];
    const selectedType = (types as any[]).find(t => t.id === typeId);
    
    const startHour = 8;
    const endHour = 18;
    const durationMin = selectedType ? selectedType.duration : 30;
    const slots = [];
    
    for (let h = startHour; h < endHour; h++) {
        for (let m = 0; m < 60; m += 30) {
            slots.push(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`);
        }
    }
    
    return slots.map(timeStr => {
        const slotStart = new Date(`${selectedDate}T${timeStr}:00`);
        const slotEnd = new Date(slotStart.getTime() + durationMin * 60000);
        
        if (slotEnd > new Date(`${selectedDate}T18:00:00`)) {
            return { time: timeStr, disabled: true, reason: "Feierabend" };
        }

        const now = new Date();
        if (slotStart < now) {
            return { time: timeStr, disabled: true, reason: "Vergangen" };
        }
        
        const conflict = sessions.find((s: any) => {
            if (s.id === editingId) return false;
            const sStart = new Date(s.start_time);
            const sEnd = new Date(s.end_time);
            return slotStart < sEnd && slotEnd > sStart;
        });
        
        return { time: timeStr, disabled: !!conflict, reason: conflict ? "Belegt" : null };
    });
  }, [typeId, selectedDate, types, sessions, editingId]);

  const resetForm = () => {
    setTypeId(""); setTitle(""); setSelectedDate(new Date().toISOString().slice(0, 10)); setSelectedTime("");
    setMaxSlots(1); setStatus("open"); setEditingId(null); setIsAdding(false); setSelectedPatientId(""); setPatientSearchQuery("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime) {
      toast({ title: "Fehler", description: "Bitte wähle eine freie Uhrzeit aus.", variant: "destructive" });
      return;
    }
    if (!editingId && !selectedPatientId && !title) {
      toast({ title: "Fehler", description: "Bitte wähle einen Patienten aus oder gib einen Gast-Namen ein.", variant: "destructive" });
      return;
    }
    
    const startObj = new Date(`${selectedDate}T${selectedTime}:00`);
    const selectedType = (types as any[]).find(t => t.id === typeId);
    if (!selectedType) return;
    
    const endObj = new Date(startObj.getTime() + selectedType.duration * 60000);

    const payload = {
      session_type_id: typeId,
      title: title || null,
      start_time: startObj.toISOString(),
      end_time: endObj.toISOString(),
      max_slots: maxSlots,
      status,
    };

    if (editingId) {
      updateSession.mutate({ id: editingId, ...payload }, {
        onSuccess: () => { toast({ title: "Termin aktualisiert" }); resetForm(); },
        onError: (err: any) => toast({ title: "Fehler", description: err.message, variant: "destructive" }),
      });
    } else {
      createSession.mutate(payload, {
        onSuccess: (newSession: any) => { 
          if (selectedPatientId) {
            createBooking.mutate({
               session_id: newSession.id,
               user_id: selectedPatientId,
               notes: ""
            }, {
               onSuccess: () => { toast({ title: "Termin erfolgreich angelegt!" }); resetForm(); },
               onError: (err: any) => toast({ title: "Termin erstellt, aber Patientenzuweisung fehlgeschlagen", description: err.message, variant: "destructive" })
            });
          } else {
             toast({ title: "Gast-Termin erstellt" }); 
             resetForm(); 
          }
        },
        onError: (err: any) => toast({ title: "Fehler", description: err.message, variant: "destructive" }),
      });
    }
  };

  const openDocumentation = (session: any) => {
    const booking = session.bookings?.[0];
    if (booking) {
      setSelectedBooking(booking);
      setSelectedSessionToComplete(session.id);
      setSelectedSessionData(session);
      setDocNotes(booking.notes || "");
    } else {
      toast({ title: "Keine Buchung", description: "Für diesen Termin liegt keine Patientenbuchung vor.", variant: "destructive" });
    }
  };

  const handleSaveDoc = () => {
    if (!selectedBooking) return;
    updateBooking.mutate({
      id: selectedBooking.id,
      notes: docNotes,
      status: "attended"
    }, {
      onSuccess: () => {
        if (selectedSessionToComplete) {
            updateSession.mutate({ id: selectedSessionToComplete, status: 'completed' });
        }
        toast({ title: "Dokumentation gespeichert", description: "Der Termin wurde als erledigt markiert." });
        setSelectedBooking(null);
        setSelectedSessionToComplete(null);
      },
      onError: (err: any) => toast({ title: "Fehler", description: err.message, variant: "destructive" })
    });
  };

  const templates = [
    { label: "Routine-Kontrolle", text: "01, VIPr. Gesamtbefund unauffällig. Keine pathologischen Veränderungen der Mundschleimhaut. PA-Befund altersentsprechend unauffällig. Nächste Kontrolle in 6 Monaten." },
    { label: "PZR (Prophylaxe)", text: "PZR durchgeführt. Supragingivale Beläge und Konkremente entfernt. Airflow, Politur und Fluoridierung. Individuelle Mundhygieneinstruktion (Zahnseide/Interdentalbürsten)." },
    { label: "Füllungstherapie", text: "Kariesentfernung unter lokaler Anästhesie. Absolute Trockenlegung. Schmelz-Dentin-Adhäsivtechnik. Mehrschichtige Kompositfüllung gelegt, ausgearbeitet und poliert." },
    { label: "Schmerzbehandlung", text: "Patient klagt über akute Schmerzen. Sensibilitätstest: positiv. Perkussionstest: negativ. Röntgenaufnahme (Zahn X) o.B. Symptomatische Therapie, Aufklärung über weiteres Vorgehen." },
    { label: "Röntgen (OPG / ZR)", text: "Diagnostische Röntgenaufnahme angefertigt. Rechtfertigende Indikation gestellt. Keine Kariesrezidive oder apikale Aufhellungen erkennbar." },
    { label: "Parodontitis-Therapie", text: "Geschlossene PA-Behandlung (AIT). Subgingivales Scaling und Root Planing unter Lokalanästhesie. Spülung mit CHX. Patient über Heilungsverlauf aufgeklärt." },
    { label: "Beratung", text: "Ausführliche Beratung hinsichtlich prothetischer/implantologischer Versorgungsoptionen. Heil- und Kostenplan (HKP) zur Vorlage bei der Krankenkasse wird erstellt." },
    { label: "Zahnentfernung (Extraktion)", text: "Lokalanästhesie. Zahn schonend extrahiert. Wunde gesäubert, Blutung steht. Nahtversorgung. Verhalten nach Zahnextraktion ausführlich besprochen." }
  ];

  const handleEditSession = (session: any) => {
    setEditingId(session.id); 
    setTypeId(session.session_type_id); 
    setTitle(session.title || "");
    const st = new Date(session.start_time);
    setSelectedDate(st.toISOString().slice(0, 10));
    setSelectedTime(`${st.getHours().toString().padStart(2, '0')}:${st.getMinutes().toString().padStart(2, '0')}`);
    
    // Attempt to map an existing booking to 'patientSearchQuery' and ID
    if (session.bookings && session.bookings.length > 0 && session.bookings[0].user) {
        const u = session.bookings[0].user;
        setPatientSearchQuery(`${u.first_name} ${u.last_name}`);
        setSelectedPatientId(u.id);
        setTitle(""); // Reset title if patient is active
    } else {
        setPatientSearchQuery(session.title || "");
        setSelectedPatientId("");
    }
    
    setMaxSlots(session.max_slots); 
    setStatus(session.status); 
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSessionRow = (session: any) => (
    <SessionRow 
        key={session.id} 
        session={session} 
        onDocument={() => openDocumentation(session)} 
        onEdit={() => handleEditSession(session)}
        onDelete={() => { if(confirm("Löschen?")) deleteSession.mutate(session.id) }}
    />
  );

  return (
    <AdminLayout>
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <Badge className="bg-stone-900/5 text-stone-500 border-none px-3 py-1 text-[10px] uppercase tracking-widest font-bold mb-2">Management</Badge>
          <h1 className="text-4xl font-montserrat font-black text-stone-900 tracking-tight">Sitzungszentrale</h1>
          <p className="text-stone-500 font-medium max-w-lg">Dokumentieren Sie abgeschlossene Termine und verwalten Sie neue Zeitfenster.</p>
        </div>
        <div className="flex gap-3">
          {!isAdding && (
            <Button onClick={() => setIsAdding(true)} className="bg-stone-900 text-white hover:bg-stone-800 gap-2 shadow-xl shadow-stone-200 h-14 px-8 rounded-2xl font-bold group">
              <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Neuer Termin
            </Button>
          )}
        </div>
      </div>

      <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex bg-stone-100 p-1.5 rounded-2xl w-full sm:w-auto overflow-x-auto scroolbar-hide">
            <TabButton active={activeTab === "todo"} onClick={() => setActiveTab("todo")} label="Ausstehend" count={stats.todo} color="red" />
            <TabButton active={activeTab === "today"} onClick={() => setActiveTab("today")} label="Heute" count={stats.today} color="blue" />
            <TabButton active={activeTab === "upcoming"} onClick={() => setActiveTab("upcoming")} label="Kommend" count={stats.upcoming} />
            <TabButton active={activeTab === "history"} onClick={() => setActiveTab("history")} label="Historie" count={stats.history} />
        </div>

        <div className="relative w-full sm:w-72 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-stone-900 transition-colors" size={18} />
            <Input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Patient oder Behandlung..." 
                className="pl-12 h-14 bg-white border-stone-200 rounded-2xl shadow-sm focus:ring-0 focus:border-stone-900 transition-all text-sm font-medium"
            />
        </div>
      </div>

      {isAdding && (
        <Card className="mb-10 border-stone-200 shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500">
          <CardHeader className="bg-stone-50 border-b border-stone-100 px-8 py-6 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-black text-stone-900">
              {editingId ? "Termin bearbeiten" : "Neuer Termin"}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setIsAdding(false)} className="rounded-full"><AlertCircle size={20} /></Button>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1">Behandlungsart</label>
                  <select value={typeId} onChange={(e) => setTypeId(e.target.value)} required
                    className="w-full rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-stone-900 h-14 shadow-sm font-bold">
                    <option value="">Kategorie wählen...</option>
                    {(types as any[]).map((t) => <option key={t.id} value={t.id}>{t.name} ({t.duration} min)</option>)}
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1">Patient Name</label>
                  <div className="flex gap-2">
                    <div className="relative w-full">
                      <Input 
                        value={patientSearchQuery} 
                        onChange={(e) => handlePatientSearch(e.target.value)}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        placeholder="Name eingeben oder auswählen..." 
                        className="h-14 rounded-2xl border-stone-200 font-bold px-4 w-full text-stone-900 bg-white" 
                      />
                      {showDropdown && filteredPatients.length > 0 && (
                        <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl border border-stone-100 max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
                          {filteredPatients.map((p: any) => (
                            <div 
                              key={p.id} 
                              onClick={() => handleSelectPatient(p)}
                              className="px-4 py-3 hover:bg-stone-50 cursor-pointer text-sm font-bold text-stone-900 border-b border-stone-50 last:border-0"
                            >
                              {p.first_name} {p.last_name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button type="button" onClick={() => setIsCreatingPatient(true)} className="h-14 w-14 flex-shrink-0 flex items-center justify-center rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold shadow-sm border border-stone-200" title="Neuen Patienten anlegen">
                       <UserPlus size={20} />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1">Datum</label>
                  <Input type="date" value={selectedDate} onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(""); }} required className="h-14 rounded-2xl border-stone-200 font-bold text-stone-900 bg-white px-4 md:w-1/2 shadow-sm" />
                </div>
                
                {typeId && selectedDate ? (
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1">Freie Terminslots ({((types as any[]).find(t => t.id === typeId)?.duration || 30)} Min. Raster)</label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          type="button"
                          disabled={slot.disabled}
                          onClick={() => setSelectedTime(slot.time)}
                          className={cn(
                            "py-3 rounded-2xl text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed border flex flex-col items-center justify-center gap-1 min-h-[70px]",
                            slot.disabled ? "bg-stone-50 border-stone-100 text-stone-400" : 
                            selectedTime === slot.time ? "bg-stone-900 border-stone-900 text-white shadow-xl shadow-stone-200 scale-105" : "bg-white border-stone-200 text-stone-600 hover:border-stone-900 hover:shadow-md"
                          )}
                        >
                          <span className="leading-none">{slot.time}</span>
                          {slot.disabled && <span className="text-[8px] font-black uppercase tracking-widest mt-1 text-center leading-tight mx-1">{slot.reason}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center bg-stone-50 rounded-3xl border border-dashed border-stone-200 mt-2">
                      <span className="text-stone-400 font-bold text-sm">Bitte wähle zuerst eine Behandlungsart und ein Datum.</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-6 border-t border-stone-100 flex-col sm:flex-row sm:items-center sm:justify-between">
                 <div className="flex items-center gap-2 text-stone-400 italic">
                    <AlertCircle size={14} />
                    <span className="text-xs">Speichern blockiert die Zeit im Patientensystem.</span>
                 </div>
                 <div className="flex gap-3">
                    <Button variant="ghost" type="button" onClick={resetForm} className="rounded-xl h-14 px-8 font-bold text-stone-400">Verwerfen</Button>
                    <Button type="submit" disabled={createSession.isPending || updateSession.isPending}
                        className="bg-stone-900 text-white hover:bg-stone-800 px-10 h-14 rounded-2xl font-black shadow-xl shadow-stone-100">
                        {editingId ? "Änderungen sichern" : "Termin buchen"}
                    </Button>
                 </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {isLoading ? (
            <div className="space-y-4">
                {[1,2,3].map(i => <div key={i} className="h-32 bg-stone-100 rounded-3xl animate-pulse" />)}
            </div>
        ) : filteredData.length === 0 ? (
            <div className="bg-stone-50 border border-dashed border-stone-200 rounded-[40px] p-24 text-center">
                <div className="w-20 h-20 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto mb-6 text-stone-300">
                    <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-black text-stone-900 mb-2">Alles erledigt!</h3>
                <p className="text-stone-400 max-w-sm mx-auto font-medium">Es gibt aktuell keine ausstehenden Aufgaben für diese Ansicht.</p>
                <Button variant="ghost" onClick={() => setActiveTab("upcoming")} className="mt-6 text-stone-400 hover:text-stone-900 font-bold">Zukünftige ansehen</Button>
            </div>
        ) : activeTab === "today" ? (
            <>
                <div className="space-y-6">
                    {filteredData.filter((s: any) => !(s.status === 'completed' || s.bookings?.[0]?.notes)).map(renderSessionRow)}
                    {filteredData.filter((s: any) => !(s.status === 'completed' || s.bookings?.[0]?.notes)).length === 0 && (
                        <div className="p-8 text-center bg-white rounded-[32px] border border-stone-100 shadow-sm">
                            <span className="text-stone-400 font-medium text-sm">Keine offenen Termine mehr für heute.</span>
                        </div>
                    )}
                </div>
                {filteredData.filter((s: any) => (s.status === 'completed' || s.bookings?.[0]?.notes)).length > 0 && (
                    <div className="mt-12">
                        <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest border-b border-stone-200 pb-2 mb-6">Bereits Dokumentiert / Erledigt</h4>
                        <div className="space-y-6 opacity-60 hover:opacity-100 transition-opacity">
                            {filteredData.filter((s: any) => (s.status === 'completed' || s.bookings?.[0]?.notes)).map(renderSessionRow)}
                        </div>
                    </div>
                )}
            </>
        ) : activeTab === "history" ? (
            [...filteredData].reverse().map(renderSessionRow)
        ) : (
            filteredData.map(renderSessionRow)
        )}
      </div>

      <Dialog open={!!selectedBooking} onOpenChange={(open: boolean) => !open && setSelectedBooking(null)}>
        <DialogContent className="max-w-3xl bg-[#faf8f5] border-stone-200 rounded-[32px] p-0 overflow-hidden">
          <DialogHeader className="bg-white border-b border-stone-100 p-10 pt-12">
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-stone-900 rounded-2xl text-white">
                        <ClipboardList size={24} />
                    </div>
                    <DialogTitle className="text-3xl font-black tracking-tight text-stone-900">Patientendokumentation</DialogTitle>
                </div>
                
                {selectedBooking && (
                    <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 flex items-center justify-center text-stone-900 font-black text-xl shadow-sm">
                                {selectedBooking.user?.last_name?.[0]}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Akte von</p>
                                <h4 className="text-xl font-black text-stone-900 leading-tight">
                                    {selectedBooking.user?.first_name} {selectedBooking.user?.last_name}
                                </h4>
                            </div>
                        </div>
                        {selectedSessionData && (
                            <div className="text-left sm:text-right flex-shrink-0">
                                <Badge className="bg-stone-200 text-stone-600 border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1">
                                    {selectedSessionData.session_type?.name || "Behandlung"}
                                </Badge>
                                <p className="text-xs font-bold text-stone-400/80 mt-1.5 flex items-center gap-1.5 sm:justify-end">
                                    <Clock size={12} /> {new Date(selectedSessionData.start_time).toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })} Uhr
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
          </DialogHeader>

          <div className="p-10 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center justify-between px-1">
                    <label className="text-[11px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
                        Behandlungsnotizen
                        <Timer size={12} />
                    </label>
                </div>
                <Textarea 
                  value={docNotes} 
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDocNotes(e.target.value)}
                  placeholder="Verlauf, Befund, empfohlene Maßnahmen..."
                  className="min-h-[220px] rounded-3xl border-stone-200 focus:ring-0 focus:border-stone-900 bg-white p-6 text-base font-medium shadow-inner"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[11px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Sparkles size={14} className="text-amber-500 fill-amber-500" />
                  Smart-Presets (Klick zum Einfügen)
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {templates.map((t, idx) => (
                    <Button 
                      key={idx} 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setDocNotes(prev => prev ? prev + "\n" + t.text : t.text)}
                      className="text-[11px] h-10 px-4 rounded-xl bg-white border-stone-200 hover:border-stone-900 transition-all font-bold text-stone-600"
                    >
                      {t.label}
                    </Button>
                  ))}
                </div>
              </div>
          </div>

          <DialogFooter className="p-10 pt-4 pb-12">
            <div className="flex gap-4 w-full">
                <Button variant="ghost" onClick={() => setSelectedBooking(null)} className="flex-1 h-16 rounded-2xl font-bold text-stone-400 hover:text-stone-900">Abbrechen</Button>
                <Button onClick={handleSaveDoc} className="flex-[2] h-16 rounded-2xl bg-stone-900 text-white font-black hover:bg-stone-950 shadow-2xl shadow-stone-200 gap-3 group">
                  <CheckCircle2 size={20} className="group-hover:scale-110 transition-all text-emerald-400" /> 
                  Dokumentieren & Abschließen
                </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreatingPatient} onOpenChange={setIsCreatingPatient}>
        <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-0">
          <DialogHeader className="bg-stone-50 px-8 py-6 border-b border-stone-100">
            <DialogTitle className="font-montserrat font-black text-xl text-stone-900">Neuen Patienten anlegen</DialogTitle>
          </DialogHeader>
          <div className="p-8 grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest pl-1">Vorname</label>
              <Input className="h-12 rounded-xl bg-stone-50 border-transparent focus:bg-white focus:border-stone-900 font-medium px-4 text-stone-900" value={newPatientForm.first_name} onChange={e => setNewPatientForm({...newPatientForm, first_name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest pl-1">Nachname</label>
              <Input className="h-12 rounded-xl bg-stone-50 border-transparent focus:bg-white focus:border-stone-900 font-medium px-4 text-stone-900" value={newPatientForm.last_name} onChange={e => setNewPatientForm({...newPatientForm, last_name: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest pl-1">E-Mail (optional)</label>
              <Input type="email" className="h-12 rounded-xl bg-stone-50 border-transparent focus:bg-white focus:border-stone-900 font-medium px-4 text-stone-900" value={newPatientForm.email} onChange={e => setNewPatientForm({...newPatientForm, email: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest pl-1">Telefon</label>
              <Input className="h-12 rounded-xl bg-stone-50 border-transparent focus:bg-white focus:border-stone-900 font-medium px-4 text-stone-900" value={newPatientForm.phone_number} onChange={e => setNewPatientForm({...newPatientForm, phone_number: e.target.value})} />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest pl-1">Straße & Hausnummer</label>
              <Input className="h-12 rounded-xl bg-stone-50 border-transparent focus:bg-white focus:border-stone-900 font-medium px-4 text-stone-900" value={newPatientForm.address_line_1} onChange={e => setNewPatientForm({...newPatientForm, address_line_1: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest pl-1">PLZ</label>
              <Input className="h-12 rounded-xl bg-stone-50 border-transparent focus:bg-white focus:border-stone-900 font-medium px-4 text-stone-900" value={newPatientForm.post_code} onChange={e => setNewPatientForm({...newPatientForm, post_code: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest pl-1">Stadt</label>
              <Input className="h-12 rounded-xl bg-stone-50 border-transparent focus:bg-white focus:border-stone-900 font-medium px-4 text-stone-900" value={newPatientForm.city} onChange={e => setNewPatientForm({...newPatientForm, city: e.target.value})} />
            </div>
          </div>
          <DialogFooter className="bg-stone-50 px-8 py-5 border-t border-stone-100 flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsCreatingPatient(false)} className="font-bold text-stone-500">Abbrechen</Button>
            <Button onClick={() => createPatient.mutate({...newPatientForm})} disabled={createPatient.isPending || !newPatientForm.first_name || !newPatientForm.last_name} className="bg-stone-900 text-white hover:bg-stone-800 rounded-xl px-6 font-bold shadow-xl shadow-stone-200">Patient anlegen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

function SessionRow({ session, onDocument, onEdit, onDelete }: any) {
    const now = new Date();
    const startTime = new Date(session.start_time);
    const endTime = new Date(session.end_time);
    const isPast = endTime < now;
    const isFuture = startTime > now;
    const isRunning = !isPast && !isFuture;
    
    const booking = session.bookings?.[0];
    const hasBooking = !!booking;
    const isTodo = isPast && hasBooking && !booking.notes;

    return (
        <div className={cn(
            "bg-white rounded-[32px] p-6 border transition-all duration-300 flex flex-col lg:flex-row lg:items-center justify-between gap-6 group",
            isTodo ? "border-red-100 bg-red-50/10 shadow-lg shadow-red-50" : "border-stone-100 hover:shadow-xl hover:shadow-stone-100",
            isRunning && "border-blue-200 ring-2 ring-blue-50 bg-blue-50/5"
        )}>
            <div className="flex items-center gap-4 sm:gap-8 flex-1">
                <div className="text-center min-w-[70px] sm:min-w-[90px] flex flex-col items-center justify-center border-r border-stone-100 pr-4 sm:pr-8">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1 truncate max-w-[60px] sm:max-w-none">
                        {startTime.toLocaleDateString("de-DE", { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-stone-900 leading-none">
                        {startTime.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                </div>

                <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge className="bg-stone-50 border-stone-200 text-stone-500 font-black text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-lg">
                            {session.session_type?.name || "Termin"}
                        </Badge>
                        {isRunning && (
                            <Badge className="bg-blue-500 text-white border-none text-[9px] uppercase tracking-widest font-black flex items-center gap-1 animate-pulse">
                                <div className="w-1 h-1 bg-white rounded-full" /> Live
                            </Badge>
                        )}
                        {isTodo && (
                            <Badge className="bg-red-500 text-white border-none text-[9px] uppercase tracking-widest font-black">
                                Dokumentation fehlt
                            </Badge>
                        )}
                    </div>
                    <h4 className="text-lg font-black text-stone-900 leading-tight">
                        {hasBooking ? `${booking.user?.first_name} ${booking.user?.last_name}` : (session.title || "Leerer Slot")}
                    </h4>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 lg:gap-8">
                <div className="hidden sm:flex flex-col items-center lg:items-end justify-center min-w-[120px]">
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Status</p>
                    <div className="flex items-center gap-2">
                        <div className={cn(
                            "w-2 h-2 rounded-full",
                            session.status === "completed" || (hasBooking && booking.notes) ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" :
                            isTodo ? "bg-red-500 animate-pulse" :
                            "bg-stone-200"
                        )} />
                        <span className="text-xs font-bold text-stone-700">
                             {session.status === "completed" || (hasBooking && booking.notes) ? "Erledigt" : 
                              isTodo ? "Dokumentieren" : 
                              isFuture ? "In Erwartung" : "Offen"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {hasBooking ? (
                        <Button 
                            disabled={isFuture}
                            onClick={onDocument}
                            className={cn(
                                "flex-1 sm:flex-none h-14 px-8 rounded-2xl font-black gap-2 transition-all group/btn",
                                isTodo ? "bg-stone-900 text-white hover:bg-black shadow-xl shadow-stone-200" : "bg-stone-50 text-stone-400 hover:bg-stone-100 hover:text-stone-900"
                            )}
                        >
                            <ClipboardList size={18} className={cn(isTodo && "group-hover/btn:scale-110 transition-transform")} />
                            {isFuture ? "Zukunft" : "Dokumentieren"}
                        </Button>
                    ) : (
                        <div className="px-6 py-2 rounded-2xl border border-dashed border-stone-200 text-stone-300 text-xs font-bold uppercase tracking-widest">
                            Nicht gebucht
                        </div>
                    )}
                    
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-14 w-14 rounded-2xl border-stone-100 hover:bg-stone-50">
                                <MoreVertical size={20} className="text-stone-400" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-2xl border-stone-200 p-2 shadow-2xl">
                            <DropdownMenuItem onClick={onEdit} className="p-3 rounded-xl gap-3 font-bold cursor-pointer">
                                <Edit2 size={16} className="text-stone-400" /> Slot bearbeiten
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onDelete} className="p-3 rounded-xl gap-3 font-bold text-red-500 focus:bg-red-50 focus:text-red-500 cursor-pointer">
                                <Trash2 size={16} /> Slot löschen
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </div>
    );
}

function TabButton({ active, onClick, label, count, color }: any) {
    return (
        <button 
            onClick={onClick}
            className={cn(
                "relative flex-1 sm:flex-none px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all overflow-hidden flex items-center justify-center gap-2.5",
                active ? "bg-white text-stone-900 shadow-sm" : "text-stone-400 hover:text-stone-600"
            )}
        >
            {label}
            {count > 0 && (
                <span className={cn(
                    "w-5 h-5 rounded-lg flex items-center justify-center text-[9px] shadow-sm font-black transition-colors",
                    active ? (color === "red" ? "bg-red-500 text-white" : color === "blue" ? "bg-blue-500 text-white" : "bg-stone-900 text-white") : "bg-stone-200 text-stone-500"
                )}>
                    {count}
                </span>
            )}
        </button>
    );
}
