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
  AlertCircle,
  CalendarCheck,
  Home
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";
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

export default function DashboardPage() {
  const { user, profile } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Data Fetching
  const { data: sessionTypes } = useSessionTypes();
  const { data: myBookings } = useMyBookings(user?.id);
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
    <div className="min-h-screen bg-[#faf8f5] font-lato pb-20">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="w-full px-6 md:px-10 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-montserrat font-bold text-stone-900 hover:opacity-80 transition-opacity">
            <img 
              src="/logo.png" 
              alt="Dr. Schmidt Logo" 
              className="w-10 h-10 object-contain mix-blend-multiply"
            />
            <span>Dr. Schmidt</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1.5 group">
              <Home size={16} /> Zur Startseite
            </Link>
            <Link to="/profile" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors flex items-center gap-1.5 group">
              <UserIcon size={16} /> Profil
            </Link>
            <button onClick={handleLogout} className="px-4 py-2 rounded-md bg-stone-900 text-[#faf8f5] text-sm font-semibold hover:bg-stone-800 transition-colors shadow-sm">
              Abmelden
            </button>
          </div>
        </div>
      </header>
      
      <main className="w-full p-6 md:p-10 space-y-8">
        <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-montserrat font-bold text-stone-900">Guten Tag, {profile?.first_name || "Patient"}!</h1>
            <p className="text-stone-500 mt-1">Verwalten Sie Ihre Gesundheit und buchen Sie neue Termine.</p>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
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
                  {upcomingBooking ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
                      <div className="w-20 h-20 bg-emerald-50 rounded-[2.5rem] flex items-center justify-center text-emerald-500 shadow-inner">
                         <CheckCircle2 size={40} />
                      </div>
                      <div className="max-w-md">
                        <h3 className="text-2xl font-montserrat font-black text-stone-900 uppercase tracking-tight leading-none mb-4">Ein Termin ist bereits reserviert</h3>
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

                      {/* Step 2: Slot Selection */}
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
                        <div className="space-y-6 animate-in zoom-in-95 duration-500 h-full flex flex-col items-center justify-center py-10">
                          <div className="bg-stone-900 rounded-[3rem] p-12 text-center text-white relative overflow-hidden shadow-2xl max-w-lg w-full mx-auto">
                            {/* Inner Glow Background */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
                              <div className="w-64 h-64 bg-emerald-500 rounded-full blur-[100px]" />
                            </div>
                            
                            <div className="relative z-10 flex flex-col items-center">
                              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-emerald-900/50 mb-8 border-4 border-emerald-300 pointer-events-none">
                                <CheckCircle2 size={48} strokeWidth={2.5} className="animate-in fade-in zoom-in duration-500 delay-150" />
                              </div>
                              
                              <h2 className="text-3xl font-montserrat font-black tracking-tight mb-4">
                                Termin gebucht!
                              </h2>
                              
                              <p className="text-stone-300 font-medium leading-relaxed mb-8">
                                Vielen Dank! Wir freuen uns auf Sie. Ihr Termin für eine <strong className="text-white">{selectedType?.name}</strong> ist hiermit verbindlich bestätigt.
                              </p>

                              <div className="bg-white/10 border border-white/10 rounded-3xl p-6 text-left w-full mb-8 backdrop-blur-sm">
                                <p className="text-[10px] text-emerald-400 font-black uppercase tracking-widest mb-1.5 pl-1">Ihr Zeitpunkt</p>
                                <p className="text-[17px] font-bold font-montserrat flex items-center gap-3">
                                  <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0">
                                    <CalendarCheck size={18} />
                                  </div>
                                  {selectedSlot ? format(new Date(selectedSlot.start_time), "EEEE, d. MMMM 'um' HH:mm", { locale: de }) : ""} Uhr
                                </p>
                              </div>

                              <Button 
                                onClick={() => {
                                  setBookingStep(1);
                                  setSelectedSlot(null);
                                }}
                                className="w-full h-16 bg-white hover:bg-stone-100 text-stone-900 rounded-3xl font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-white/5 active:scale-95"
                              >
                                Zurück zur Übersicht
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
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

      <AlertDialog open={cancelBookingId !== null} onOpenChange={(open) => !open && setCancelBookingId(null)}>
        <AlertDialogContent className="rounded-[2.5rem] border-stone-200 p-8 sm:rounded-[2.5rem]">
          <AlertDialogHeader>
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-4 mx-auto md:mx-0">
              <AlertCircle size={32} />
            </div>
            <AlertDialogTitle className="text-2xl font-montserrat font-black text-stone-900">
              Termin stornieren?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-stone-500 font-medium">
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
