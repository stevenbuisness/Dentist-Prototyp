import React, { useState } from "react";
import { X, CheckCircle2, AlertCircle, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";
import { ManualBookingModal } from "./ManualBookingModal";
import { BookingEditModal } from "./BookingEditModal";
import { useQueryClient } from "@tanstack/react-query";
import { useAvailabilityExceptions } from "../../hooks/useAvailability";

interface DailyDetailPanelProps {
  dateStr: string | null;
  bookings: any[];
  onClose: () => void;
  onDateChange?: (date: string | null) => void;
}

export const DailyDetailPanel: React.FC<DailyDetailPanelProps> = ({ 
  dateStr, 
  bookings, 
  onClose,
  onDateChange
}) => {
  const isOpen = !!dateStr;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTime, setModalTime] = useState<string | null>(null);
  const [selectedEditBooking, setSelectedEditBooking] = useState<any | null>(null);
  const queryClient = useQueryClient();

  // Exception check for the currently displayed day
  const { data: availabilityExceptions = [] } = useAvailabilityExceptions();
  const exceptionForDay = React.useMemo(() => {
    if (!dateStr) return null;
    return (availabilityExceptions as any[]).find(
      (ex) => ex.is_closed && dateStr >= ex.start_date && dateStr <= ex.end_date
    ) || null;
  }, [dateStr, availabilityExceptions]);
  const isDayBlocked = !!exceptionForDay;

  const handlePrevDay = () => {
    if (!dateStr || !onDateChange) return;
    const current = new Date(dateStr);
    current.setDate(current.getDate() - 1);
    
    // Skip weekends (0 = Sunday, 6 = Saturday)
    while (current.getDay() === 0 || current.getDay() === 6) {
      current.setDate(current.getDate() - 1);
    }
    
    onDateChange(current.toLocaleDateString("en-CA"));
  };

  const handleNextDay = () => {
    if (!dateStr || !onDateChange) return;
    const current = new Date(dateStr);
    current.setDate(current.getDate() + 1);
    
    // Skip weekends (0 = Sunday, 6 = Saturday)
    while (current.getDay() === 0 || current.getDay() === 6) {
      current.setDate(current.getDate() + 1);
    }
    
    onDateChange(current.toLocaleDateString("en-CA"));
  };

  // Filter bookings for the selected day - ensuring exact match with useAdminStats logic
  const filteredBookings = React.useMemo(() => {
    if (!dateStr) return [];
    return bookings.filter(b => {
      const bStartTime = b.session.start_time;
      // We expect dateStr in YYYY-MM-DD
      return bStartTime.startsWith(dateStr);
    }).sort((a, b) => new Date(a.session.start_time).getTime() - new Date(b.session.start_time).getTime());
  }, [dateStr, bookings]);

  // Timeline Config
  const START_HOUR = 8;
  const END_HOUR = 18;
  const TOTAL_HOURS = END_HOUR - START_HOUR;
  const TOTAL_MINUTES = TOTAL_HOURS * 60;
  const hours = Array.from({ length: TOTAL_HOURS + 1 }, (_, i) => START_HOUR + i);

  const getPositionPercent = (timeStr: string) => {
    const date = new Date(timeStr);
    const h = date.getHours();
    const m = date.getMinutes();
    const totalMinutesSince8 = (h - START_HOUR) * 60 + m;
    return (totalMinutesSince8 / TOTAL_MINUTES) * 100;
  };

  const getDurationPercent = (durationMin: number) => {
    return (durationMin / TOTAL_MINUTES) * 100;
  };

  const [hoverTime, setHoverTime] = useState<string | null>(null);
  const [hoverTop, setHoverTop] = useState<number>(0);

  const calculateSnappedTime = (y: number, height: number) => {
    const percentage = y / height;
    const totalMinutesSince8 = percentage * TOTAL_MINUTES;
    const hour = START_HOUR + Math.floor(totalMinutesSince8 / 60);
    const mins = Math.floor(totalMinutesSince8 % 60);
    const snappedMins = mins < 30 ? 0 : 30;
    
    // Check lunch break (12:00 - 13:00)
    if (hour === 12) return null;
    if (hour < START_HOUR || hour >= END_HOUR) return null;
    
    return {
      hour,
      mins: snappedMins,
      timeStr: `${hour.toString().padStart(2, "0")}:${snappedMins.toString().padStart(2, "0")}`,
      topPercent: (((hour - START_HOUR) * 60 + snappedMins) / TOTAL_MINUTES) * 100
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDayBlocked) return; // No hover on blocked days
    const rect = e.currentTarget.getBoundingClientRect();
    const snapped = calculateSnappedTime(e.clientY - rect.top, rect.height);
    
    if (snapped) {
      setHoverTime(snapped.timeStr);
      setHoverTop(snapped.topPercent);
    } else {
      setHoverTime(null);
    }
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDayBlocked) return; // Block booking on exception days
    const rect = e.currentTarget.getBoundingClientRect();
    const snapped = calculateSnappedTime(e.clientY - rect.top, rect.height);
    
    if (snapped) {
      setModalTime(snapped.timeStr);
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {/* Invisible Backdrop for closing */}
      <div 
        className={cn(
          "fixed inset-0 z-40 transition-opacity duration-500",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <div className={cn(
        "fixed top-0 right-0 h-full w-[440px] bg-white shadow-[-30px_0_60px_rgba(0,0,0,0.08)] z-50 transform transition-transform duration-500 ease-out border-l border-stone-100 flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="p-8 pb-5 border-b border-stone-50 flex items-center justify-between bg-white shrink-0">
          <div className="flex-1 flex flex-col">
            <div className="flex items-center gap-3">
              <button 
                onClick={handlePrevDay}
                className="p-1.5 hover:bg-stone-50 rounded-lg text-stone-300 hover:text-stone-900 transition-all"
                title="Vorheriger Tag"
              >
                <ChevronLeft size={20} />
              </button>
              <h2 className="text-2xl font-montserrat font-black text-stone-900 tracking-tight leading-none">Tagesansicht</h2>
              <button 
                onClick={handleNextDay}
                className="p-1.5 hover:bg-stone-50 rounded-lg text-stone-300 hover:text-stone-900 transition-all"
                title="Nächster Tag"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <p className="text-[13px] text-primary font-bold mt-2 uppercase tracking-widest pl-1">
              {dateStr ? new Date(dateStr).toLocaleDateString("de-DE", { weekday: 'long', day: 'numeric', month: 'long' }) : ""}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-stone-50 rounded-2xl transition-all text-stone-300 hover:text-stone-900 border border-stone-100/50 ml-4"
          >
            <X size={22} />
          </button>
        </div>

        {/* Timeline Content - Flex-1 makes it fill the space dynamically */}
        <div className="flex-1 p-8 pt-10 pb-12 relative bg-white flex flex-col min-h-0">

          {/* Exception / Holiday Banner */}
          {isDayBlocked && (
            <div className="mb-6 flex items-start gap-4 p-5 bg-red-50 border border-red-200 rounded-2xl shrink-0 animate-in fade-in duration-300">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="font-black text-red-700 text-sm uppercase tracking-wide">{exceptionForDay?.reason || 'Geschlossen'}</p>
                <p className="text-red-500 text-xs mt-1">Die Praxis ist an diesem Tag geschlossen. Es können keine Termine gebucht werden.</p>
              </div>
            </div>
          )}

          <div className="relative flex-1 w-full">
            {/* Time markers */}
            {hours.map((h) => {
              const top = ((h - START_HOUR) * 60 / TOTAL_MINUTES) * 100;
              return (
                <div 
                  key={h} 
                  className="absolute w-full flex items-center gap-6 text-stone-400"
                  style={{ top: `${top}%`, transform: 'translateY(-50%)' }}
                >
                  <span className="text-sm font-black w-12 text-right tabular-nums text-stone-900">{h}:00</span>
                  <div className="flex-1 h-[1.5px] bg-stone-50" />
                </div>
              );
            })}

            {/* Lunch Break visualization (12:00 - 13:00) */}
            <div 
              className="absolute left-[72px] right-0 bg-stone-50/60 border-y border-stone-100/50 flex flex-col items-center justify-center pointer-events-none z-10"
              style={{ 
                top: `${((12 - START_HOUR) * 60 / TOTAL_MINUTES) * 100}%`, 
                height: `${(60 / TOTAL_MINUTES) * 100}%` 
              }}
            >
              <div className="text-[10px] font-black text-stone-300 uppercase tracking-[0.2em] flex items-center gap-3">
                <div className="w-6 h-[1px] bg-stone-200" />
                Pause
                <div className="w-6 h-[1px] bg-stone-200" />
              </div>
            </div>

            {/* Ghost Slot Hover Indicator - only on non-blocked days */}
            {hoverTime && !isDayBlocked && (
              <div 
                className="absolute left-[72px] right-0 bg-primary/10 border-2 border-primary/20 rounded-2xl border-dashed pointer-events-none flex items-center justify-center animate-in fade-in duration-200"
                style={{ 
                  top: `${hoverTop}%`, 
                  height: `${(30 / TOTAL_MINUTES) * 100}%`,
                  zIndex: 5
                }}
              >
                <div className="flex items-center gap-1.5 text-primary/60 font-black text-[10px] uppercase tracking-wider">
                  <Plus size={12} /> {hoverTime} Uhr buchen
                </div>
              </div>
            )}

            {/* Bookings Overlay */}
            <div 
              className={cn(
                "absolute left-[72px] right-0 h-full transition-colors group/timeline",
                isDayBlocked 
                  ? "cursor-not-allowed" 
                  : "cursor-pointer hover:bg-stone-50/5"
              )}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setHoverTime(null)}
              onClick={handleTimelineClick}
            >
              {filteredBookings.map((booking, index) => {
                const startTime = booking.session?.start_time;
                if (!startTime) return null;

                const top = getPositionPercent(startTime);
                
                // Visual Override: Past bookings for "Kontroll" might be 20, but we force 30 for the timeline slot layout
                const isKontroll = booking.session?.session_type?.name?.toLowerCase().includes("kontroll") || 
                                  booking.session?.session_type?.name?.toLowerCase().includes("untersuchung");
                const duration = isKontroll ? 30 : (booking.session?.session_type?.duration_minutes || 30);
                
                const height = getDurationPercent(duration);
                const actualHeight = height; // Set purely based on duration for correct visual sizing

                // Simple overlap detection (check if any other booking starts at the same time)
                const concurrent = filteredBookings.filter(b => b.session.start_time === booking.session.start_time);
                const width = concurrent.length > 1 ? `${100 / concurrent.length}%` : "100%";
                const left = concurrent.length > 1 ? `${(concurrent.indexOf(booking) * 100) / concurrent.length}%` : "0%";
                const zIndex = 20 + index;

                const isShort = duration <= 30;

                return (
                  <div 
                    key={booking.id}
                    title={`${booking.user?.first_name} ${booking.user?.last_name} – ${booking.session.session_type?.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEditBooking(booking);
                    }}
                    onMouseMove={(e) => {
                      e.stopPropagation();
                      setHoverTime(null);
                    }}
                    className={cn(
                      "absolute rounded-xl p-2 px-3 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer border-2",
                      booking.status === "confirmed" ? "bg-primary/5 border-primary/20 hover:bg-primary/10" : 
                      booking.status === "attended" ? "bg-stone-50 border-stone-100 hover:bg-stone-100/50" :
                      booking.status === "no_show" ? "bg-amber-50/95 border-amber-100 hover:bg-amber-100/50" :
                      "bg-stone-50/95 border-stone-100 hover:bg-stone-100/50"
                    )}
                    style={{ 
                      top: `${top}%`, 
                      height: `${actualHeight}%`,
                      left: left,
                      width: width,
                      zIndex: zIndex
                    }}
                  >
                    <div className="flex items-center justify-between h-full gap-2">
                      <div className={cn("flex flex-1 overflow-hidden", isShort ? "flex-row items-center gap-2" : "flex-col h-full justify-center")}>
                        <span className={cn("font-bold text-stone-900 leading-tight block truncate", isShort ? "text-[12px] shrink-0" : "text-[13px]")}>
                          {booking.user?.last_name} {booking.user?.first_name}
                        </span>
                        {!isShort ? (
                          <div className="flex flex-col mt-0.5">
                            <span className="text-[9px] text-primary font-black uppercase tracking-widest leading-tight block truncate">
                              {booking.session.session_type?.name}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[9px] text-primary font-black uppercase tracking-widest leading-none truncate bg-white/50 px-1.5 py-0.5 rounded-md border border-white flex-1 min-w-0 text-right">
                            {booking.session.session_type?.name}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end shrink-0 justify-center">
                        <div className="text-[10px] text-primary font-bold bg-white/80 px-2 py-0.5 rounded-lg border border-primary/10 shadow-sm tabular-nums whitespace-nowrap">
                          {new Date(booking.session.start_time).toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Empty State */}
              {filteredBookings.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-20 select-none">
                  <CheckCircle2 size={60} className="text-stone-300 mb-4" />
                  <p className="text-lg font-bold text-stone-400">Keine Termine</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer info shrink-0 ensures it stays anchored */}
        {filteredBookings.length > 0 && (
          <div className="p-8 pb-10 bg-stone-50 border-t border-stone-100 shrink-0">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-[22px] bg-white border-2 border-stone-100 flex items-center justify-center shadow-sm">
                <AlertCircle size={28} className="text-primary" />
              </div>
              <div>
                <div className="text-lg font-black text-stone-900">{filteredBookings.length} Geplante Termine</div>
                <div className="text-[11px] text-stone-400 font-black uppercase tracking-[0.1em]">Strukturierte Auslastung</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ManualBookingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultDateStr={dateStr}
        defaultTimeStr={modalTime}
        onSuccess={() => {
          setIsModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
        }}
      />

      <BookingEditModal 
        isOpen={!!selectedEditBooking}
        onClose={() => setSelectedEditBooking(null)}
        booking={selectedEditBooking}
      />
    </>
  );
};
