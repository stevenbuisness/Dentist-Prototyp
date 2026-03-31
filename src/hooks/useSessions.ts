import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

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
      if (error) throw error;
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
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessionTypes"] }),
  });
};

// ── SESSIONS ───────────────────────────────────────────────────────────────────

export const useSessions = (filters?: { session_type_id?: string; status?: string }) => {
  return useQuery({
    queryKey: ["sessions", filters],
    queryFn: async () => {
      let query = supabase
        .from("sessions")
        .select("*, session_type:session_types(*)");

      if (filters?.session_type_id) {
        query = query.eq("session_type_id", filters.session_type_id);
      }
      if (filters?.status) {
        query = query.eq("status", filters.status);
      }

      const { data, error } = await query.order("start_time");
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
    }) => {
      const { data, error } = await supabase
        .from("sessions")
        .insert(session)
        .select()
        .single();
      if (error) throw error;
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
      if (error) throw error;
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
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["sessions"] }),
  });
};

