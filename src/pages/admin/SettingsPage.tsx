import AdminLayout from "./AdminLayout";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <AdminLayout>
      <div className="mb-10">
        <h1 className="text-3xl font-montserrat font-bold text-stone-900 border-stone-100">Einstellungen</h1>
        <p className="text-stone-500 mt-1">Globale Praxis-Einstellungen und System-Konfiguration.</p>
      </div>

      <Card className="border-stone-200 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-lg font-montserrat font-bold text-stone-900">Praxis-Einstellungen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-20 text-stone-400">
            <Settings size={48} className="mb-4 text-stone-200" />
            <p className="text-sm">Die Einstellungen werden in Kürze implementiert.</p>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
