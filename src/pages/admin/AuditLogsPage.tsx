import { useState, useEffect } from "react";
import AdminLayout from "./AdminLayout";
import { supabase } from "../../lib/supabase";
import { 
  History as HistoryIcon, 
  Search, 
  User as UserIcon, 
  Clock, 
  FileText,
  ArrowRight,
  RefreshCw,
  Eye,
  ChevronUp,
  Terminal,
  ChevronDown,
  Undo2,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  X
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../../components/ui/button";


interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  old_data: any;
  new_data: any;
  changed_by: string;
  created_at: string;
  user_email?: string;
  user_name?: string;
  target_patient_name?: string;
}

// Helper functions
function translateAction(action: string) {
  switch (action) {
    case 'INSERT': return "ERSTELLT";
    case 'UPDATE': return "AKTUALISIERT";
    case 'DELETE': return "GELÖSCHT";
    default: return action;
  }
}

function formatTableName(name: string) {
  switch (name) {
    case 'bookings': return "Buchung";
    case 'sessions': return "Termin-Slot";
    case 'users': return "Benutzer-Profil";
    case 'availability_rules': return "Öffnungszeit";
    default: return name;
  }
}

function translateValue(value: any) {
  if (value === null || value === undefined) return "Leer";
  const strValue = String(value);
  
  const valTranslations: Record<string, string> = {
    'confirmed': "Bestätigt",
    'attended': "Erschienen",
    'no_show': "Nicht erschienen",
    'canceled_by_admin': "Abgesagt (Admin)",
    'canceled_by_user': "Abgesagt (User)",
    'open': "Verfügbar",
    'fully_booked': "Reserviert / Gebucht",
    'canceled': "Abgesagt",
    'completed': "Abgeschlossen / Dokumentiert",
    'active': "Aktiv",
    'blocked': "Gesperrt",
    'rejected': "Abgelehnt",
    'admin': "Administrator",
    'user': "Patient"
  };

  return valTranslations[strValue] || strValue;
}

