import { useState, useEffect } from "react";
import { X, Calendar, Clock, User, ClipboardList, Search, Check, UserPlus } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { supabase } from "../../lib/supabase";
import { useSessionTypes, useCreateSession } from "../../hooks/useSessions";
import { useCreateBooking } from "../../hooks/useBookings";
import { useToast } from "../../hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../../components/ui/dialog";

interface Patient {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

interface ManualBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDateStr: string | null; // YYYY-MM-DD
  defaultTimeStr: string | null; // HH:MM
  onSuccess: () => void;
}

export function ManualBookingModal({ isOpen, onClose, defaultDateStr, defaultTimeStr, onSuccess }: ManualBookingModalProps) {
  const { toast } = useToast();

  const { data: sessionTypes } = useSessionTypes();
  const createSession = useCreateSession();
  const createBooking = useCreateBooking();

  const [date, setDate] = useState(defaultDateStr || "");
  const [time, setTime] = useState(defaultTimeStr || "09:00");
  const [typeId, setTypeId] = useState("");
  
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New Patient Dialog State
  const [isNewPatientDialogOpen, setIsNewPatientDialogOpen] = useState(false);
  const [newPatientForm, setNewPatientForm] = useState({ 
    first_name: "", 
    last_name: "", 
    email: "", 
    phone_number: "", 
    address_line_1: "", 
    post_code: "", 
    city: "" 
  });

  const createPatient = useMutation({
    mutationFn: async (payload: any) => {
      const { data, error } = await supabase.from("users").insert({ 
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
      setSelectedPatient(data);
      setIsNewPatientDialogOpen(false);
      setNewPatientForm({ first_name: "", last_name: "", email: "", phone_number: "", address_line_1: "", post_code: "", city: "" });
      toast({ title: "Patient angelegt!" });
    },
    onError: (err: any) => toast({ title: "Fehler beim Anlegen", description: err.message, variant: "destructive" })
  });

  useEffect(() => {
    if (isOpen) {
      setDate(defaultDateStr || "");
      setTime(defaultTimeStr || "09:00");
      setSearch("");
      setPatients([]);
      setSelectedPatient(null);
      setTypeId("");
      setIsNewPatientDialogOpen(false);
      setNewPatientForm({ first_name: "", last_name: "", email: "", phone_number: "", address_line_1: "", post_code: "", city: "" });
    }
  }, [isOpen, defaultDateStr, defaultTimeStr]);


  useEffect(() => {
    if (search.length < 2) {
      setPatients([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      const parts = search.trim().split(" ");
      let query = supabase
        .from("users")
        .select("id, first_name, last_name, email")
        .neq("role", "admin")
        .is("deleted_at", null)
        .limit(5);

      if (parts.length === 1) {
        query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
      } else {
        query = query.ilike("first_name", `%${parts[0]}%`).ilike("last_name", `%${parts[1]}%`);
      }

      const { data } = await query;
      setPatients(data || []);
      setIsSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);



  const handleSubmit = async () => {

    if (!date || !time || !typeId || !selectedPatient) {
      toast({ title: "Fehlt", description: "Bitte füllen Sie alle Felder aus.", variant: "destructive" });
      return;
    }

    try {
      setIsSubmitting(true);
      const selectedType = sessionTypes?.find(t => t.id === typeId);
      if (!selectedType) throw new Error("Behandlungsart nicht gefunden");

      // 1. Create Session
      const startDateTime = new Date(`${date}T${time}:00`);
      const endDateTime = new Date(startDateTime.getTime() + (selectedType.default_duration_minutes || 30) * 60000);

      const session = await createSession.mutateAsync({
        session_type_id: typeId,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        max_slots: 1,
        status: "open",
      });

      // 2. Create Booking
      await createBooking.mutateAsync({
        session_id: session.id,
        user_id: selectedPatient.id,
        notes: "Manuelle Einplanung (Admin)",
      });

      toast({ title: "Gebucht", description: "Der Termin wurde erfolgreich eingetragen." });
      onSuccess();
      onClose();
    } catch (err: any) {
      toast({ title: "Fehler", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h3 className="text-xl font-montserrat font-bold text-stone-900">Neuer Termin</h3>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-xl text-stone-400 hover:text-stone-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Patient Selection */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
              <User size={14} /> Patient / Kunde
            </label>
            
            {selectedPatient ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-3 rounded-xl animate-in fade-in zoom-in-95 duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold">
                    {(selectedPatient.first_name?.[0] || "?").toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-emerald-900 text-sm">{selectedPatient.first_name} {selectedPatient.last_name}</div>
                    <div className="text-[10px] text-emerald-600 font-medium">Ausgewählt</div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedPatient(null)} 
                  className="text-[10px] font-bold uppercase text-emerald-700 hover:text-emerald-900 bg-white px-2 py-1 rounded-md shadow-sm border border-emerald-200"
                >
                  Ändern
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                    <Search size={16} className="text-stone-400" />
                  </div>
                  <Input 
                    value={search} 
                    onChange={e => setSearch(e.target.value)} 
                    placeholder="Patient suchen..." 
                    className="pl-10 h-12 bg-stone-50 border-stone-100 rounded-xl w-full"
                    autoFocus
                  />
                  {(search.length >= 2 || isSearching) && (
                    <div className="absolute top-14 left-0 right-0 bg-white border border-stone-100 shadow-xl rounded-xl overflow-hidden z-10">
                      {isSearching ? (
                        <div className="p-4 text-sm text-stone-400 text-center italic">Suche Patienten...</div>
                      ) : (
                        <>
                          {patients.length > 0 ? (
                            patients.map(p => (
                              <div 
                                key={p.id} 
                                onClick={() => { setSelectedPatient(p); setSearch(""); }}
                                className="px-4 py-3 hover:bg-stone-50 cursor-pointer flex items-center justify-between group border-b border-stone-50 last:border-0"
                              >
                                <div>
                                  <div className="font-bold text-stone-900 group-hover:text-emerald-600 transition-colors">{p.first_name} {p.last_name}</div>
                                  <div className="text-[10px] text-stone-400">{p.email}</div>
                                </div>
                                <button className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                                  Auswählen
                                </button>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-sm text-stone-400 text-center">Kein Patient gefunden.</div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
                <Button 
                  type="button" 
                  onClick={() => setIsNewPatientDialogOpen(true)}
                  className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200 transition-colors shadow-sm"
                  title="Neuen Patienten anlegen"
                >
                  <UserPlus size={18} />
                </Button>
              </div>
            )}
          </div>


          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
                <Calendar size={14} /> Datum
              </label>
              <Input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)}
                className="h-12 bg-stone-50 border-stone-100 rounded-xl font-medium"
              />
            </div>

            {/* Time */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
                <Clock size={14} /> Uhrzeit
              </label>
              <Input 
                type="time" 
                value={time} 
                onChange={e => setTime(e.target.value)}
                className="h-12 bg-stone-50 border-stone-100 rounded-xl font-medium"
              />
            </div>
          </div>

          {/* Treatment Type */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
              <ClipboardList size={14} /> Behandlungsart
            </label>
            <div className="grid grid-cols-2 gap-2">
              {sessionTypes?.map(type => (
                <button
                  key={type.id}
                  onClick={() => setTypeId(type.id)}
                  className={cn(
                    "p-3 rounded-xl border text-left transition-all",
                    typeId === type.id 
                      ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500" 
                      : "border-stone-200 bg-white hover:border-stone-300 hover:bg-stone-50"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className={cn("font-bold text-sm", typeId === type.id ? "text-emerald-900" : "text-stone-900")}>
                      {type.name}
                    </span>
                    {typeId === type.id && <Check size={16} className="text-emerald-500" />}
                  </div>
                  <div className={cn("text-[10px] font-medium mt-1", typeId === type.id ? "text-emerald-600" : "text-stone-400")}>
                    {type.default_duration_minutes} Min
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-stone-50 bg-stone-50/50 flex gap-3">
          <Button variant="outline" className="flex-1 h-12 rounded-xl border-stone-200" onClick={onClose}>
            Abbrechen
          </Button>
          <Button 
            className="flex-1 h-12 rounded-xl bg-stone-900 font-bold" 
            onClick={handleSubmit} 
            disabled={isSubmitting || !selectedPatient || !date || !time || !typeId}
          >
            {isSubmitting ? "Wird gespeichert..." : "Termin eintragen"}
          </Button>
        </div>
      </div>

      {/* New Patient Dialog (same as in SessionsPage) */}
      <Dialog open={isNewPatientDialogOpen} onOpenChange={setIsNewPatientDialogOpen}>
        <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-0 z-[100]">
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
            <Button variant="ghost" onClick={() => setIsNewPatientDialogOpen(false)} className="font-bold text-stone-500">Abbrechen</Button>
            <Button onClick={() => createPatient.mutate({...newPatientForm})} disabled={createPatient.isPending || !newPatientForm.first_name || !newPatientForm.last_name} className="bg-stone-900 text-white hover:bg-stone-800 rounded-xl px-6 font-bold shadow-xl shadow-stone-200">Patient anlegen</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

