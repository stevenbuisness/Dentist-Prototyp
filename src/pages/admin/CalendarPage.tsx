import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { useToast } from "../../hooks/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Calendar as CalendarIcon, Clock, Plus, Trash2, ShieldAlert } from "lucide-react";
import { Badge } from "../../components/ui/badge";

const DAYS = [
  { id: 1, name: "Montag" },
  { id: 2, name: "Dienstag" },
  { id: 3, name: "Mittwoch" },
  { id: 4, name: "Donnerstag" },
  { id: 5, name: "Freitag" },
];

export default function CalendarPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddingException, setIsAddingException] = useState(false);
  const [newEx, setNewEx] = useState({ start_date: "", end_date: "", reason: "", is_closed: true });

  // 1. Fetch Availability Rules
  const { data: rules = [] } = useQuery({
    queryKey: ["availability-rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("availability_rules")
        .select("*")
        .order("day_of_week", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // 2. Fetch Exceptions
  const { data: exceptions = [] } = useQuery({
    queryKey: ["availability-exceptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("availability_exceptions")
        .select("*")
        .order("start_date", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  // 3. Mutations
  const updateRule = useMutation({
    mutationFn: async (rule: { day_of_week: number; start_time: string; end_time: string }) => {
      const { error } = await supabase
        .from("availability_rules")
        .upsert(rule, { onConflict: "day_of_week" });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability-rules"] });
      toast({ title: "Öffnungszeit aktualisiert" });
    },
  });

  const addException = useMutation({
    mutationFn: async (ex: typeof newEx) => {
      const { error } = await supabase.from("availability_exceptions").insert(ex);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability-exceptions"] });
      setIsAddingException(false);
      setNewEx({ start_date: "", end_date: "", reason: "", is_closed: true });
      toast({ title: "Ausnahme hinzugefügt" });
    },
  });

  const deleteException = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("availability_exceptions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["availability-exceptions"] });
      toast({ title: "Ausnahme entfernt" });
    },
  });

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-montserrat font-bold text-stone-900">Verfügbarkeit & Kalender</h1>
        <p className="text-stone-500 mt-1">Hier legen Sie die generellen Öffnungszeiten und Urlaubszeiten Ihrer Praxis fest.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Regular Hours */}
        <Card className="border-stone-200 shadow-sm bg-white">
          <CardHeader className="bg-stone-50/50 border-b border-stone-100">
            <CardTitle className="text-lg font-montserrat font-bold text-stone-900 flex items-center gap-2">
              <Clock size={20} className="text-blue-600" /> Standard-Öffnungszeiten
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {rules.length === 0 ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 animate-pulse bg-stone-50 rounded-2xl border border-stone-100" />
                ))
              ) : (
                DAYS.map((day) => {
                  const rule = rules.find((r) => r.day_of_week === day.id);
                  const startTime = rule?.start_time?.slice(0, 5) || "08:00";
                  const endTime = rule?.end_time?.slice(0, 5) || "17:00";
                  
                  return (
                    <div key={day.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border border-stone-100 rounded-2xl hover:bg-stone-50/80 transition-all bg-white shadow-sm group">
                      <div className="flex items-center gap-4">
                        {/* Day Avatar/Icon */}
                        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                          {day.name.substring(0, 2)}
                        </div>
                        
                        {/* Day Details */}
                        <div className="flex flex-col">
                          <span className="font-montserrat font-bold text-base text-stone-900">{day.name}</span>
                          <div className="flex items-center gap-1.5 mt-0.5 text-stone-400 text-[10px] uppercase font-bold tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> 
                            inkl. Pause 12—13 Uhr
                          </div>
                        </div>
                      </div>
                      
                      {/* Time Inputs */}
                      <div className="flex items-center gap-2 bg-stone-50/50 p-1.5 rounded-xl border border-stone-100 group-hover:border-stone-200 transition-colors">
                        <Input 
                          type="time" 
                          value={startTime} 
                          onChange={(e) => updateRule.mutate({ day_of_week: day.id, start_time: e.target.value, end_time: endTime })}
                          className="h-9 w-24 text-sm font-bold bg-white border-stone-200 text-stone-800 focus-visible:ring-1 focus-visible:ring-emerald-500 text-center shadow-sm" 
                        />
                        <span className="text-stone-300 font-bold px-1">–</span>
                        <Input 
                          type="time" 
                          value={endTime} 
                          onChange={(e) => updateRule.mutate({ day_of_week: day.id, start_time: startTime, end_time: e.target.value })}
                          className="h-9 w-24 text-sm font-bold bg-white border-stone-200 text-stone-800 focus-visible:ring-1 focus-visible:ring-emerald-500 text-center shadow-sm" 
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="mt-8 p-5 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-800 leading-relaxed flex gap-4">
              <ShieldAlert size={24} className="shrink-0 text-blue-500" />
              <div className="space-y-1">
                <p className="font-bold uppercase tracking-wider text-[10px]">Wichtiger Hinweis</p>
                <p>Es ist eine feste Mittagspause von 12:00 - 13:00 Uhr hinterlegt. Änderungen hier wirken sich nur auf zukünftige Planung aus.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exceptions / Holidays */}
        <div className="space-y-6">
          <Card className="border-stone-200 shadow-sm bg-white">
            <CardHeader className="bg-stone-50/50 border-b border-stone-100 flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-montserrat font-bold text-stone-900 flex items-center gap-2">
                <CalendarIcon size={20} className="text-emerald-600" /> Ausnahmen & Urlaub
              </CardTitle>
              <Button size="sm" variant="ghost" onClick={() => setIsAddingException(true)} className="h-8 w-8 p-0 border border-stone-200 text-emerald-600 hover:bg-emerald-50">
                <Plus size={18} />
              </Button>
            </CardHeader>
            <CardContent className="pt-6">
              {isAddingException && (
                <div className="mb-6 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-emerald-700 uppercase">Startdatum</label>
                      <Input type="date" value={newEx.start_date} onChange={(e) => setNewEx({...newEx, start_date: e.target.value})} className="h-9 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-emerald-700 uppercase">Enddatum</label>
                      <Input type="date" value={newEx.end_date} onChange={(e) => setNewEx({...newEx, end_date: e.target.value})} className="h-9 text-sm" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-emerald-700 uppercase">Grund</label>
                    <Input placeholder="z.B. Fortbildung, Praxisurlaub..." value={newEx.reason} onChange={(e) => setNewEx({...newEx, reason: e.target.value})} className="h-9 text-sm" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setIsAddingException(false)} className="text-xs">Abbrechen</Button>
                    <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700 text-xs px-4" onClick={() => addException.mutate(newEx)}>Speichern</Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {exceptions.length === 0 ? (
                  addException.isPending ? (
                    <div className="h-16 animate-pulse bg-stone-50 rounded-xl border border-stone-100" />
                  ) : (
                    <div className="text-center py-10 text-stone-400 text-sm italic">
                      Keine Ausnahmen eingetragen.
                    </div>
                  )
                ) : (
                  exceptions.map((ex) => (
                    <div key={ex.id} className="flex items-center justify-between p-4 border border-stone-100 rounded-xl hover:shadow-sm transition-all group">
                      <div>
                        <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                          {ex.reason} 
                          <Badge className="bg-stone-100 text-stone-500 text-[9px] hover:bg-stone-100 uppercase tracking-tighter">
                            {ex.is_closed ? "Geschlossen" : "Teilweise"}
                          </Badge>
                        </div>
                        <div className="text-xs text-stone-500 mt-1">
                          {new Date(ex.start_date).toLocaleDateString("de-DE")} – {new Date(ex.end_date).toLocaleDateString("de-DE")}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-stone-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteException.mutate(ex.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
