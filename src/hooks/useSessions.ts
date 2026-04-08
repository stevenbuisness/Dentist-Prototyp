import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { translateError } from "../lib/utils";

// ── SESSION TYPES ──────────────────────────────────────────────────────────────

export const useSessionTypes = () => {
  return useQuery({
    queryKey: ["sessionTypes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("session_types")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });
};

export const useUpsertSessionType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      id?: string;
      name: string;
      description?: string | null;
      base_price?: number | null;
      default_duration_minutes?: number;
    }) => {
      const { data, error } = await supabase
        .from("session_types")
        .upsert(payload)
        .select()
        .single();
      if (error) throw new Error(translateError(error));
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessionTypes"] }),
  });
};

export const useDeleteSessionType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("session_types").delete().eq("id", id);
      if (error) throw new Error(translateError(error));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessionTypes"] }),
  });
};

// ── SESSIONS ───────────────────────────────────────────────────────────────────

export const useSessions = (filters?: { session_type_id?: string; status?: string; ascending?: boolean }) => {
  return useQuery({
    queryKey: ["sessions", filters],
    queryFn: async () => {
      let query = supabase
        .from("sessions")
        .select("*, session_type:session_types(*), bookings:bookings(*, user:users(id, first_name, last_name, email))");

      if (filters?.session_type_id) {
        query = query.eq("session_type_id", filters.session_type_id);
      }
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      const { data, error } = await query.order("start_time", { ascending: filters?.ascending ?? true });
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (session: {
      session_type_id: string;
      title?: string | null;
      description?: string | null;
      start_time: string;
      end_time: string;
      max_slots?: number;
      price?: number | null;
      status?: "open" | "fully_booked" | "canceled" | "completed";
      locked_by?: string | null;
      locked_at?: string | null;
    }) => {
      const { data, error } = await supabase
        .from("sessions")
        .insert(session)
        .select(`
          *,
          session_type:session_types(*)
        `)
        .single();
      if (error) throw new Error(translateError(error));
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
  });
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }: { id: string; [key: string]: unknown }) => {
      const { data, error } = await supabase
        .from("sessions")
        .update(payload)
        .eq("id", id)
        .select()
        .single();
      if (error) throw new Error(translateError(error));
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
  });
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sessions").delete().eq("id", id);
      if (error) throw new Error(translateError(error));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
  });
};


export const useLockSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sessionId, userId }: { sessionId: string; userId: string }) => {
      const { data, error } = await supabase.rpc("acquire_session_lock", {
        p_session_id: sessionId,
        p_user_id: userId,
      });
      if (error) throw new Error(translateError(error));
      return data as boolean;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
  });
};

export const useUnlockSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ sessionId, userId }: { sessionId: string; userId: string }) => {
      const { error } = await supabase.rpc("release_session_lock", {
        p_session_id: sessionId,
        p_user_id: userId,
      });
      if (error) throw new Error(translateError(error));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
  });
};

export const useAvailabilityRules = () => {
  return useQuery({
    queryKey: ["availabilityRules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("availability_rules")
        .select("*");
      if (error) throw error;
      return data;
    },
  });
};

export const useCreateOnDemandSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ typeId, startTime, endTime }: { typeId: string; startTime: string; endTime: string }) => {
      const { data: sessionId, error } = await supabase.rpc("create_on_demand_session", {
        p_session_type_id: typeId,
        p_start_time: startTime,
        p_end_time: endTime,
      });
      if (error) throw new Error(translateError(error));
      
      // Fetch the full session object back to be consistent with the rest of the app
      const { data: session, error: fetchError } = await supabase
        .from("sessions")
        .select("*, session_type:session_types(*)")
        .eq("id", sessionId)
        .single();
      if (fetchError) throw new Error(translateError(fetchError));
      
      return session;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
  });
};
