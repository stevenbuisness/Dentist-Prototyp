import { useState } from "react";
import { X, CheckCircle2, XCircle, AlertCircle, Clock, Trash2, User } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { supabase } from "../../lib/supabase";
import { useToast } from "../../hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface BookingEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: any;
}

export function BookingEditModal({ isOpen, onClose, booking }: BookingEditModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isKontroll = booking?.session?.session_type?.name?.toLowerCase().includes("kontroll") || 
                    booking?.session?.session_type?.name?.toLowerCase().includes("untersuchung");
  const currentDuration = booking?.session?.session_type?.default_duration_minutes || 30;

  if (!isOpen || !booking) return null;

  const updateStatus = async (newStatus: string) => {
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", booking.id);

      if (error) throw error;

      toast({ 
        title: "Status aktualisiert", 
        description: `Termin wurde auf "${newStatus}" gesetzt.` 
      });
      
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      onClose();
    } catch (err: any) {
      toast({ title: "Fehler", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const fixDuration = async () => {
    try {
      setIsSubmitting(true);
      if (!booking?.session?.session_type?.id) return;

      const { error } = await supabase
        .from("session_types")
        .update({ default_duration_minutes: 30 })
        .eq("id", booking.session.session_type.id);

      if (error) throw error;

      toast({ 
        title: "Dauer korrigiert", 
        description: `Die Behandlungsart "${booking.session.session_type.name}" wurde auf 30 Min angepasst.` 
      });
      
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["sessionTypes"] });
    } catch (err: any) {
      toast({ title: "Fehler", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };


  const deleteBooking = async () => {
    if (!confirm("Möchten Sie diesen Termin wirklich endgültig löschen?")) return;
    
    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("bookings")
        .delete()
        .eq("id", booking.id);

      if (error) throw error;

      toast({ title: "Gelöscht", description: "Der Termin wurde entfernt." });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      onClose();
    } catch (err: any) {
      toast({ title: "Fehler", description: err.message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusOptions = [
    { id: "confirmed", label: "Bestätigt", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { id: "attended", label: "Erschienen", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
    { id: "no_show", label: "Nicht erschienen", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { id: "canceled_by_admin", label: "Abgesagt", icon: XCircle, color: "text-red-600", bg: "bg-red-50", border: "border-red-100" },
  ];

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-sm bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center">
                <Clock size={20} />
             </div>
             <div>
                <h3 className="text-lg font-montserrat font-bold text-stone-900">Termin Status</h3>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Verwalten</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-xl text-stone-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Patient Info Summary */}
          <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-100">
            <div className="w-12 h-12 rounded-xl bg-white border border-stone-100 flex items-center justify-center text-stone-400">
              <User size={24} />
            </div>
            <div className="flex-1">
              <div className="font-bold text-stone-900">{booking.user?.last_name} {booking.user?.first_name}</div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-xs text-stone-500">{booking.session?.session_type?.name}</span>
                <span className="text-[10px] font-black text-stone-400 bg-stone-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                   <Clock size={10} />
                   {booking.session?.session_type?.duration_minutes || booking.session?.duration_minutes || 30} Min
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {statusOptions.map((opt) => (
              <button
                key={opt.id}
                disabled={isSubmitting}
                onClick={() => updateStatus(opt.id)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border transition-all group",
                  booking.status === opt.id 
                    ? `${opt.bg} ${opt.border} ring-1 ring-offset-1 ring-current`
                    : "bg-white border-stone-100 hover:border-stone-200 hover:bg-stone-50"
                  , opt.color
                )}
              >
                <div className="flex items-center gap-3 font-bold text-sm">
                  <opt.icon size={18} />
                  <span>{opt.label}</span>
                </div>
                {booking.status === opt.id && <div className="w-2 h-2 rounded-full bg-current" />}
              </button>
            ))}
          </div>

          {isKontroll && currentDuration !== 30 && (
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl space-y-3 animate-in slide-in-from-top-1 duration-300">
               <div className="flex items-start gap-3">
                  <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-[11px] text-amber-900 leading-relaxed font-medium">
                    Dieser Termin wird aktuell mit <span className="font-bold">{currentDuration} Min</span> angezeigt. Für Kontrolluntersuchungen wird ein Slot (30 Min) empfohlen.
                  </p>
               </div>
               <Button 
                onClick={fixDuration} 
                disabled={isSubmitting}
                className="w-full h-10 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs gap-2 rounded-xl"
               >
                  Auf 30 Min (1 Slot) anpassen
               </Button>
            </div>
          )}


          <div className="pt-2">
            <button 
              onClick={deleteBooking}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl text-red-500 font-bold text-sm hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
            >
              <Trash2 size={18} />
              Termin komplett entfernen
            </button>
          </div>
        </div>

        <div className="p-4 bg-stone-50/50 border-t border-stone-50">
          <Button variant="ghost" className="w-full h-12 rounded-xl font-bold" onClick={onClose}>
            Schließen
          </Button>
        </div>
      </div>
    </div>
  );
}
