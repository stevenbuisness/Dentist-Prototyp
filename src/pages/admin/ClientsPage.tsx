import { useState } from "react";
import AdminLayout from "./AdminLayout";
import { supabase } from "../../lib/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "../../hooks/use-toast";
import {
  User as UserIcon,
  Search,
  ShieldCheck,
  ShieldOff,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils";

interface Patient {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  role: string;
  status: "active" | "blocked" | "rejected";
  phone_number: string | null;
  city: string | null;
  created_at: string;
}

function usePatients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, first_name, last_name, email, role, status, phone_number, city, created_at")
        .neq("role", "admin")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Patient[];
    },
  });
}

function useUpdatePatientStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "active" | "blocked" }) => {
      const { error } = await supabase.from("users").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients"] }),
  });
}

export default function ClientsPage() {
  const { toast } = useToast();
  const { data: patients = [], isLoading } = usePatients();
  const updateStatus = useUpdatePatientStatus();
  const [search, setSearch] = useState("");

  const filtered = patients.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.first_name?.toLowerCase().includes(q) ||
      p.last_name?.toLowerCase().includes(q) ||
      p.email?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q)
    );
  });

  const handleStatusToggle = (patient: Patient) => {
    const newStatus = patient.status === "active" ? "blocked" : "active";
    const label = newStatus === "blocked" ? "gesperrt" : "entsperrt";
    updateStatus.mutate(
      { id: patient.id, status: newStatus },
      {
        onSuccess: () =>
          toast({
            title: `Patient ${label}`,
            description: `${patient.first_name} ${patient.last_name} wurde ${label}.`,
          }),
        onError: (err: any) =>
          toast({ title: "Fehler", description: err.message, variant: "destructive" }),
      }
    );
  };

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-montserrat font-bold text-stone-900">Patientenverwaltung</h1>
          <p className="text-stone-500 mt-1">
            {patients.length} registrierte Patient{patients.length !== 1 ? "en" : ""}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Name, E-Mail oder Stadt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-stone-200 bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 placeholder:text-stone-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-stone-50/80 text-stone-500 font-montserrat text-xs uppercase tracking-wider font-bold">
              <tr>
                <th className="px-6 py-4 border-b border-stone-100">Patient</th>
                <th className="px-6 py-4 border-b border-stone-100">Kontakt</th>
                <th className="px-6 py-4 border-b border-stone-100">Standort</th>
                <th className="px-6 py-4 border-b border-stone-100">Status</th>
                <th className="px-6 py-4 border-b border-stone-100">Registriert</th>
                <th className="px-6 py-4 border-b border-stone-100 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-stone-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-stone-400 animate-pulse">
                    Lade Patientendaten...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <UserIcon size={40} className="mx-auto text-stone-200 mb-3" />
                    <p className="text-stone-400 font-montserrat font-medium">
                      {search ? "Keine Treffer für Ihre Suche." : "Noch keine Patienten registriert."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                    {/* Name */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 font-bold text-sm flex-shrink-0">
                          {(p.first_name?.[0] || "?").toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-stone-900">
                            {p.first_name} {p.last_name}
                          </div>
                          <div className="text-xs text-stone-400 font-mono">{p.id.slice(0, 8)}…</div>
                        </div>
                      </div>
                    </td>

                    {/* Kontakt */}
                    <td className="px-6 py-4">
                      {p.email && (
                        <div className="flex items-center gap-1.5 text-stone-600 text-xs">
                          <Mail size={12} className="text-stone-300" />
                          {p.email}
                        </div>
                      )}
                      {p.phone_number && (
                        <div className="flex items-center gap-1.5 text-stone-500 text-xs mt-1">
                          <Phone size={12} className="text-stone-300" />
                          {p.phone_number}
                        </div>
                      )}
                    </td>

                    {/* Standort */}
                    <td className="px-6 py-4">
                      {p.city ? (
                        <div className="flex items-center gap-1.5 text-stone-600 text-xs">
                          <MapPin size={12} className="text-stone-300" />
                          {p.city}
                        </div>
                      ) : (
                        <span className="text-stone-300 text-xs">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                          p.status === "active"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : p.status === "blocked"
                            ? "bg-red-50 text-red-700 border-red-100"
                            : "bg-stone-100 text-stone-500 border-stone-200"
                        )}
                      >
                        {p.status === "active" ? "Aktiv" : p.status === "blocked" ? "Gesperrt" : "Abgelehnt"}
                      </span>
                    </td>

                    {/* Datum */}
                    <td className="px-6 py-4 text-xs text-stone-400 font-bold uppercase tracking-widest">
                      {new Date(p.created_at).toLocaleDateString("de-DE")}
                    </td>

                    {/* Aktionen */}
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={updateStatus.isPending}
                        onClick={() => handleStatusToggle(p)}
                        className={cn(
                          "h-8 text-xs font-semibold gap-1.5",
                          p.status === "active"
                            ? "text-red-500 hover:text-red-700 hover:bg-red-50"
                            : "text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50"
                        )}
                      >
                        {p.status === "active" ? (
                          <><ShieldOff size={13} /> Sperren</>
                        ) : (
                          <><ShieldCheck size={13} /> Entsperren</>
                        )}
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
