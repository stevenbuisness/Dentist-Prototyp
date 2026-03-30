import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { supabase } from "../../lib/supabase";
import { useToast } from "../../hooks/use-toast";
import { Plus, Edit2, Trash2, Clock, Euro, Stethoscope } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";

interface SessionType {
  id: string;
  name: string;
  description: string | null;
  base_price: number | null;
  default_duration_minutes: number;
}

export default function SessionTypesPage() {
  const { toast } = useToast();
  const [types, setTypes] = useState<SessionType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [price, setPrice] = useState("");
  
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("session_types")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      toast({
        title: "Fehler beim Laden",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTypes(data || []);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      description,
      default_duration_minutes: duration,
      base_price: price ? parseFloat(price) : null,
    };

    if (editingId) {
      const { error } = await supabase
        .from("session_types")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        toast({ title: "Fehler beim Bearbeiten", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Kategorie aktualisiert", description: `"${name}" erfolgreich gespeichert.` });
        resetForm();
        fetchTypes();
      }
    } else {
      const { error } = await supabase
        .from("session_types")
        .insert([payload]);

      if (error) {
        toast({ title: "Fehler beim Erstellen", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Kategorie erstellt", description: `"${name}" erfolgreich hinzugefügt.` });
        resetForm();
        fetchTypes();
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Möchten Sie diese Kategorie wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden, wenn bereits Termine damit verknüpft sind.")) return;

    const { error } = await supabase
      .from("session_types")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Fehler beim Löschen", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Gelöscht", description: "Die Kategorie wurde erfolgreich entfernt." });
      fetchTypes();
    }
  };

  const handeEdit = (type: SessionType) => {
    setEditingId(type.id);
    setName(type.name);
    setDescription(type.description || "");
    setDuration(type.default_duration_minutes);
    setPrice(type.base_price?.toString() || "");
    setIsAdding(true);
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setDuration(30);
    setPrice("");
    setEditingId(null);
    setIsAdding(false);
  };

  return (
    <AdminLayout>
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-montserrat font-bold text-stone-900">Behandlungsarten</h1>
          <p className="text-stone-500 mt-1">Verwalten Sie Ihre Leistungskategorien und Standardpreise.</p>
        </div>
        {!isAdding && (
          <Button onClick={() => setIsAdding(true)} className="bg-stone-900 text-[#faf8f5] hover:bg-stone-800 gap-2 shadow-md h-11 px-6">
            <Plus size={18} /> Neue Kategorie
          </Button>
        )}
      </div>

      {isAdding && (
        <Card className="mb-10 border-stone-200 shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-stone-50/50 border-b border-stone-100">
            <CardTitle className="text-xl font-montserrat text-stone-900">
              {editingId ? "Kategorie bearbeiten" : "Neue Kategorie anlegen"}
            </CardTitle>
            <CardDescription className="text-stone-500 text-sm">Definieren Sie Name, Dauer und Standardpreis.</CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700">Name der Behandlung</label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="z.B. Professionelle Zahnreinigung" required className="border-stone-200" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-stone-700">Beschreibung (Optional)</label>
                    <textarea 
                      value={description} 
                      onChange={(e) => setDescription(e.target.value)} 
                      rows={3}
                      placeholder="Details zur Behandlung für Patienten..." 
                      className="w-full rounded-md border border-stone-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 disabled:opacity-50"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-stone-700 flex items-center gap-1.5">
                        <Clock size={14} className="text-stone-400" /> Dauer (min)
                      </label>
                      <Input type="number" value={duration} onChange={(e) => setDuration(parseInt(e.target.value))} required className="border-stone-200" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-stone-700 flex items-center gap-1.5">
                        <Euro size={14} className="text-stone-400" /> Basispreis (€)
                      </label>
                      <Input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="99.00" className="border-stone-200" />
                    </div>
                  </div>
                  
                  <div className="pt-4 flex items-center justify-end gap-3 translate-y-4">
                    <Button variant="ghost" type="button" onClick={resetForm} className="text-stone-500 hover:text-stone-900">Abbrechen</Button>
                    <Button type="submit" className="bg-stone-900 text-[#faf8f5] hover:bg-stone-800 shadow-sm h-11 px-8 font-semibold">
                      Speichern
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20 text-stone-400 animate-pulse">Lade Kategorien...</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {types.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-xl border border-dashed border-stone-300">
              <Stethoscope size={48} className="mx-auto text-stone-200 mb-4" />
              <p className="text-stone-500 font-medium font-montserrat">Keine Kategorien vorhanden.</p>
              <p className="text-stone-400 text-sm mt-1">Legen Sie Ihre erste Behandlungsart an.</p>
            </div>
          ) : (
            types.map((type) => (
              <Card key={type.id} className="border-stone-200 shadow-sm hover:shadow-md transition-all group bg-white">
                <CardHeader className="pb-3 border-b border-stone-50">
                  <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-stone-50 rounded-lg flex items-center justify-center text-stone-600 group-hover:bg-stone-900 group-hover:text-white transition-colors duration-300">
                      <Stethoscope size={20} />
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="ghost" size="icon" onClick={() => handeEdit(type)} className="h-8 w-8 text-stone-500 hover:text-stone-900 hover:bg-stone-100">
                        <Edit2 size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(type.id)} className="h-8 w-8 text-stone-500 hover:text-destructive hover:bg-destructive/5">
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-montserrat font-bold text-stone-900 mt-4">{type.name}</CardTitle>
                  <CardDescription className="line-clamp-2 h-10 text-stone-500 text-sm mt-1">{type.description || "Keine Beschreibung verfügbar."}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4 flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-stone-400">
                  <div className="flex items-center gap-1.5">
                    <Clock size={12} /> {type.default_duration_minutes} min
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-900">
                    <Euro size={12} className="text-stone-300" /> {type.base_price ? type.base_price.toFixed(2) : "n.a."}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </AdminLayout>
  );
}
