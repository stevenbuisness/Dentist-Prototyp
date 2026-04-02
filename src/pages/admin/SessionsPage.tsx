import { useState, useEffect, useMemo } from "react";
import AdminLayout from "./AdminLayout";
import { useToast } from "../../hooks/use-toast";
import {
  useSessionTypes,
  useSessions,
  useCreateSession,
  useUpdateSession,
  useDeleteSession,
} from "../../hooks/useSessions";
import { useUpdateBooking } from "../../hooks/useBookings";
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
  Timer
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
  const { data: types = [] } = useSessionTypes();
  const { data: sessions = [], isLoading } = useSessions({ ascending: true });
  const createSession = useCreateSession();
  const updateSession = useUpdateSession();
  const deleteSession = useDeleteSession();

  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<TabType>("todo");
  const [searchQuery, setSearchQuery] = useState("");

  // Documentation Logic
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [selectedSessionToComplete, setSelectedSessionToComplete] = useState<string | null>(null);
  const [selectedSessionData, setSelectedSessionData] = useState<any>(null);
  const [docNotes, setDocNotes] = useState("");
  const updateBooking = useUpdateBooking();

  const [isAdding, setIsAdding] = useState(false);
  const [typeId, setTypeId] = useState("");
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
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

  // Smart Calculation: Auto-set end time
  useEffect(() => {
    if (typeId && startTime && !editingId) {
      const selectedType = (types as any[]).find(t => t.id === typeId);
      if (selectedType) {
        const start = new Date(startTime);
        const end = new Date(start.getTime() + selectedType.duration * 60000);
        setEndTime(formatDateForInput(end));
      }
    }
  }, [typeId, startTime, types, editingId]);

  const formatDateForInput = (date: Date) => {
    const tzoffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() - tzoffset).toISOString().slice(0, 16);
  };

  const resetForm = () => {
    setTypeId(""); setTitle(""); setStartTime(""); setEndTime("");
    setMaxSlots(1); setStatus("open"); setEditingId(null); setIsAdding(false);
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
      updateSession.mutate({ id: editingId, ...payload }, {
        onSuccess: () => { toast({ title: "Termin aktualisiert" }); resetForm(); },
        onError: (err: any) => toast({ title: "Fehler", description: err.message, variant: "destructive" }),
      });
    } else {
      createSession.mutate(payload, {
        onSuccess: () => { toast({ title: "Termin erstellt" }); resetForm(); },
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
    setStartTime(session.start_time.slice(0, 16)); 
    setEndTime(session.end_time.slice(0, 16));
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
              <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Neuer Slot
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
              {editingId ? "Slot bearbeiten" : "Neuer Behandlungs-Slot"}
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
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1">Name der Sitzung</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Interne Bezeichnung..." className="border-stone-200 h-14 rounded-2xl shadow-sm font-bold px-4" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1">Startzeitpunkt</label>
                  <Input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="h-14 rounded-2xl border-stone-200 font-bold px-4" />
                </div>
                <div className="space-y-3 relative">
                  <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest pl-1">Endzeitpunkt</label>
                  <Input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="h-14 rounded-2xl border-stone-200 font-bold px-4" />
                  {typeId && startTime && (
                    <span className="absolute right-4 bottom-4 text-[10px] text-emerald-500 font-black flex items-center gap-1.5 uppercase">
                      <Clock size={12} /> Live-Berechnung
                    </span>
                  )}
                </div>
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
                        {editingId ? "Änderungen sichern" : "Slot veröffentlichen"}
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
