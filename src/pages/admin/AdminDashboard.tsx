import AdminLayout from "./AdminLayout";
import { useAuthContext } from "../../contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Users, Calendar, ClipboardList, TrendingUp, Clock } from "lucide-react";
import { useAdminStats } from "../../hooks/useAdminStats";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";

export default function AdminDashboard() {
  const { profile } = useAuthContext();
  const { data: stats, isLoading, isError } = useAdminStats();

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
        <Card className="lg:col-span-1 border-stone-200 shadow-sm bg-white overflow-hidden flex flex-col">
          <CardHeader className="border-b border-stone-50 bg-stone-50/50">
            <CardTitle className="text-sm font-montserrat font-bold text-stone-600 uppercase tracking-widest flex items-center gap-2">
              <Clock size={16} /> Nächster Termin
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center p-6">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ) : stats?.nextBooking ? (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                      {(stats.nextBooking.user?.first_name?.[0] || "?").toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 text-lg leading-tight">
                        {stats.nextBooking.user?.first_name} {stats.nextBooking.user?.last_name}
                      </div>
                      <Badge variant="outline" className="text-[10px] uppercase tracking-tighter mt-1 bg-white">
                        {stats.nextBooking.session?.session_type?.name}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-stone-600">
                      <Calendar size={14} className="text-stone-300" />
                      <span>{new Date(stats.nextBooking.session.start_time).toLocaleDateString("de-DE", { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-stone-600">
                      <Clock size={14} className="text-stone-300" />
                      <span className="font-bold">
                        {new Date(stats.nextBooking.session.start_time).toLocaleTimeString("de-DE", { hour: '2-digit', minute: '2-digit' })} Uhr
                      </span>
                    </div>
                  </div>
                </div>
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
        <Card className="lg:col-span-2 border-stone-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-montserrat font-bold text-stone-900 flex items-center gap-2">
              Praxis-Auslastung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
                    Kapazität heute
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-emerald-600">
                    {stats?.occupancyToday}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-stone-100">
                <div style={{ width: `${stats?.occupancyToday}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"></div>
              </div>
            </div>
            
            <div className="mt-8 p-6 border-2 border-dashed border-stone-100 rounded-xl flex flex-col items-center justify-center text-stone-300 opacity-60">
              <TrendingUp size={48} className="mb-2" />
              <p className="text-sm font-montserrat">Wochenanalyse-Grafik (in Arbeit)</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
