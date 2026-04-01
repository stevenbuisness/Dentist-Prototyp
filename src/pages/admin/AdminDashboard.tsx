import AdminLayout from "./AdminLayout";
import { useAuthContext } from "../../contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Users, Calendar, ClipboardList, TrendingUp, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useAdminStats } from "../../hooks/useAdminStats";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";
import { MonthlyOccupancyChart } from "../../components/admin/MonthlyOccupancyChart";
import { DailyDetailPanel } from "../../components/admin/DailyDetailPanel";

export default function AdminDashboard() {
  const { profile } = useAuthContext();
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const { data: stats, isLoading, isError } = useAdminStats(selectedMonth);
  const [isNextApptsExpanded, setIsNextApptsExpanded] = useState(false);
  const [isMonthView, setIsMonthView] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const upcoming = stats?.upcomingBookings || [];
  const nextBooking = upcoming[0];
  const others = upcoming.slice(1);

  const metrics = [
    {
      label: "Heutige Termine",
      value: stats?.todayCount ?? 0,
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "Geplante Besuche heute"
    },
    {
      label: "Neue Buchungen",
      value: stats?.newSevenDays ?? 0,
      icon: ClipboardList,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      description: "Letzte 7 Tage"
    },
    {
      label: "Aktive Patienten",
      value: stats?.patientCount ?? 0,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
      description: "Gesamte Datenbank"
    },
    {
      label: "Zuwachs",
      value: "+12%",
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50",
      description: "Im Vergleich zum Vormonat"
    },
  ];

  if (isError) {
    return (
      <AdminLayout>
        <div className="p-8 text-center text-red-500">
          Fehler beim Laden der Statistiken. Bitte versuchen Sie es später erneut.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex flex-col h-full w-full relative">
        {/* Main Dashboard Content */}
        <div className="flex-1">
          <div className="mb-10">
            <h1 className="text-3xl font-montserrat font-bold text-stone-900">
              Willkommen zurück, {profile?.first_name}!
            </h1>
            <p className="text-stone-500 mt-1">Hier ist eine Übersicht Ihrer heutigen Praxis-Aktivitäten.</p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {metrics.map((metric, i) => (
              <Card key={i} className="border-stone-200 shadow-sm bg-white overflow-hidden group hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{metric.label}</span>
                  <div className={`${metric.bg} ${metric.color} p-2 rounded-lg transition-transform group-hover:scale-110`}>
                    <metric.icon size={16} />
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-20 mb-1" />
                  ) : (
                    <div className="text-2xl font-bold text-stone-900 font-montserrat">{metric.value}</div>
                  )}
                  <p className="text-[10px] text-stone-400 mt-0.5">{metric.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Next Appointment Card */}
            <Card className="lg:col-span-1 border-stone-200 shadow-sm bg-white overflow-hidden flex flex-col h-fit">
              <CardHeader className="border-b border-stone-50 bg-stone-50/50 flex flex-row items-center justify-between py-3">
                <CardTitle className="text-[10px] font-montserrat font-bold text-stone-500 uppercase tracking-widest flex items-center gap-2">
                  <Clock size={14} /> Nächster Termin
                </CardTitle>
                {others.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsNextApptsExpanded(!isNextApptsExpanded)}
                    className="h-7 px-2 text-[10px] uppercase font-bold text-stone-400 hover:text-stone-900"
                  >
                    {isNextApptsExpanded ? <ChevronUp size={14} /> : <span className="flex items-center gap-1">+{others.length} mehr <ChevronDown size={14} /></span>}
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-6">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ) : nextBooking ? (
                  <div className="space-y-6">
                    <div className="animate-in fade-in duration-500">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg border border-emerald-100 shadow-sm">
                          {(nextBooking.user?.first_name?.[0] || "?").toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 text-lg leading-tight">
                            {nextBooking.user?.first_name} {nextBooking.user?.last_name}
                          </div>
                          <Badge variant="outline" className="text-[10px] uppercase tracking-wider mt-1 bg-white border-stone-200 text-stone-500">
                            {nextBooking.session?.session_type?.name}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-3 bg-stone-50/50 p-4 rounded-xl border border-stone-100">
                        <div className="flex items-center gap-3 text-sm text-stone-600">
                          <Calendar size={14} className="text-stone-400" />
                          <span className="font-medium">{new Date(nextBooking.session.start_time).toLocaleDateString("de-DE", { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-stone-900">
                          <Clock size={14} className="text-stone-400" />
                          <span className="font-bold text-lg">
                            {new Date(nextBooking.session.start_time).toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' })} Uhr
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expanded List of others */}
                    {isNextApptsExpanded && others.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-stone-100 space-y-4 animate-in slide-in-from-top-2 duration-300">
                        <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Nachfolgende Termine</h4>
                        {others.map((appt: any) => (
                          <div key={appt.id} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center font-bold text-xs group-hover:bg-emerald-100 group-hover:text-emerald-600 transition-colors">
                                {appt.user?.first_name?.[0]}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-stone-800 group-hover:text-stone-950 transition-colors">
                                  {appt.user?.first_name} {appt.user?.last_name}
                                </div>
                                <div className="text-[10px] text-stone-400 font-medium">{appt.session?.session_type?.name}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-bold text-stone-900">
                                {new Date(appt.session.start_time).toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' })} Uhr
                              </div>
                              <div className="text-[9px] text-stone-400 uppercase font-bold tracking-tighter">
                                {new Date(appt.session.start_time).toLocaleDateString("de-DE", { weekday: 'short', day: '2-digit', month: 'short' })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10 opacity-40">
                    <Calendar size={40} className="mx-auto mb-3 text-stone-300" />
                    <p className="text-sm italic">Keine anstehenden Termine</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Practice Activity Card */}
            <Card className="lg:col-span-2 border-stone-200 shadow-sm bg-white overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-montserrat font-bold text-stone-900 flex items-center gap-2">
                  Praxis-Auslastung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-100">
                        Kapazität heute
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold inline-block text-emerald-600">
                        {stats?.occupancyToday ?? 0}%
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-stone-100">
                    <div
                      style={{ width: `${stats?.occupancyToday ?? 0}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500 transition-all duration-1000 ease-out"
                    ></div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-stone-50">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Wochenanalyse (Forecast)</h4>
                    <button
                      onClick={() => setIsMonthView(!isMonthView)}
                      className="text-[9px] font-bold text-stone-500 hover:text-stone-900 flex items-center gap-1 transition-colors uppercase tracking-wider"
                    >
                      {isMonthView ? "Zur Woche" : "Monatsansicht"}
                      <Calendar size={10} />
                    </button>
                  </div>

                  {isMonthView ? (
                    <MonthlyOccupancyChart
                      selectedMonth={selectedMonth}
                      onMonthChange={(date) => {
                        setSelectedMonth(date);
                        setSelectedDay(null);
                      }}
                      onDayClick={setSelectedDay}
                      data={stats?.monthlyOccupancy || {}}
                    />
                  ) : (
                    <div className="flex items-end justify-between h-32 gap-2 px-2">
                      {stats?.weeklyOccupancy?.map((day: any) => {
                        const isToday = day.date === new Date().toLocaleDateString("en-CA");
                        const isSelected = day.date === selectedDay;

                        const colorClasses: Record<string, string> = {
                          emerald: isToday ? "bg-emerald-500" : "bg-emerald-400/80 group-hover:bg-emerald-500",
                          orange: isToday ? "bg-orange-500" : "bg-orange-400/80 group-hover:bg-orange-500",
                          red: isToday ? "bg-red-500" : "bg-red-400/80 group-hover:bg-red-500"
                        };

                        return (
                          <div
                            key={day.date}
                            onClick={() => setSelectedDay(day.date)}
                            className="flex-1 flex flex-col items-center gap-3 group cursor-pointer"
                          >
                            <div className={cn(
                              "relative w-full flex flex-col justify-end h-24 p-0.5 rounded-lg transition-all",
                              isSelected && "ring-1 ring-stone-900 ring-offset-2 scale-105"
                            )}>
                              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-3 py-1.5 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-30 scale-90 group-hover:scale-100 border border-white/10">
                                <div className="text-[11px] font-bold font-montserrat">{day.percentage}% Kapazität</div>
                              </div>
                              <div className="absolute inset-0 bg-stone-50 rounded-lg group-hover:bg-stone-100/80 transition-colors" />
                              <div
                                className={cn(
                                  "relative w-full rounded-lg transition-all duration-700 ease-out shadow-sm",
                                  colorClasses[day.statusColor] || "bg-stone-300"
                                )}
                                style={{ height: `${Math.max(day.percentage, 6)}%` }}
                              />
                            </div>
                            <div className="relative flex flex-col items-center mt-2 w-full">
                              <span className={cn(
                                "text-[11px] font-black uppercase tracking-widest transition-colors",
                                isToday ? "text-emerald-500" : "text-stone-400 group-hover:text-stone-600"
                              )}>
                                {day.dayName}
                              </span>
                              {isToday && <div className="absolute top-full mt-1 w-1 h-1 bg-emerald-500 rounded-full" />}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Side Detail Panel */}
        <DailyDetailPanel
          dateStr={selectedDay}
          bookings={stats?.allBookings || []}
          onClose={() => setSelectedDay(null)}
          onDateChange={setSelectedDay}
        />
      </div>
    </AdminLayout>
  );
}
