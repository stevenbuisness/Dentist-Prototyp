import { useState, useMemo, useEffect, useRef } from "react";
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
  AlertCircle,
  CalendarCheck,
  Home
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
import { Skeleton } from "../../components/ui/skeleton";
import { useSessionTypes, useSessions, useLockSession, useUnlockSession, useAvailabilityRules, useCreateOnDemandSession } from "../../hooks/useSessions";
import { useAvailabilityExceptions } from "../../hooks/useAvailability";
import { useMyBookings, useCreateBooking, useUpdateBooking } from "../../hooks/useBookings";
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
import { format, addDays, isSameDay, startOfDay, isAfter, differenceInMinutes, setHours, setMinutes, isBefore, addMinutes, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, addMonths, subMonths } from "date-fns";
import { de } from "date-fns/locale";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const { user, profile } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Data Fetching
  const { data: sessionTypes, isLoading: isLoadingTypes } = useSessionTypes();
  const { data: myBookings, isLoading: isLoadingBookings } = useMyBookings(user?.id);
  const { data: allSessions } = useSessions(); // Fetch all sessions to see occupied times
  const { data: availabilityRules } = useAvailabilityRules();
  const { data: availabilityExceptions = [] } = useAvailabilityExceptions();
  const createOnDemandSession = useCreateOnDemandSession();
  
  // Mutations
  const lockSession = useLockSession();
  const unlockSession = useUnlockSession();
  const createBooking = useCreateBooking();
  const updateBooking = useUpdateBooking();

  // Booking State
  const [bookingStep, setBookingStep] = useState<number>(1); 
  const [selectedType, setSelectedType] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [calendarViewMonth, setCalendarViewMonth] = useState(startOfMonth(new Date()));
  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [lockExpiresAt, setLockExpiresAt] = useState<Date | null>(null);
  const [tooltipDate, setTooltipDate] = useState<string | null>(null); // for date button tooltip
  
  const wizardRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to wizard when advancing steps
  useEffect(() => {
    if (bookingStep > 1 && wizardRef.current) {
      wizardRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [bookingStep]);

  // Derived Data
  const upcomingBooking = useMemo(() => {
    if (!myBookings) return null;
    return myBookings
      .filter(b => b.status === 'confirmed' && isAfter(new Date(b.session.start_time), new Date()))
      .sort((a, b) => new Date(a.session.start_time).getTime() - new Date(b.session.start_time).getTime())[0];
  }, [myBookings]);

  // Helper: check if a given date (local midnight) falls within any closed exception
  const isDateBlocked = (date: Date): { blocked: boolean; reason: string } => {
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const matchingEx = (availabilityExceptions as any[]).find(
      (ex) => ex.is_closed && dateStr >= ex.start_date && dateStr <= ex.end_date
    );
    return matchingEx
      ? { blocked: true, reason: matchingEx.reason || 'Geschlossen' }
      : { blocked: false, reason: '' };
  };

  const filteredSlots = useMemo(() => {
    if (!sessionTypes || !selectedType || !availabilityRules || !allSessions) return [];

    // Block exception days — return no slots for closed days
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    const isExceptionDay = (availabilityExceptions as any[]).some(
      (ex) => ex.is_closed && dateStr >= ex.start_date && dateStr <= ex.end_date
    );
    if (isExceptionDay) return [];
    
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
  }, [allSessions, selectedDate, selectedType, availabilityRules, user?.id, availabilityExceptions]);

  // Helper: get status for a date in the scroller
  // Returns: { status: 'blocked' | 'full' | 'available', label: string }
  const getDateStatus = (date: Date): { status: 'blocked' | 'full' | 'available'; label: string } => {
    // 1. Check exception
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const ex = (availabilityExceptions as any[]).find(
      (e) => e.is_closed && dateStr >= e.start_date && dateStr <= e.end_date
    );
    if (ex) return { status: 'blocked', label: ex.reason || 'Geschlossen' };

    // 2. Check if fully booked (no free slots for ANY session type)
    if (availabilityRules && allSessions && sessionTypes && sessionTypes.length > 0) {
      const dayOfWeek = date.getDay();
      const rule = (availabilityRules as any[]).find(r => r.day_of_week === dayOfWeek);
      if (!rule) return { status: 'available', label: '' };

      // Try with shortest duration type to find at least one free gap
      const [startH, startM] = rule.start_time.split(':').map(Number);
      const [endH, endM] = rule.end_time.split(':').map(Number);
      const dayStart = setMinutes(setHours(new Date(date), startH), startM);
      const dayEnd = setMinutes(setHours(new Date(date), endH), endM);
      const minDuration = Math.min(...(sessionTypes as any[]).map((t: any) => t.duration_minutes || 30));

      const lunchStart = setMinutes(setHours(new Date(date), 12), 0);
      const lunchEnd = setMinutes(setHours(new Date(date), 13), 0);

      let hasFreeSlot = false;
      let cur = dayStart;
      while (isBefore(cur, dayEnd)) {
        const slotEnd = addMinutes(cur, minDuration);
        if (isAfter(slotEnd, dayEnd)) break;
        const isLunch = isAfter(slotEnd, lunchStart) && isBefore(cur, lunchEnd);
        if (!isLunch && !isAfter(new Date(), cur)) {
          const occupied = (allSessions as any[]).some(s => {
            const sStart = new Date(s.start_time);
            const sEnd = new Date(s.end_time);
            return isSameDay(sStart, date) && s.status !== 'canceled' && isBefore(cur, sEnd) && isAfter(slotEnd, sStart);
          });
          if (!occupied) { hasFreeSlot = true; break; }
        }
        cur = addMinutes(cur, 30);
      }

      if (!hasFreeSlot) return { status: 'full', label: 'Keine freien Termine' };
    }

    return { status: 'available', label: '' };
  };

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
      
      // Move to Success Step instead of jumping back to Step 1
      setBookingStep(4);
      setLockExpiresAt(null); // The lock logic is done now that booking is confirmed
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

  const [cancelBookingId, setCancelBookingId] = useState<string | null>(null);

  const handleCancelExisting = async (bookingId: string, startTime: string) => {
    // Current time and start time in milliseconds for precise comparison
    const now = Date.now();
    const startsAt = new Date(startTime).getTime();
    const twentyFourHoursInMs = 24 * 60 * 60 * 1000;
    
    if (startsAt - now < twentyFourHoursInMs) {
      toast({
        title: "Stornierung nicht möglich",
        description: "Termine müssen mindestens 24h vorher abgesagt werden. Bitte kontaktieren Sie uns telefonisch.",
        variant: "destructive"
      });
      return;
    }

    setCancelBookingId(bookingId);
  };

  const confirmCancellation = async () => {
    if (!cancelBookingId) return;
    await updateBooking.mutateAsync({ id: cancelBookingId, status: "canceled_by_user" });
    toast({ title: "Storniert", description: "Ihr Termin wurde erfolgreich abgesagt." });
    setCancelBookingId(null);
  };

  // Calendar days generation (Mo-Fr) for the visible month
  const calendarDays = useMemo(() => {
    const start = startOfWeek(startOfMonth(calendarViewMonth), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(calendarViewMonth), { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end }).filter(d => {
      const day = d.getDay();
      return day !== 0 && day !== 6; // Ignore Saturday and Sunday
    });
  }, [calendarViewMonth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf9f7] via-[#faf9f7] to-[#f4f7fb] font-lato pb-20 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-blue-50/40 rounded-full blur-[100px]" />
      </div>

      <header className="border-b border-blue-100/30 bg-white/80 backdrop-blur-xl sticky top-0 z-50 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 font-montserrat group">
            <img 
              src="/logo.png" 
              alt="Dr. Schmidt Logo" 
              className="w-12 h-12 object-contain transition-transform group-hover:scale-105 mix-blend-multiply"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none tracking-tight text-blue-950">Dr. Schmidt</span>
              <span className="text-[9px] font-semibold italic text-blue-600/80 leading-none mt-1">Ihr Lächeln in besten Händen</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 sm:gap-6">
            <Link to="/" className="text-stone-500 hover:text-blue-600 transition-all flex items-center gap-2 px-3 py-2 rounded-full hover:bg-blue-50/50">
              <Home size={18} /> <span className="hidden sm:inline text-[11px] font-black uppercase tracking-widest">Start</span>
            </Link>
            <Link to="/profile" className="text-stone-500 hover:text-blue-600 transition-all flex items-center gap-2 px-3 py-2 rounded-full hover:bg-blue-50/50">
              <UserIcon size={18} /> <span className="hidden sm:inline text-[11px] font-black uppercase tracking-widest">Profil</span>
            </Link>
            <div className="h-4 w-px bg-stone-200 hidden sm:block" />
            <button onClick={handleLogout} className="px-5 py-2.5 rounded-full bg-stone-950 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-stone-200 hover:bg-stone-800 transition-all active:scale-95">
              Logout
            </button>
          </div>
        </div>
      </header>
      
      <main className="w-full p-6 md:p-10 space-y-8 relative z-10">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-montserrat font-black text-blue-950 uppercase tracking-tighter">
              Guten Tag, {profile?.first_name || (isLoadingBookings ? <Skeleton className="h-10 w-48 inline-block align-middle" /> : "Patient")}!
            </h1>
            <p className="text-stone-500 mt-1">Verwalten Sie Ihre Gesundheit und buchen Sie neue Termine.</p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            {/* BOOKING WIZARD */}
            <div 
              ref={wizardRef}
              className="bg-white rounded-[2.5rem] border border-stone-200/50 shadow-2xl shadow-stone-200/30 overflow-hidden min-h-[500px] flex flex-col scroll-mt-24 sm:scroll-mt-28 relative"
            >
               {/* Subtle background glow */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/30 rounded-full blur-[100px] pointer-events-none" />

               <div className="p-10 border-b border-stone-100/50 bg-stone-50/30 flex items-center justify-between relative z-10">
                  <div>
                    <h2 className="text-2xl font-montserrat font-black text-blue-950 uppercase tracking-tighter">Terminbuchung</h2>
                    <div className="flex items-center gap-2 mt-2">
                       <span className="h-px w-6 bg-blue-500" />
                       <p className="text-stone-400 text-[9px] font-black uppercase tracking-[0.3em]">Phase {bookingStep} von 4</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4].map(step => (
                      <div key={step} className={cn("h-1.5 rounded-full transition-all duration-500", bookingStep >= step ? "bg-blue-600 w-8" : "bg-stone-200 w-3")} />
                    ))}
                  </div>
               </div>

               <div className="flex-1 p-8">
                  {upcomingBooking ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                      <div className="w-20 h-20 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-500 shadow-inner">
                         <CheckCircle2 size={40} />
                      </div>
                      <div className="max-w-md">
                        <h3 className="text-2xl font-montserrat font-black text-stone-900 uppercase tracking-tight leading-none mb-4">Sie haben bereits einen Termin reserviert</h3>
                        <p className="text-stone-500 text-sm leading-relaxed font-medium">
                          Um die Qualität unserer Planung zu sichern, kann pro Patient aktuell nur ein anstehender Termin gebucht werden. 
                          Sie können Ihren bestehenden Termin in der Sidebar rechts verwalten oder stornieren, um einen neuen zu wählen.
                        </p>
                      </div>
                      <div className="pt-4 flex flex-col items-center gap-2">
                        <span className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em]">Ihr nächster Besuch</span>
                        <div className="bg-stone-50 px-6 py-3 rounded-2xl border border-stone-100 font-bold text-stone-900">
                          {format(new Date(upcomingBooking.session.start_time), "EEEE, d. MMMM • HH:mm", { locale: de })} Uhr
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Step 1: Treatment Type */}
                      {bookingStep === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <h3 className="font-montserrat font-bold text-stone-900 text-lg mb-4">Was können wir für Sie tun?</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                            {isLoadingTypes ? (
                              [...Array(4)].map((_, i) => (
                                <div key={i} className="p-6 rounded-3xl border border-stone-100 bg-white space-y-4">
                                  <div className="flex justify-between items-start">
                                    <Skeleton className="w-12 h-12 rounded-2xl" />
                                    <Skeleton className="w-16 h-6 rounded-full" />
                                  </div>
                                  <Skeleton className="h-4 w-3/4" />
                                  <div className="space-y-2">
                                    <Skeleton className="h-3 w-full" />
                                    <Skeleton className="h-3 w-5/6" />
                                  </div>
                                </div>
                              ))
                            ) : (
                              sessionTypes?.map((type) => (
                                <button
                                  key={type.id}
                                  onClick={() => { setSelectedType(type); setBookingStep(2); }}
                                  className="group p-8 rounded-[2rem] border border-stone-100 bg-white hover:border-blue-200 hover:ring-[12px] hover:ring-blue-50/30 transition-all text-left shadow-sm hover:shadow-xl relative overflow-hidden"
                                >
                                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-blue-100/50 transition-colors" />
                                  
                                  <div className="flex justify-between items-start mb-6 relative z-10">
                                    <div className="p-3.5 bg-stone-50 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all transform group-hover:scale-110 shadow-sm">
                                      <ClipboardList size={22} />
                                    </div>
                                    <span className="text-[9px] font-black text-blue-600/60 uppercase tracking-widest bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100/50">
                                      {type.duration_minutes || type.default_duration_minutes} Min
                                    </span>
                                  </div>
                                  <h3 className="font-montserrat font-black text-blue-950 group-hover:text-blue-600 transition-colors uppercase tracking-tight text-xs relative z-10">{type.name}</h3>
                                  <p className="text-stone-500 mt-3 line-clamp-3 leading-relaxed text-[11px] font-medium relative z-10">{type.description || "Professionelle Behandlung durch unser Team."}</p>
                                  
                                  <div className="mt-6 flex items-center gap-1.5 text-blue-600/0 group-hover:text-blue-600 transition-all font-black text-[9px] uppercase tracking-widest relative z-10">
                                    Termin wählen <ChevronRight size={10} />
                                  </div>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}

                      {/* Step 2: Slot Selection */}
                      {bookingStep === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
                          <div className="flex items-center gap-4">
                             <button onClick={() => setBookingStep(1)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                               <ChevronLeft size={20} className="text-stone-600" />
                             </button>
                             <div>
                               <h3 className="font-bold text-stone-900">{selectedType?.name}</h3>
                               <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest leading-none mt-1">Wählen Sie Ihren Wunschtermin</p>
                             </div>
                          </div>
                          
                          <div className="flex flex-col xl:flex-row gap-12 items-start">
                             <div className="w-full xl:w-[400px] shrink-0">
                            {/* Calendar Navigation header */}
                            <div className="flex items-center justify-between px-1 mb-4">
                              <button 
                                onClick={() => setCalendarViewMonth(subMonths(calendarViewMonth, 1))}
                                className="p-1 px-3 bg-white border border-stone-200 rounded-full hover:bg-stone-50 transition-colors shadow-sm"
                              >
                                <ChevronLeft size={16} className="text-stone-600 inline-block" />
                              </button>
                              <p className="text-[12px] font-black uppercase tracking-[0.2em] text-stone-700">
                                {format(calendarViewMonth, "MMMM yyyy", { locale: de })}
                              </p>
                              <button 
                                onClick={() => setCalendarViewMonth(addMonths(calendarViewMonth, 1))}
                                className="p-1 px-3 bg-white border border-stone-200 rounded-full hover:bg-stone-50 transition-colors shadow-sm"
                              >
                                <ChevronRight size={16} className="text-stone-600 inline-block" />
                              </button>
                            </div>
                            
                           {/* Calendar Grid */}
                           <div className="bg-white rounded-3xl border border-stone-200 p-4 shadow-sm">
                             {/* Weekday headers */}
                             <div className="grid grid-cols-5 gap-2 mb-3">
                               {['Mo', 'Di', 'Mi', 'Do', 'Fr'].map(d => (
                                 <div key={d} className="text-center text-[9px] font-black tracking-widest text-stone-400">
                                   {d}
                                 </div>
                               ))}
                             </div>
                             
                             {/* Days Grid */}
                             <div className="grid grid-cols-5 gap-2">
                               {calendarDays.map((date) => {
                                 const dateKey = date.toISOString();
                                 const { status } = getDateStatus(date);
                                 
                                 const isPastDay = isBefore(startOfDay(date), startOfDay(new Date()));
                                 const isDisabled = isPastDay || status === 'blocked' || status === 'full';
                                 const inMonth = isSameMonth(date, calendarViewMonth);

                                 return (
                                 <div
                                   key={dateKey}
                                   className="relative aspect-[1/1.1]"
                                   onMouseEnter={() => isDisabled && !isPastDay && setTooltipDate(dateKey)}
                                   onMouseLeave={() => setTooltipDate(null)}
                                 >
                                   <button
                                     onClick={() => {
                                       if (isDisabled) {
                                         if (!isPastDay) setTooltipDate(prev => prev === dateKey ? null : dateKey);
                                         return;
                                       }
                                       setTooltipDate(null);
                                       setSelectedDate(startOfDay(date));
                                       if (!inMonth) setCalendarViewMonth(startOfMonth(date));
                                     }}
                                     className={cn(
                                       "w-full h-full rounded-2xl flex flex-col items-center justify-center transition-all border",
                                       isPastDay
                                         ? "opacity-30 cursor-not-allowed bg-stone-50 border-transparent text-stone-400"
                                         : status === 'blocked'
                                         ? "bg-red-50 border-red-200 text-red-500 cursor-not-allowed shadow-sm"
                                         : status === 'full'
                                         ? "bg-stone-100 border-stone-200 text-stone-400 cursor-not-allowed"
                                         : isSameDay(selectedDate, date)
                                         ? "bg-stone-900 border-stone-800 text-white shadow-lg shadow-stone-200 scale-[1.03] z-10"
                                         : inMonth
                                           ? "bg-white border-stone-100 text-stone-700 hover:border-stone-300 hover:shadow-sm"
                                           : "bg-white border-stone-50 text-stone-300 hover:text-stone-500" // Other month
                                     )}
                                   >
                                     <span className={cn(
                                       "text-sm font-montserrat font-black leading-none",
                                       !inMonth && !isSameDay(selectedDate, date) && !isDisabled && "text-stone-400"
                                     )}>
                                       {format(date, "d")}
                                     </span>
                                     {!isPastDay && status === 'blocked' && (
                                       <span className="text-[7px] font-black absolute bottom-1.5 text-red-500">✕</span>
                                     )}
                                     {!isPastDay && status === 'full' && (
                                       <span className="text-[5px] font-black uppercase tracking-widest absolute bottom-1.5 text-stone-400">voll</span>
                                     )}
                                   </button>
                                 </div>
                                 );
                               })}
                               </div>
                             </div>
                             </div>

                             <div className="flex-1 w-full space-y-6">
                           {(() => {
                             if (!tooltipDate) return null;
                             const hoveredDate = calendarDays.find(d => d.toISOString() === tooltipDate);
                             if (!hoveredDate) return null;
                             const { status, label } = getDateStatus(hoveredDate);
                             if (status === 'available') return null;
                             const isHoliday = status === 'blocked';
                             return (
                               <div className={cn(
                                 "flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-200",
                                 isHoliday
                                   ? "bg-red-50 border-red-100 text-red-700"
                                   : "bg-stone-50 border-stone-200 text-stone-700"
                               )}>
                                 <span className={cn(
                                   "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-base",
                                   isHoliday ? "bg-red-100" : "bg-stone-100"
                                 )}>
                                   {isHoliday ? '🏖️' : '📅'}
                                 </span>
                                 <div>
                                   <span className={cn(
                                     "font-black text-xs uppercase tracking-wide block",
                                     isHoliday ? "text-red-600" : "text-stone-600"
                                   )}>
                                     {label}
                                   </span>
                                   <span className={cn(
                                     "text-[10px] font-medium",
                                     isHoliday ? "text-red-400" : "text-stone-400"
                                   )}>
                                     {isHoliday
                                       ? `Die Praxis ist am ${format(hoveredDate, "dd. MMMM", { locale: de })} geschlossen.`
                                       : `Am ${format(hoveredDate, "dd. MMMM", { locale: de })} sind keine Termine mehr frei.`
                                     }
                                   </span>
                                 </div>
                               </div>
                             );
                           })()}

                          {/* Time Slots */}
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Verfügbare Slots</h4>
                            </div>

                            {/* Exception / Holiday Banner (for the SELECTED day) */}
                            {(() => {
                              const { status, label } = getDateStatus(selectedDate);
                              if (status === 'available') return null;
                              const isHoliday = status === 'blocked';
                              return (
                                <div className={cn(
                                  "rounded-2xl p-5 flex items-start gap-4 border",
                                  isHoliday ? "bg-red-50 border-red-100" : "bg-stone-50 border-stone-200"
                                )}>
                                  <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0",
                                    isHoliday ? "bg-red-100" : "bg-stone-100"
                                  )}>
                                    {isHoliday ? '🏖️' : '📅'}
                                  </div>
                                  <div>
                                    <p className={cn(
                                      "font-black text-sm uppercase tracking-wide",
                                      isHoliday ? "text-red-700" : "text-stone-700"
                                    )}>{label}</p>
                                    <p className={cn(
                                      "text-xs mt-1 font-medium",
                                      isHoliday ? "text-red-500" : "text-stone-500"
                                    )}>
                                      {isHoliday
                                        ? "An diesem Tag ist die Praxis geschlossen. Bitte wählen Sie einen anderen Tag."
                                        : "Für diesen Tag sind leider keine freien Termine mehr verfügbar."
                                      }
                                    </p>
                                  </div>
                                </div>
                              );
                            })()}
                            
                            {filteredSlots.length > 0 ? (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {filteredSlots.map((slot) => (
                                  <button
                                    key={slot.id}
                                    onClick={() => handleSelectSlot(slot)}
                                    className="h-16 rounded-2xl bg-white border border-stone-200 text-blue-950 font-black text-sm hover:border-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-lg active:scale-95"
                                  >
                                    {format(new Date(slot.start_time), "HH:mm")}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              !isDateBlocked(selectedDate).blocked && (
                              <div className="bg-stone-50 rounded-3xl p-12 text-center border-2 border-dashed border-stone-200 flex flex-col items-center gap-4">
                                 <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                                    <X size={24} />
                                 </div>
                                 <p className="text-stone-500 text-sm font-medium">Bisher keine Slots für diesen Tag freigegeben.</p>
                                 <button onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="text-emerald-600 text-xs font-black uppercase tracking-widest hover:underline">
                                    Nächsten Tag prüfen
                                 </button>
                              </div>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Confirmation */}
                  {bookingStep === 3 && (
                        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 h-full flex flex-col justify-center">
                           <div className="bg-stone-50 border border-stone-100 rounded-[2.5rem] p-10 space-y-8 relative overflow-hidden max-w-lg mx-auto w-full">
                              <div className="absolute top-0 right-0 p-8">
                                 {lockExpiresAt && (
                                   <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ring-4 ring-emerald-100/50">
                                     <Timer size={14} className="animate-pulse" />
                                     Wird reserviert...
                                   </div>
                                 )}
                              </div>

                              <div>
                                 <h3 className="font-montserrat font-black text-stone-900 uppercase tracking-tight text-2xl leading-none">Termin bestätigen</h3>
                                 <p className="text-stone-400 text-xs font-bold uppercase tracking-widest mt-2 px-1 border-l-2 border-stone-300">Nur noch ein Schritt</p>
                              </div>

                              <div className="space-y-4">
                                 <div className="bg-white p-6 rounded-3xl border border-blue-50 shadow-sm group">
                                    <div className="flex items-center gap-5">
                                       <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                          <ClipboardList size={22} />
                                       </div>
                                       <div>
                                          <span className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] block mb-1">Gewählte Leistung</span>
                                          <span className="font-montserrat font-black text-blue-950 uppercase text-xs tracking-tight">{selectedType?.name}</span>
                                       </div>
                                    </div>
                                 </div>

                                 <div className="bg-white p-6 rounded-3xl border border-blue-50 shadow-sm group">
                                    <div className="flex items-center gap-5">
                                       <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                          <CalendarIcon size={22} />
                                       </div>
                                       <div>
                                          <span className="text-[9px] font-black text-stone-400 uppercase tracking-[0.2em] block mb-1">Gewählter Zeitpunkt</span>
                                          <span className="font-montserrat font-black text-blue-950 uppercase text-xs tracking-tight">
                                            {format(new Date(selectedSlot?.start_time || new Date()), "EEEE, d. MMMM • HH:mm", { locale: de })} Uhr
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

                      {/* Step 4: Success Message */}
                      {bookingStep === 4 && (
                        <motion.div 
                          className="h-full flex flex-col items-center justify-center py-10"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        >
                          <div className="bg-blue-600 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl max-w-lg w-full mx-auto group">
                            {/* Inner Glow Background */}
                            <motion.div 
                              className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none"
                              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
                              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                              <div className="w-80 h-80 bg-white rounded-full blur-[120px]" />
                            </motion.div>
                            
                            <div className="relative z-10 flex flex-col items-center">
                              <motion.div 
                                className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center text-blue-600 shadow-xl shadow-blue-900/20 mb-8 border-4 border-white/20 pointer-events-none"
                                initial={{ y: 20, rotate: -15, scale: 0.5 }}
                                animate={{ y: 0, rotate: 0, scale: 1 }}
                                transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
                              >
                                <CheckCircle2 size={48} strokeWidth={2.5} />
                              </motion.div>
                              
                              <motion.h2 
                                className="text-3xl font-montserrat font-black tracking-tight mb-4 uppercase"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                              >
                                Termin bestätigt
                              </motion.h2>
                              
                              <motion.p 
                                className="text-stone-300 font-medium leading-relaxed mb-8"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                              >
                                Vielen Dank{profile?.first_name ? `, ${profile.first_name}` : ""}! Wir freuen uns auf Sie. Ihr Termin für eine <strong className="text-white">{selectedType?.name}</strong> ist hiermit verbindlich gebucht.
                              </motion.p>

                              <motion.div 
                                className="bg-white/10 border border-white/10 rounded-3xl p-6 text-left w-full mb-8 backdrop-blur-sm"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                              >
                                <p className="text-[10px] text-primary font-black uppercase tracking-widest mb-1.5 pl-1">Bestätigter Termin</p>
                                <div className="text-[17px] font-bold font-montserrat flex items-center gap-3">
                                  <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-primary shrink-0">
                                    <CalendarCheck size={18} />
                                  </div>
                                  <span className="capitalize">{selectedSlot ? format(new Date(selectedSlot.start_time), "EEEE, d. MMMM 'um' HH:mm", { locale: de }) : ""} Uhr</span>
                                </div>
                              </motion.div>

                              <motion.div
                                className="w-full"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8 }}
                              >
                                <Button 
                                  onClick={() => {
                                    setBookingStep(1);
                                    setSelectedSlot(null);
                                  }}
                                  className="w-full h-16 bg-white hover:bg-stone-100 text-stone-900 rounded-3xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-white/5 active:scale-95 border-none"
                                >
                                  Verstanden
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}
               </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-8">
            {/* NEXT APPOINTMENT */}
            {isLoadingBookings ? (
              <div className="bg-white rounded-[2.5rem] p-8 border border-stone-100 space-y-6">
                 <Skeleton className="h-3 w-24 mb-6" />
                 <div className="flex items-center gap-4">
                    <Skeleton className="w-14 h-14 rounded-2xl" />
                    <div className="space-y-2">
                       <Skeleton className="h-5 w-32" />
                       <Skeleton className="h-3 w-16" />
                    </div>
                 </div>
                 <Skeleton className="h-12 w-full rounded-2xl" />
              </div>
            ) : upcomingBooking ? (
              <div className="bg-blue-950 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-600/30 transition-colors" />
                 <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-blue-400 mb-6">Nächster Termin</h3>
                 
                 <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-blue-400">
                       <CalendarIcon size={24} />
                    </div>
                    <div>
                      <div className="text-xl font-montserrat font-black uppercase tracking-tight">
                        {format(new Date(upcomingBooking.session.start_time), "d. MMMM", { locale: de })}
                      </div>
                      <div className="text-blue-400/80 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                        {format(new Date(upcomingBooking.session.start_time), "HH:mm")} Uhr
                      </div>
                    </div>
                 </div>
                 
                 <div className="p-5 bg-white/5 rounded-2xl border border-white/10 mb-8 backdrop-blur-sm">
                   <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mb-1.5">Behandlung</p>
                   <p className="font-bold text-sm tracking-tight text-blue-50">{upcomingBooking.session.session_type?.name}</p>
                 </div>

                 <Button 
                   variant="outline" 
                   onClick={() => handleCancelExisting(upcomingBooking.id, upcomingBooking.session.start_time)}
                   className="w-full bg-white/5 border-white/10 text-stone-400 hover:bg-red-500 hover:text-white hover:border-red-500 rounded-2xl font-black uppercase tracking-widest text-[10px] h-12 transition-all"
                 >
                    Termin absagen
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
                 {isLoadingBookings ? (
                   [...Array(3)].map((_, i) => (
                     <div key={i} className="flex items-center gap-3">
                       <Skeleton className="w-10 h-10 rounded-xl" />
                       <div className="space-y-2 flex-1">
                         <Skeleton className="h-4 w-3/4" />
                         <Skeleton className="h-3 w-1/2" />
                       </div>
                     </div>
                   ))
                 ) : (
                   <>
                      {myBookings?.slice(0, 5).map((booking) => (
                        <div key={booking.id} className="flex items-center justify-between group">
                           <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center transition-colors font-bold text-xs",
                                booking.status === 'confirmed' ? "bg-blue-50 text-blue-600" : "bg-stone-50 text-stone-400"
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
                      {!myBookings?.length && <p className="text-stone-400 text-[11px] italic">Noch keine Behandlungen.</p>}
                   </>
                 )}
               </div>
            </div>
          </div>
        </div>
      </main>

      <AlertDialog open={cancelBookingId !== null} onOpenChange={(open) => !open && setCancelBookingId(null)}>
        <AlertDialogContent className="rounded-[2.5rem] border-stone-200 p-8 sm:rounded-[2.5rem]">
          <AlertDialogHeader>
            <div className="w-20 h-20 bg-red-50 rounded-[2rem] flex items-center justify-center text-red-500 mb-6 mx-auto md:mx-0 shadow-sm">
              <AlertCircle size={36} />
            </div>
            <AlertDialogTitle className="text-2xl font-montserrat font-black text-blue-950 uppercase tracking-tighter">
              Termin stornieren?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-stone-500 font-medium leading-relaxed mt-2">
              Möchten Sie diesen anstehenden Termin wirklich absagen? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-8 gap-3 sm:gap-0">
            <AlertDialogCancel className="h-14 rounded-2xl font-bold uppercase tracking-widest text-xs border-stone-200 hover:bg-stone-50">
              Abbrechen
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancellation}
              className="h-14 rounded-2xl bg-red-500 text-white hover:bg-red-600 font-bold uppercase tracking-widest text-xs border-none"
            >
              Ja, stornieren
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
