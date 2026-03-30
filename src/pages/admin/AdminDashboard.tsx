import AdminLayout from "./AdminLayout";
import { useAuthContext } from "../../contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Users, Calendar, ClipboardList, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { profile } = useAuthContext();

  const stats = [
    { label: "Heutige Termine", value: "0", icon: Calendar, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Neue Buchungen", value: "0", icon: ClipboardList, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Aktive Patienten", value: "3", icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Wochenbericht", value: "+12%", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
  ];

  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-montserrat font-bold text-stone-900 border-stone-100">Willkommen zurück, {profile?.first_name}!</h1>
        <p className="text-stone-500 mt-1">Hier ist eine Übersicht Ihrer heutigen Aktivitäten.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <Card key={i} className="border-stone-200 shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{stat.label}</span>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                <stat.icon size={18} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-stone-900 font-montserrat">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-stone-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-montserrat font-bold text-stone-900">Letzte Aktivitäten</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-20 text-stone-400">
              <ClipboardList size={40} className="mb-4 text-stone-200" />
              <p className="text-sm">Noch keine Aktivitäten protokolliert.</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-stone-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg font-montserrat font-bold text-stone-900">Praxis-Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <span className="text-sm font-medium text-stone-700">Heutige Auslastung</span>
                <span className="text-sm font-bold text-stone-900">0%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-stone-50 rounded-lg">
                <span className="text-sm font-medium text-stone-700">Nächster Termin</span>
                <span className="text-sm font-bold text-stone-500 italic">Keine Termine</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
