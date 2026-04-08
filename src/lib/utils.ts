import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Translates technical Supabase/Postgres errors into user-friendly German text.
 */
export function translateError(error: any): string {
  if (!error) return "Ein unbekannter Fehler ist aufgetreten.";
  
  const message = error.message || "";
  const code = error.code || "";

  // Custom DB Trigger Messages
  if (message.includes("SLOT_FULL")) return "Dieser Termin ist leider bereits ausgebucht.";
  
  // Auth Errors
  if (message.includes("JWT expired") || code === "PGRST301") 
    return "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.";
  if (message.includes("Invalid login credentials"))
    return "E-Mail oder Passwort ist nicht korrekt.";
  if (message.includes("Email not confirmed"))
    return "Bitte bestätigen Sie zuerst Ihre E-Mail-Adresse.";
  
  // Database Errors
  if (code === "23505" || message.includes("duplicate key")) 
    return "Dieser Eintrag existiert bereits.";
  if (code === "42501" || message.includes("permission denied")) 
    return "Sie haben keine Berechtigung für diese Aktion.";
  if (code === "PGRST116")
    return "Die angeforderten Daten konnten nicht gefunden werden.";
  
  // Network/Generic
  if (message.includes("fetch") || message.includes("network"))
    return "Verbindungsproblem. Bitte prüfen Sie Ihre Internetverbindung.";

  return "Etwas ist schiefgelaufen. Bitte versuchen Sie es später erneut.";
}
