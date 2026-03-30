import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { supabase } from "../../lib/supabase";
import { useToast } from "../../hooks/use-toast";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card";
import { Separator } from "../../components/ui/separator";
import { ArrowLeft, Save, User as UserIcon } from "lucide-react";

export default function ProfilePage() {
  const { user, profile, refreshProfile, loading: authLoading } = useAuthContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [postCode, setPostCode] = useState("");
  const [city, setCity] = useState("");
  
  const [isSaving, setIsSaving] = useState(false);

  // Sync form with profile data
  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setDateOfBirth(profile.date_of_birth || "");
      setPhoneNumber(profile.phone_number || "");
      setAddressLine1(profile.address_line_1 || "");
      setPostCode(profile.post_code || "");
      setCity(profile.city || "");
    }
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth || null,
          phone_number: phoneNumber,
          address_line_1: addressLine1,
          post_code: postCode,
          city: city,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;
      await refreshProfile();
    } catch (error: any) {
      toast({
        title: "Fehler beim Speichern",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Lade Profil...</div>;
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] font-lato pb-12">
      {/* Navigation Header */}
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-600"
              title="Zurück"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-montserrat font-bold text-stone-900">Mein Profil</h1>
          </div>
          <Link 
            to="/" 
            className="px-4 py-2 bg-white border border-stone-200 text-stone-900 rounded-md text-sm font-semibold hover:bg-stone-50 transition-colors shadow-sm"
          >
            Zur Startseite
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-8">
        <div className="mb-8">
          <Link 
            to="/dashboard" 
            className="text-xs font-semibold uppercase tracking-wider text-stone-500 hover:text-stone-900 transition-colors flex items-center gap-1 mb-2"
          >
            <ArrowLeft size={12} /> Dashboard
          </Link>
          <h2 className="text-3xl font-montserrat font-bold text-stone-900">Persönliche Daten</h2>
          <p className="text-stone-500 mt-1">Verwalten Sie Ihre Informationen für eine reibungslose Terminplanung.</p>
        </div>

        <Card className="border-stone-200 shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-stone-50/50 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-stone-900 rounded-full flex items-center justify-center text-[#faf8f5]">
                <UserIcon size={24} />
              </div>
              <div>
                <CardTitle className="text-xl font-montserrat text-stone-900">Kontoinformationen</CardTitle>
                <CardDescription className="text-stone-500">{user?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-8">
            <form onSubmit={handleSave} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Vorname</label>
                  <Input 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Max"
                    className="border-stone-200 focus:ring-stone-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Nachname</label>
                  <Input 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Mustermann"
                    className="border-stone-200 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Geburtsdatum</label>
                  <Input 
                    type="date"
                    value={dateOfBirth} 
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="border-stone-200 focus:ring-stone-900"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Telefonnummer</label>
                  <Input 
                    type="tel"
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+49 123 456789"
                    className="border-stone-200 focus:ring-stone-900"
                  />
                </div>
              </div>

              <Separator className="my-4 bg-stone-100" />

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-stone-700">Straße & Hausnummer</label>
                  <Input 
                    value={addressLine1} 
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="Hauptstraße 12"
                    className="border-stone-200 focus:ring-stone-900"
                  />
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div className="space-y-2 col-span-1">
                    <label className="text-sm font-semibold text-stone-700">PLZ</label>
                    <Input 
                      value={postCode} 
                      onChange={(e) => setPostCode(e.target.value)}
                      placeholder="12345"
                      className="border-stone-200 focus:ring-stone-900"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <label className="text-sm font-semibold text-stone-700">Stadt</label>
                    <Input 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Berlin"
                      className="border-stone-200 focus:ring-stone-900"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-stone-900 text-[#faf8f5] hover:bg-stone-800 h-11 px-8 font-semibold transition-all rounded-md flex items-center gap-2 shadow-md"
                >
                  {isSaving ? "Wird gespeichert..." : (
                    <>
                      <Save size={18} />
                      Änderungen speichern
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {profile?.updated_at && (
          <p className="text-center text-[10px] text-stone-400 mt-6 uppercase tracking-widest">
            Letzte Aktualisierung: {new Date(profile.updated_at).toLocaleString('de-DE')}
          </p>
        )}
      </main>
    </div>
  );
}
