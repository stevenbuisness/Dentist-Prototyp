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
    <div className="min-h-screen bg-gradient-to-br from-[#faf9f7] via-[#faf9f7] to-[#f4f7fb] relative overflow-hidden font-lato pb-12">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-stone-200/20 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Navigation Header */}
      <header className="relative border-b border-stone-200/60 bg-white/70 backdrop-blur-md sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-600"
              title="Zurück"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="font-montserrat font-black text-blue-950 tracking-tight uppercase text-lg">Mein Profil</h1>
          </div>
          <Link 
            to="/" 
            className="px-4 py-2 bg-white border border-stone-200 text-blue-950 rounded-full text-sm font-bold hover:bg-stone-50 transition-all shadow-sm hover:shadow-md"
          >
            Zur Startseite
          </Link>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 md:px-10 pt-8 z-20">
        <div className="mb-8">
          <Link 
            to="/dashboard" 
            className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 mb-3"
          >
            <ArrowLeft size={12} className="mb-0.5" /> Zurück zum Dashboard
          </Link>
          <h2 className="text-4xl font-montserrat font-black text-blue-950 tracking-tighter mb-2">
            Persönliche Daten
          </h2>
          <p className="text-stone-500 font-medium max-w-2xl">
            Verwalten Sie Ihre Informationen für eine reibungslose Terminplanung und individuelle Betreuung.
          </p>
        </div>

        <Card className="border-stone-200/60 shadow-xl shadow-stone-200/40 overflow-hidden bg-white/80 backdrop-blur-sm rounded-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-transparent border-b border-stone-100/60 p-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-blue-950 rounded-2xl flex items-center justify-center text-[#faf8f5] shadow-lg shadow-blue-950/20 transition-transform hover:rotate-6 cursor-default">
                <UserIcon size={32} />
              </div>
              <div>
                <CardTitle className="text-2xl font-montserrat font-black text-blue-950 tracking-tighter">Kontoinformationen</CardTitle>
                <CardDescription className="text-stone-500 font-medium text-base">{user?.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 md:p-10">
            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-blue-900/40">Vorname</label>
                  <Input 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Max"
                    className="h-12 bg-white border-stone-200 rounded-xl focus:ring-blue-600 focus:border-blue-600 font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-blue-900/40">Nachname</label>
                  <Input 
                    value={lastName} 
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Mustermann"
                    className="h-12 bg-white border-stone-200 rounded-xl focus:ring-blue-600 focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-blue-900/40">Geburtsdatum</label>
                  <Input 
                    type="date"
                    value={dateOfBirth} 
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="h-12 bg-white border-stone-200 rounded-xl focus:ring-blue-600 focus:border-blue-600 font-medium"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-blue-900/40">Telefonnummer</label>
                  <Input 
                    type="tel"
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+49 123 456789"
                    className="h-12 bg-white border-stone-200 rounded-xl focus:ring-blue-600 focus:border-blue-600 font-medium"
                  />
                </div>
              </div>

              <Separator className="bg-stone-100" />

              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[11px] font-black uppercase tracking-widest text-blue-900/40">Straße & Hausnummer</label>
                  <Input 
                    value={addressLine1} 
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="Hauptstraße 12"
                    className="h-12 bg-white border-stone-200 rounded-xl focus:ring-blue-600 focus:border-blue-600 font-medium"
                  />
                </div>

                <div className="grid grid-cols-3 gap-8">
                  <div className="space-y-3 col-span-1">
                    <label className="text-[11px] font-black uppercase tracking-widest text-blue-900/40">PLZ</label>
                    <Input 
                      value={postCode} 
                      onChange={(e) => setPostCode(e.target.value)}
                      placeholder="12345"
                      className="h-12 bg-white border-stone-200 rounded-xl focus:ring-blue-600 focus:border-blue-600 font-medium"
                    />
                  </div>
                  <div className="space-y-3 col-span-2">
                    <label className="text-[11px] font-black uppercase tracking-widest text-blue-900/40">Stadt</label>
                    <Input 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Berlin"
                      className="h-12 bg-white border-stone-200 rounded-xl focus:ring-blue-600 focus:border-blue-600 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSaving}
                  className="bg-blue-950 text-white hover:bg-blue-900 h-14 px-10 font-black uppercase tracking-widest text-xs transition-all rounded-xl flex items-center gap-3 shadow-xl shadow-blue-950/20 hover:scale-[1.02] active:scale-[0.98]"
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
          <p className="text-center text-[10px] text-stone-400 mt-10 uppercase tracking-[0.3em] font-bold">
            Letzte Aktualisierung: {new Date(profile.updated_at).toLocaleString('de-DE')}
          </p>
        )}
      </main>
    </div>
  );
}
