import AdminLayout from "./AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Users } from "lucide-react";

export default function ClientsPage() {
  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-montserrat font-bold text-stone-900 border-stone-100">Patientenverwaltung</h1>
        <p className="text-stone-500 mt-1">Hier können Sie alle registrierten Patienten einsehen und verwalten.</p>
      </div>

      <Card className="border-stone-200 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-montserrat font-bold text-stone-900">Patientenliste</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <Users size={48} className="mb-4 text-stone-200" />
            <p className="text-sm">Die Patientenverwaltung wird in Kürze implementiert.</p>
            <p className="text-xs mt-1 italic">Vorschau-Modus aktiv.</p>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
