import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { useToast } from "../../hooks/use-toast";
import { 
  Calendar as CalendarIcon, 
  User as UserIcon, 
  ChevronRight, 
  CheckCircle2, 
  ClipboardList,
  History,
  X,
  Timer,
  ChevronLeft,
  AlertCircle
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { useSessionTypes, useSessions, useLockSession, useUnlockSession, useAvailabilityRules, useCreateOnDemandSession } from "../../hooks/useSessions";
import { useMyBookings, useCreateBooking, useUpdateBooking } from "../../hooks/useBookings";
import { format, addDays, isSameDay, startOfDay, isAfter, subHours, differenceInMinutes, setHours, setMinutes, isBefore, addMinutes } from "date-fns";
import { de } from "date-fns/locale";

export default function DashboardPage() {
  const { user, profile } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Data Fetching
  const { data: sessionTypes } = useSessionTypes();
  const { data: myBookings } = useMyBookings(user?.id);
  const { data: allSessions } = useSessions(); // Fetch all sessions to see occupied times
  const { data: availabilityRules } = useAvailabilityRules();
  const createOnDemandSession = useCreateOnDemandSession();
  
  // Mutations
  const lockSession = useLockSession();
  const unlockSession = useUnlockSession();
  const createBooking = useCreateBooking();
  const updateBooking = useUpdateBooking();

  // Booking State
  const [bookingStep, setBookingStep] = useState(1); 
  const [selectedType, setSelectedType] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [lockExpiresAt, setLockExpiresAt] = useState<Date | null>(null);

  // Derived Data
  const upcomingBooking = useMemo(() => {
    if (!myBookings) return null;
    return myBookings
      .filter(b => b.status === 'confirmed' && isAfter(new Date(b.session.start_time), new Date()))
      .sort((a, b) => new Date(a.session.start_time).getTime() - new Date(b.session.start_time).getTime())[0];
  }, [myBookings]);

  const filteredSlots = useMemo(() => {
    if (!sessionTypes || !selectedType || !availabilityRules || !allSessions) return [];
    
    // 1. Get Practice Rules for the selected day
    const dayOfWeek = selectedDate.getDay(); // 0-6 (Sun-Sat)
    const rule = availabilityRules.find(r => r.day_of_week === dayOfWeek);
    if (!rule) return []; // Practice closed
    
    // 2. Setup Daily Window
    const [startH, startM] = rule.start_time.split(':').map(Number);
    const [endH, endM] = rule.end_time.split(':').map(Number);
    const dayStart = setMinutes(setHours(new Date(selectedDate), startH), startM);
    const dayEnd = setMinutes(setHours(new Date(selectedDate), endH), endM);
    
    // 3. Generate Candidate Slots (every 30 mins)
    const slots = [];
    let current = dayStart;
    const duration = selectedType.duration_minutes || 30;

    while (isBefore(current, dayEnd)) {
      const slotEnd = addMinutes(current, duration);
      
      // Rule 4: Check if slot fits within opening hours
      if (isAfter(slotEnd, dayEnd)) break;

      // Rule 5: Check if it's during Lunch Break (12:00 - 13:00)
      const lunchStart = setMinutes(setHours(new Date(selectedDate), 12), 0);
      const lunchEnd = setMinutes(setHours(new Date(selectedDate), 13), 0);
      const isLunchTime = (isAfter(slotEnd, lunchStart) && isBefore(current, lunchEnd));

      if (!isLunchTime) {
        // Rule 6: Check for Overlap with existing Sessions
        const isOccupied = allSessions.some(s => {
          const sStart = new Date(s.start_time);
          const sEnd = new Date(s.end_time);
          
          // A slot is occupied if it overlaps with any existing session
          // Overlap: (StartA < EndB) && (EndA > StartB)
          return isSameDay(sStart, selectedDate) && 
                 s.status !== 'canceled' &&
                 isBefore(current, sEnd) && 
                 isAfter(slotEnd, sStart);
        });

        if (!isOccupied) {
          // Rule 7: Don't show slots in the past
          if (!isAfter(new Date(), current)) {
             slots.push({
               id: `temp-${current.getTime()}`, // Virtual ID
               start_time: current.toISOString(),
               end_time: slotEnd.toISOString(),
               is_virtual: true
             });
          }
        }
      }
      
      current = addMinutes(current, 30); // Advance 30 mins for the next candidate
    }

    // 8. Add existing "Open" sessions (if any manual ones exist)
    const manualOpenSessions = allSessions
      .filter(s => 
        isSameDay(new Date(s.start_time), selectedDate) && 
        s.status === 'open' &&
        s.session_type_id === selectedType.id &&
        isAfter(new Date(s.start_time), new Date()) &&
        (!s.locked_by || s.locked_by === user?.id || (s.locked_at && differenceInMinutes(new Date(), new Date(s.locked_at)) > 10))
      )
      .map(s => ({ ...s, is_virtual: false }));

    // Return combined (preferring manual if same start time, though unlikely)
    return [...slots, ...manualOpenSessions].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
  }, [allSessions, selectedDate, selectedType, availabilityRules, user?.id]);

  // Timer for Locking
  useEffect(() => {
    if (!lockExpiresAt) return;
    const interval = setInterval(() => {
      if (isAfter(new Date(), lockExpiresAt)) {
        handleCancelBooking();
        toast({
          title: "Sitzung abgelaufen",
          description: "Ihre Reservierung wurde aufgehoben.",
          variant: "destructive"
        });
        setLockExpiresAt(null);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [lockExpiresAt]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({ title: "Fehler beim Abmelden", description: error.message, variant: "destructive" });
    } else {
      navigate("/");
    }
  };

  const handleSelectSlot = async (slot: any) => {
    if (!user || !selectedType) return;
    
    try {
      let finalSlot = slot;
      
      // If it's a virtual slot, we must create it in the DB first
      if (slot.is_virtual) {
        const newSession = await createOnDemandSession.mutateAsync({
          typeId: selectedType.id,
          startTime: slot.start_time,
          endTime: slot.end_time
        });
        finalSlot = newSession;
      } else {
        // Just lock it
        const success = await lockSession.mutateAsync({ sessionId: slot.id, userId: user.id });
        if (!success) {
          toast({
            title: "Slot nicht verfügbar",
            description: "Jemand anderes reserviert diesen Slot gerade.",
            variant: "destructive"
          });
          return;
        }
      }
      
      setSelectedSlot(finalSlot);
      setLockExpiresAt(new Date(Date.now() + 10 * 60 * 1000)); // 10 mins
      setBookingStep(3);
    } catch (err: any) {
      toast({
        title: "Fehler",
        description: `Der Termin konnte nicht ausgewählt werden: ${err.message || 'Bitte versuchen Sie es erneut.'}`,
        variant: "destructive"
      });
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedSlot || !user) return;
    
    try {
      await createBooking.mutateAsync({
        session_id: selectedSlot.id,
        user_id: user.id,
        notes: ""
      });
      
      toast({
        title: "Erfolg!",
        description: "Ihr Termin wurde verbindlich gebucht.",
      });
      
      // Cleanup
      setBookingStep(1);
      setSelectedSlot(null);
      setLockExpiresAt(null);
    } catch (err: any) {
      toast({
        title: "Fehler",
        description: err.message,
        variant: "destructive"
      });
    }
  };

  const handleCancelBooking = async () => {
    if (selectedSlot && user) {
      await unlockSession.mutateAsync({ sessionId: selectedSlot.id, userId: user.id });
    }
    setBookingStep(1);
    setSelectedSlot(null);
    setLockExpiresAt(null);
  };

  const handleCancelExisting = async (bookingId: string, startTime: string) => {
    const startsAt = new Date(startTime);
    const limit = subHours(startsAt, 24);
    
    if (isAfter(new Date(), limit)) {
      toast({
        title: "Stornierung nicht möglich",
        description: "Termine müssen mindestens 24h vorher abgesagt werden.",
        variant: "destructive"
      });
      return;
    }

    if (confirm("Möchten Sie diesen Termin wirklich stornieren?")) {
      await updateBooking.mutateAsync({ id: bookingId, status: "canceled_by_user" });
      toast({ title: "Storniert", description: "Ihr Termin wurde erfolgreich abgesagt." });
    }
  };

  // Date scroller items (Skip Sat/Sun)
  const dates = useMemo(() => {
    let result = [];
    let d = new Date();
    while (result.length < 14) {
      const day = d.getDay();
      if (day !== 0 && day !== 6) {
        result.push(new Date(d));
      }
      d = addDays(d, 1);
    }
    return result;
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f5] font-lato pb-20">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="font-montserrat font-bold text-stone-900 hover:opacity-80 transition-opacity">
            Dr. Schmidt
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/profile" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1.5 group">
              <UserIcon size={16} /> Profil
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 rounded-md bg-stone-900 text-[#faf8f5] text-sm font-semibold hover:bg-stone-800 transition-colors shadow-sm">
              Abmelden
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-montserrat font-bold text-stone-900">Guten Tag, {profile?.first_name || "Patient"}!</h1>
            <p className="text-stone-500 mt-1">Verwalten Sie Ihre Gesundheit und buchen Sie neue Termine.</p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* BOOKING WIZARD */}
            <div className="bg-white rounded-[2.5rem] border border-stone-100 shadow-xl shadow-stone-200/50 overflow-hidden min-h-[500px] flex flex-col">
               <div className="p-8 border-b border-stone-50 bg-stone-50/30 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-montserrat font-black text-stone-900 uppercase tracking-tight">Terminbuchung</h2>
                    <p className="text-stone-400 text-[10px] font-black uppercase tracking-widest mt-1">Schritt {bookingStep} von 3</p>
                  </div>
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map(step => (
                      <div key={step} className={cn("w-2 h-2 rounded-full transition-all duration-300", bookingStep >= step ? "bg-stone-900 w-6" : "bg-stone-200")} />
                    ))}
                  </div>
               </div>

               <div className="flex-1 p-8">
                  {bookingStep === 1 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <h3 className="font-montserrat font-bold text-stone-900 text-lg mb-4">Was können wir für Sie tun?</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {sessionTypes?.map((type) => (
                          <button
                            key={type.id}
                            onClick={() => { setSelectedType(type); setBookingStep(2); }}
                            className="group p-6 rounded-3xl border border-stone-100 bg-stone-50/50 hover:bg-white hover:border-emerald-500 hover:ring-4 hover:ring-emerald-500/10 transition-all text-left"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="p-3 bg-white rounded-2xl shadow-sm group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                                <ClipboardList size={20} />
                              </div>
                              <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest bg-white px-2 py-1 rounded-full border border-stone-100">
                                {type.duration_minutes || type.default_duration_minutes} Min
                              </span>
                            </div>
                            <h3 className="font-montserrat font-bold text-stone-900 group-hover:text-emerald-700 transition-colors uppercase tracking-tight text-xs">{type.name}</h3>
                            <p className="text-stone-500 mt-2 line-clamp-2 leading-relaxed text-[11px] font-medium">{type.description || "Professionelle Behandlung durch unser Team."}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {bookingStep === 2 && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
                      <div className="flex items-center gap-4">
                         <button onClick={() => setBookingStep(1)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                           <ChevronLeft size={20} className="text-stone-600" />
                         </button>
                         <div>
                           <h3 className="font-bold text-stone-900">{selectedType?.name}</h3>
                           <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest leading-none mt-1">Geben Sie Ihre gewünschte Zeit an</p>
                         </div>
                      </div>
                      
                        <div className="flex items-center justify-between px-1 mb-2">
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">
                              {format(selectedDate, "MMMM yyyy", { locale: de })}
                           </p>
                        </div>
                        
                       {/* Date Scroller */}
                      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide px-1">
                        {dates.map((date) => (
                          <button
                            key={date.toISOString()}
                            onClick={() => setSelectedDate(startOfDay(date))}
                            className={cn(
                              "flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center transition-all border",
                              isSameDay(selectedDate, date)
                                ? "bg-stone-900 border-stone-800 text-white shadow-lg shadow-stone-200"
                                : "bg-white border-stone-100 text-stone-600 hover:border-stone-300"
                            )}
                          >
                            <span className="text-[10px] font-black uppercase tracking-tighter mb-1">
                              {format(date, "EEE", { locale: de })}
                            </span>
                            <span className="text-lg font-montserrat font-black leading-none">
                              {format(date, "d")}
                            </span>
                          </button>
                        ))}
                      </div>

                      {/* Time Slots */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Verfügbare Slots</h4>
                            <div className="flex items-center gap-2 text-[10px] text-stone-400 font-bold">
                               <Timer size={12} /> Mittagspause 12-13h gesperrt
                            </div>
                        </div>
                        
                        {filteredSlots.length > 0 ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {filteredSlots.map((slot) => (
                              <button
                                key={slot.id}
                                onClick={() => handleSelectSlot(slot)}
                                className="h-14 rounded-2xl bg-white border border-stone-100 text-stone-900 font-bold text-sm hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 transition-all shadow-sm active:scale-95"
                              >
                                {format(new Date(slot.start_time), "HH:mm")}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-stone-50 rounded-3xl p-12 text-center border-2 border-dashed border-stone-200 flex flex-col items-center gap-4">
                             <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                                <X size={24} />
                             </div>
                             <p className="text-stone-500 text-sm font-medium">Bisher keine Slots für diesen Tag freigegeben.</p>
                             <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="text-emerald-600 text-xs font-black uppercase tracking-widest hover:underline">
                                Nächsten Tag prüfen
                             </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {bookingStep === 3 && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 h-full flex flex-col justify-center">
                       <div className="bg-stone-50 border border-stone-100 rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden max-w-lg mx-auto w-full">
                          <div className="absolute top-0 right-0 p-8">
                             {lockExpiresAt && (
                               <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ring-4 ring-emerald-100/50">
                                 <Timer size={14} className="animate-pulse" />
                                 Wird gebucht...
                               </div>
                             )}
                          </div>

                          <div>
                             <h3 className="font-montserrat font-black text-stone-900 uppercase tracking-tight text-2xl leading-none">Termin Bestätigen</h3>
                             <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mt-2 px-1 border-l-2 border-stone-300">Fast am Ziel</p>
                          </div>

                          <div className="space-y-4">
                             <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500">
                                      <ClipboardList size={20} />
                                   </div>
                                   <div>
                                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-0.5">Leistung</span>
                                      <span className="font-bold text-stone-900 text-sm">{selectedType?.name}</span>
                                   </div>
                                </div>
                             </div>

                             <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm">
                                <div className="flex items-center gap-4">
                                   <div className="w-10 h-10 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                                      <CalendarIcon size={20} />
                                   </div>
                                   <div>
                                      <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest block mb-0.5">Zeitpunkt</span>
                                      <span className="font-bold text-stone-900 text-sm">
                                        {format(new Date(selectedSlot?.start_time), "EEEE, d. MMMM • HH:mm", { locale: de })} Uhr
                                      </span>
                                   </div>
                                </div>
                             </div>
                          </div>

                          <div className="space-y-3">
                            <Button 
                              onClick={handleConfirmBooking}
                              className="w-full h-16 bg-stone-900 hover:bg-stone-800 text-white rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all active:scale-[0.98]"
                            >
                               Verbindlich buchen
                            </Button>
                            <button onClick={handleCancelBooking} className="w-full text-center text-[10px] font-black uppercase text-stone-400 tracking-[0.2em] hover:text-stone-900 pt-2">
                               Abbrechen
                            </button>
                          </div>
                       </div>
                    </div>
                  )}
               </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-8">
            {/* NEXT APPOINTMENT */}
            {upcomingBooking ? (
              <div className="bg-stone-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-white/10 transition-colors" />
                 <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mb-6">Nächster Termin</h3>
                 
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
                      <CalendarIcon size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-montserrat font-bold">
                        {format(new Date(upcomingBooking.session.start_time), "d. MMMM", { locale: de })}
                      </div>
                      <div className="text-white/40 text-xs font-bold uppercase tracking-widest">
                        {format(new Date(upcomingBooking.session.start_time), "HH:mm")} Uhr
                      </div>
                    </div>
                 </div>
                 
                 <div className="p-4 bg-white/5 rounded-2xl border border-white/10 mb-6">
                   <p className="text-[10px] text-white/30 font-black uppercase tracking-widest mb-1.5">Behandlung</p>
                   <p className="font-bold text-sm tracking-tight">{upcomingBooking.session.session_type?.name}</p>
                 </div>

                 <Button 
                   variant="outline" 
                   onClick={() => handleCancelExisting(upcomingBooking.id, upcomingBooking.session.start_time)}
                   className="w-full bg-white/5 border-white/10 text-white/60 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 transition-all"
                 >
                    Termin Absagen
                 </Button>
              </div>
            ) : (
              <div className="bg-stone-100 rounded-[2.5rem] p-8 border border-stone-200">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-stone-300 mb-6 shadow-sm">
                    <AlertCircle size={24} />
                 </div>
                 <h3 className="font-montserrat font-bold text-stone-900 leading-tight">Keine anstehenden Termine</h3>
                 <p className="text-stone-500 text-xs mt-2 leading-relaxed">Sorgen Sie für Ihr schönstes Lächeln und buchen Sie eine Vorsorge.</p>
              </div>
            )}

            {/* HISTORY */}
            <div className="bg-white rounded-[2.5rem] border border-stone-100 p-8 shadow-xl shadow-stone-200/50">
               <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-6 flex items-center gap-2">
                 <History size={14} /> Behandlungs-Historie
               </h3>
               <div className="space-y-6">
                  {myBookings?.slice(0, 5).map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center transition-colors font-bold text-xs",
                            booking.status === 'confirmed' ? "bg-emerald-50 text-emerald-500" : "bg-stone-50 text-stone-400"
                          )}>
                             <CheckCircle2 size={16} />
                          </div>
                          <div>
                            <p className="font-bold text-sm text-stone-900 leading-tight truncate max-w-[120px]">
                              {booking.session.session_type?.name}
                            </p>
                            <p className="text-[10px] text-stone-400 font-bold uppercase tracking-tighter">
                              {format(new Date(booking.session.start_time), "d. MMM yyyy")} • {booking.status === 'canceled_by_user' ? 'Storniert' : 'Bestätigt'}
                            </p>
                          </div>
                       </div>
                       <ChevronRight size={14} className="text-stone-300 opacity-0 group-hover:opacity-100 transition-all" />
                    </div>
                  ))}
               </div>
               {!myBookings?.length && <p className="text-stone-400 text-[11px] italic">Noch keine Behandlungen.</p>}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
