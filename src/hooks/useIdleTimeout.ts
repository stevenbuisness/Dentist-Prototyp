import { useEffect, useRef } from "react";
import { supabase } from "../lib/supabase";
import { useToast } from "./use-toast";

/**
 * Hook to automatically log out the user after a period of inactivity.
 * @param timeoutMs Duration in milliseconds after which to logout (default 30 mins)
 */
export function useIdleTimeout(timeoutMs: number = 30 * 60 * 1000) {
  const { toast } = useToast();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      await supabase.auth.signOut();
      toast({
        title: "Sicherheits-Abmeldung",
        description: "Sie wurden aufgrund von Inaktivität zu Ihrer Sicherheit automatisch abgemeldet.",
        variant: "destructive",
      });
      window.location.href = "/";
    }, timeoutMs);
  };

  useEffect(() => {
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click"
    ];

    // Initialize timer
    resetTimer();

    // Attach listeners
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      // Cleanup
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, []);
}