function translateKey(key: string) {
  const translations: Record<string, string> = {
    status: "Status",
    start_time: "Startzeit",
    end_time: "Endzeit",
    notes: "Notizen",
    role: "Benutzerrolle",
    first_name: "Vorname",
    last_name: "Nachname",
    email: "E-Mail",
    max_slots: "Maximale Plätze",
    price: "Preis",
    phone_number: "Telefon",
    address_line_1: "Adresse",
    city: "Stadt",
    post_code: "PLZ",
    title: "Titel"
  };
  return translations[key] || key;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAction, setFilterAction] = useState<string>("all");
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});
  const [debugLogs, setDebugLogs] = useState<Record<string, boolean>>({});
  const [undoTarget, setUndoTarget] = useState<AuditLog | null>(null);
  const [undoLoading, setUndoLoading] = useState(false);
  const [undoSuccess, setUndoSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    
    // Wir holen uns alle User (Patienten), um aus nackten IDs echte Namen auflösen zu können
    const { data: usersData } = await supabase.from('users').select('id, first_name, last_name, role');
    const userMap = new Map((usersData || []).map(u => [u.id, `${u.first_name || ''} ${u.last_name || ''}`.trim()]));

    // Alle SessionTypes für die lesbare Anzeige der Behandlungsart anstelle kryptischer IDs
    const { data: sessionTypesData } = await supabase.from('session_types').select('id, name');
    const sessionTypeMap = new Map((sessionTypesData || []).map(t => [t.id, t.name]));

    const { data: logsData, error } = await supabase
      .from('audit_logs')
      .select(`
        *,
        changer:changed_by (
          first_name,
          last_name,
          email
        )
      `)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error("Fehler beim Laden der Audit-Logs:", error);
    } else {
      // Vorab-Suche nach Bookings für Sessions, um die Verbindung Termin -> Patient wiederherzustellen
      const sessionIds = new Set<string>();
      (logsData as any[]).forEach(log => {
        if (log.table_name === 'sessions') {
          sessionIds.add(log.record_id);
        }
      });
      
      const sessionToUserMap = new Map<string, string>();
      if (sessionIds.size > 0) {
        const { data: bookingsData } = await supabase
          .from('bookings')
          .select('session_id, user_id')
          .in('session_id', Array.from(sessionIds));
        
        bookingsData?.forEach(b => {
          sessionToUserMap.set(b.session_id, b.user_id);
        });
      }

      setLogs((logsData as any[]).map(log => {
        let patientName = "";
        let sessionTypeName = "";
        
        const logData = log.new_data || log.old_data;
        
        // Direkte Zuweisung des Patienten per ID
        let targetId = "";
        if (log.table_name === 'bookings') {
          targetId = logData?.user_id;
        } else if (log.table_name === 'sessions') {
          targetId = sessionToUserMap.get(log.record_id) || "";
          
          if (logData?.session_type_id && sessionTypeMap.has(logData.session_type_id)) {
            sessionTypeName = sessionTypeMap.get(logData.session_type_id) || "";
          }
        } else if (log.table_name === 'users' && logData?.role === 'patient') {
          targetId = logData?.id;
        } else if (log.table_name === 'activities' && logData?.details?.patient_id) {
          targetId = logData.details.patient_id;
        }

        if (targetId && userMap.has(targetId)) {
          patientName = userMap.get(targetId) || "";
        } else if (log.table_name === 'bookings' && logData?.user?.first_name) {
          patientName = `${logData.user.first_name} ${logData.user.last_name || ''}`.trim();
        } else if (log.table_name === 'users' && logData?.role === 'patient') {
          patientName = `${logData.first_name || ''} ${logData.last_name || ''}`.trim();
        }

        const changerName = log.changer 
          ? `${log.changer.first_name || ''} ${log.changer.last_name || ''}`.trim() 
          : "System / Automatisch";

        return {
          ...log,
          user_name: changerName,
          user_email: log.changer?.email,
          target_patient_name: patientName || "",
          session_type_name: sessionTypeName || ""
        };
      }));
    }
    setLoading(false);
  };

  const toggleExpand = (id: string) => {
    setExpandedLogs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleDebug = (id: string) => {
    setDebugLogs(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // ──────────────────────────────────
  // UNDO-Logik: Schritt rückgängig machen
  // ──────────────────────────────────
  const canUndo = (log: AuditLog) => {
    if (log.action === 'UPDATE' && log.old_data) return true;
    if (log.action === 'DELETE' && log.old_data) return true;
    if (log.action === 'INSERT' && log.new_data) return true;
    return false;
  };

  const getUndoDescription = (log: AuditLog) => {
    const tableName = formatTableName(log.table_name);
    switch (log.action) {
      case 'UPDATE':
        return `Die Änderungen an „${tableName}" werden auf den vorherigen Zustand zurückgesetzt.`;
      case 'DELETE':
        return `Der gelöschte Datensatz „${tableName}" wird wiederhergestellt.`;
      case 'INSERT':
        return `Der neu erstellte Datensatz „${tableName}" wird wieder entfernt.`;
      default:
        return "Diese Aktion wird rückgängig gemacht.";
    }
  };

  const handleUndo = async (log: AuditLog) => {
    setUndoLoading(true);
    try {
      let error: any = null;

      if (log.action === 'UPDATE' && log.old_data) {
        
        if (log.table_name === 'sessions') {
          // ─── INTELLIGENTER SESSION-UNDO ───
          // Nur Status und Dokumentationsfelder zurücksetzen,
          // aber den Titel (Patientenname) und Zeitfenster NICHT überschreiben!
          const safeRestoreFields: Record<string, any> = {};
          
          // Nur diese Felder dürfen zurückgesetzt werden:
          const allowedFields = ['status', 'notes'];
          for (const field of allowedFields) {
            if (log.old_data[field] !== undefined) {
              safeRestoreFields[field] = log.old_data[field];
            }
          }
          
          if (Object.keys(safeRestoreFields).length > 0) {
            const result = await supabase
              .from('sessions')
              .update(safeRestoreFields)
              .eq('id', log.record_id);
            error = result.error;
          }
          
          // Wenn der Status von completed zurück auf fully_booked geht,
          // müssen auch die zugehörigen Buchungen zurück auf "confirmed" gesetzt werden.
          // So erscheint der Termin wieder unter "Ausstehend" in der Sitzungszentrale.
          if (!error && log.old_data.status === 'fully_booked' && log.new_data?.status === 'completed') {
            const { error: bookingError } = await supabase
              .from('bookings')
              .update({ status: 'confirmed' })
              .eq('session_id', log.record_id);
            
            if (bookingError) {
              console.warn("Buchungs-Kaskade fehlgeschlagen:", bookingError);
            }
          }
          
        } else {
          // ─── STANDARD-UNDO für alle anderen Tabellen ───
          const restoreData = { ...log.old_data };
          delete restoreData.id;
          const result = await supabase
            .from(log.table_name)
            .update(restoreData)
            .eq('id', log.record_id);
          error = result.error;
        }
        
      } else if (log.action === 'DELETE' && log.old_data) {
        const result = await supabase
          .from(log.table_name)
          .insert(log.old_data);
        error = result.error;
      } else if (log.action === 'INSERT' && log.new_data) {
        const result = await supabase
          .from(log.table_name)
          .delete()
          .eq('id', log.record_id);
        error = result.error;
      }

      if (error) {
        console.error("Undo fehlgeschlagen:", error);
        alert(`Fehler beim Rückgängig-Machen: ${error.message}`);
      } else {
        setUndoSuccess(log.id);
        setTimeout(() => {
          setUndoTarget(null);
          setUndoSuccess(null);
          fetchLogs();
        }, 1500);
      }
    } catch (err) {
      console.error("Undo Fehler:", err);
      alert("Ein unerwarteter Fehler ist aufgetreten.");
    }
    setUndoLoading(false);
  };

  const filteredLogs = logs.filter(log => {
    const actionText = translateAction(log.action).toLowerCase();
    const tableText = formatTableName(log.table_name).toLowerCase();
    const matchesSearch = 
      tableText.includes(searchTerm.toLowerCase()) ||
      (log.user_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (log.target_patient_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      actionText.includes(searchTerm.toLowerCase());
    
    const matchesAction = filterAction === "all" || log.action === filterAction;
    
    return matchesSearch && matchesAction;
  });

  const getActionColor = (action: string) => {
    switch (action) {
      case 'INSERT': return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case 'UPDATE': return "bg-blue-50 text-blue-700 border-blue-100";
      case 'DELETE': return "bg-red-50 text-red-700 border-red-100";
      default: return "bg-stone-50 text-stone-700 border-stone-100";
    }
  };

  const renderDiff = (log: AuditLog) => {
    if (log.action === 'UPDATE' && log.old_data && log.new_data) {
      const keys = Object.keys(log.new_data).filter(k => 
        JSON.stringify(log.old_data[k]) !== JSON.stringify(log.new_data[k]) &&
        !['updated_at', 'created_at'].includes(k)
      );

      if (keys.length === 0) return <p className="text-xs text-stone-400 italic">Keine inhaltlichen Änderungen erkannt.</p>;

      return (
        <div className="mt-4 space-y-2 bg-stone-50 p-4 rounded-xl border border-stone-100 shadow-inner">
          <p className="text-[10px] font-black uppercase text-stone-400 tracking-widest mb-2 flex items-center gap-1.5">
            <HistoryIcon size={12} /> Detail-Änderungen am Datensatz
          </p>
          {keys.map(k => (
            <div key={k} className="text-sm flex flex-wrap items-center gap-3 py-1 border-b border-stone-100 last:border-0 border-dashed">
              <span className="font-bold text-stone-600 min-w-[120px]">{translateKey(k)}:</span>
              <div className="flex items-center gap-3">
                <span className="text-red-400/80 line-through bg-red-50/50 px-2 py-0.5 rounded italic">{translateValue(log.old_data[k])}</span>
                <ArrowRight size={14} className="text-stone-300" />
                <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">{translateValue(log.new_data[k])}</span>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <AdminLayout>
      <div className="mb-10 space-y-6 max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-montserrat font-black text-stone-900 tracking-tight">System-Protokoll</h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-900 text-[#faf8f5] text-[10px] font-black uppercase tracking-widest shadow-sm">
                REVISIONSSICHER
              </span>
            </div>
            <p className="text-stone-500 mt-2 text-base">Lückenlose Aufzeichnung aller Datenbank-Aktionen zur Qualitätssicherung.</p>
          </div>
          
          <Button 
            onClick={fetchLogs} 
            variant="outline" 
            className="bg-white border-stone-200 text-stone-600 hover:bg-stone-50 shadow-sm h-12 px-6"
          >
            <RefreshCw size={18} className={cn("mr-2", loading && "animate-spin")} />
            <span className="text-sm font-bold">Aktualisieren</span>
          </Button>
        </div>

        {/* Filter-Bereich */}
        <div className="flex flex-col sm:flex-row gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input 
              type="text" 
              placeholder="Suchen nach Patient, Tabelle oder Aktion..."
              className="w-full pl-12 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-base focus:ring-2 focus:ring-stone-900 outline-none transition-all placeholder:text-stone-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex bg-stone-100 p-1 rounded-xl">
            {[
              { id: 'all', label: 'Alle' },
              { id: 'INSERT', label: 'Erstellt' },
              { id: 'UPDATE', label: 'Geändert' },
              { id: 'DELETE', label: 'Gelöscht' }
            ].map((act) => (
              <button
                key={act.id}
                onClick={() => setFilterAction(act.id)}
                className={cn(
                  "px-4 py-2 text-[11px] font-black uppercase tracking-widest rounded-lg transition-all",
                  filterAction === act.id 
                    ? "bg-white text-stone-900 shadow-md" 
                    : "text-stone-400 hover:text-stone-600"
                )}
              >
                {act.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4 max-w-5xl">
        {loading && logs.length === 0 ? (
          <div className="py-24 text-center animate-pulse text-stone-400 font-montserrat text-lg">Analysiere Revisionsdaten...</div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-2xl border-2 border-dashed border-stone-200 text-stone-400 flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center">
              <Search size={32} className="opacity-20" />
            </div>
            <p className="text-lg font-medium">Keine Einträge für diese Kriterien gefunden.</p>
          </div>
        ) : (
          <div className="grid gap-5">
            {filteredLogs.map((log) => (
              <div key={log.id} className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:shadow-lg transition-all group relative overflow-hidden flex flex-col">
                <div className={cn(
                  "absolute top-0 left-0 w-1.5 h-full transition-all duration-300",
                  log.action === 'INSERT' ? "bg-emerald-500" : 
                  log.action === 'UPDATE' ? "bg-blue-500" : "bg-red-500"
                )}></div>
                
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex items-start gap-5">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center border shrink-0 shadow-sm transition-transform group-hover:scale-105",
                        getActionColor(log.action)
                      )}>
                        {log.action === 'INSERT' ? <FileText size={22} /> : 
                         log.action === 'UPDATE' ? <HistoryIcon size={22} /> : 
                         <UserIcon size={22} />}
                      </div>
                      
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className={cn(
                            "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border shadow-sm",
                            getActionColor(log.action)
                          )}>
                            {translateAction(log.action)}
                          </span>
                          <span className="text-lg font-black text-stone-900 font-montserrat tracking-tight leading-tight">
                            {formatTableName(log.table_name)}
                          </span>
                          <span className="px-2 py-0.5 bg-stone-50 text-stone-400 rounded text-[10px] font-mono border border-stone-100">
                             #{log.record_id.substring(0, 8)}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-sm font-medium">
                          <div className="flex items-center gap-2 text-stone-600">
                            <UserIcon size={14} className="text-stone-400" />
                            <span className="font-bold underline decoration-stone-200 underline-offset-4">{log.user_name}</span>
                          </div>
                          <div className="flex items-center gap-2 text-stone-500">
                            <Clock size={14} className="text-stone-400" />
                            <span>{new Date(log.created_at).toLocaleString("de-DE", {
                              day: '2-digit', month: '2-digit', year: 'numeric',
                              hour: '2-digit', minute: '2-digit'
                            })} Uhr</span>
                          </div>
                          
                          {log.target_patient_name ? (
                            <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 shadow-sm transition-all">
                              <span className="text-[10px] font-black uppercase tracking-tight opacity-50">👤 Bezug:</span>
                              <span className="font-bold">{log.target_patient_name}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-md border border-stone-200 shadow-sm transition-all">
                              <span className="text-[10px] font-black uppercase tracking-tight opacity-70">⚙️ System-Einstellung</span>
                            </div>
                          )}
                          
                          {(log as any).session_type_name && (
                            <div className="flex items-center gap-2 text-stone-600 bg-stone-100 px-2.5 py-0.5 rounded-md border border-stone-200 shadow-sm transition-all">
                              <span className="text-[10px] font-black uppercase tracking-tight opacity-50">Art:</span>
                              <span className="font-bold">{(log as any).session_type_name}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="shrink-0 flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => toggleExpand(log.id)}
                        className={cn(
                          "h-10 px-4 rounded-xl font-bold flex items-center gap-2 transition-all",
                          expandedLogs[log.id] ? "bg-stone-900 text-[#faf8f5] border-stone-900" : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
                        )}
                      >
                        {expandedLogs[log.id] ? (
                          <>
                            <ChevronUp size={16} />
                            Schließen
                          </>
                        ) : (
                          <>
                            <Eye size={16} />
                            Details
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expandierbarer Bereich mit Details */}
                  {expandedLogs[log.id] && (
                    <div className="mt-6 animate-in slide-in-from-top-2 duration-300 space-y-4">
                      {renderDiff(log)}
                      
                      {/* Aktions-Leiste: Undo + Entwickler */}
                      <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-dashed border-stone-200">
                        {canUndo(log) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUndoTarget(log)}
                            className="h-9 px-4 rounded-xl font-bold flex items-center gap-2 text-amber-700 border-amber-200 bg-amber-50 hover:bg-amber-100 hover:border-amber-300 transition-all shadow-sm"
                          >
                            <Undo2 size={14} />
                            Rückgängig machen
                          </Button>
                        )}

                        <button 
                          onClick={() => toggleDebug(log.id)}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors py-2"
                        >
                          <Terminal size={12} />
                          Entwickler Ansicht
                          {debugLogs[log.id] ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                        </button>
                      </div>

                      {debugLogs[log.id] && (
                        <div className="p-4 bg-stone-900 flex flex-col gap-3 rounded-xl border border-stone-800 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] font-black uppercase text-emerald-400/70 tracking-widest">JSON Debug Dump</p>
                            <span className="text-[10px] font-mono text-stone-500">Log-ID: {log.id}</span>
                          </div>
                          <pre className="text-[11px] text-emerald-400/90 p-1 h-auto max-h-60 overflow-y-auto font-mono leading-relaxed custom-scrollbar">
                            {JSON.stringify(log.action === 'DELETE' ? log.old_data : log.new_data, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════ */}
      {/* BESTÄTIGUNGS-MODAL für Rückgängig-Machen       */}
      {/* ═══════════════════════════════════════════════ */}
      {undoTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => !undoLoading && setUndoTarget(null)}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 fade-in duration-300 overflow-hidden">
            {/* Header mit Warnsignal */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-b border-amber-100 p-8 text-center relative">
              <button
                onClick={() => !undoLoading && setUndoTarget(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-stone-400 hover:text-stone-900 transition-all shadow-sm border border-stone-200"
              >
                <X size={16} />
              </button>
              
              {undoSuccess ? (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-emerald-100 border-2 border-emerald-200 flex items-center justify-center shadow-sm">
                    <CheckCircle2 size={32} className="text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-black text-emerald-900 font-montserrat">Erfolgreich rückgängig gemacht</h3>
                  <p className="text-emerald-600 text-sm mt-1">Die Daten wurden wiederhergestellt.</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-100 border-2 border-amber-200 flex items-center justify-center shadow-sm">
                    <ShieldAlert size={32} className="text-amber-600" />
                  </div>
                  <h3 className="text-xl font-black text-stone-900 font-montserrat">Aktion rückgängig machen?</h3>
                  <p className="text-stone-500 text-sm mt-1">Diese Änderung erfordert eine bewusste Bestätigung.</p>
                </>
              )}
            </div>
            
            {/* Inhalt */}
            {!undoSuccess && (
              <div className="p-8 space-y-5">
                {/* Was genau wird rückgängig gemacht */}
                <div className="bg-stone-50 rounded-2xl p-5 border border-stone-100 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest border shadow-sm",
                      getActionColor(undoTarget.action)
                    )}>
                      {translateAction(undoTarget.action)}
                    </span>
                    <span className="text-base font-black text-stone-900">
                      {formatTableName(undoTarget.table_name)}
                    </span>
                  </div>
                  
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {getUndoDescription(undoTarget)}
                  </p>
                  
                  {undoTarget.target_patient_name && (
                    <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 w-fit">
                      <span className="text-[10px] font-black uppercase opacity-50">👤 Bezug:</span>
                      <span className="font-bold text-sm">{undoTarget.target_patient_name}</span>
                    </div>
                  )}
                </div>
                
                {/* Warnung */}
                <div className="flex items-start gap-3 bg-red-50 rounded-xl p-4 border border-red-100">
                  <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-red-700 leading-relaxed">
                    <strong>Achtung:</strong> Die Wiederherstellung überschreibt den aktuellen Zustand des Datensatzes. 
                    Diese Aktion wird ebenfalls im Protokoll revisionssicher gespeichert.
                  </p>
                </div>

                {/* Aktions-Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setUndoTarget(null)}
                    disabled={undoLoading}
                    className="flex-1 h-12 rounded-xl font-bold border-stone-200 text-stone-600 hover:bg-stone-50"
                  >
                    Abbrechen
                  </Button>
                  <Button
                    onClick={() => handleUndo(undoTarget)}
                    disabled={undoLoading}
                    className="flex-1 h-12 rounded-xl font-bold bg-amber-500 hover:bg-amber-600 text-white border-0 shadow-md shadow-amber-200 transition-all"
                  >
                    {undoLoading ? (
                      <RefreshCw size={16} className="animate-spin mr-2" />
                    ) : (
                      <Undo2 size={16} className="mr-2" />
                    )}
                    {undoLoading ? "Wird wiederhergestellt…" : "Ja, rückgängig machen"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
