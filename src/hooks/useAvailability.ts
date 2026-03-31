import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export interface AvailabilityRule {
  id: string;
  day_of_week: number; // 0=Sunday, 1=Monday, ..., 6=Saturday
  start_time: string;  // "HH:MM:SS"
  end_time: string;    // "HH:MM:SS"
  created_at: string;
}

export interface AvailabilityException {
  id: string;
  start_date: string;
  end_date: string;
  reason?: string;
  is_closed: boolean;
  created_at: string;
}

// --- Availability Rules ---
export const useAvailabilityRules = () => {
  return useQuery({
    queryKey: ["availabilityRules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("availability_rules")
        .select("*")
        .order("day_of_week");

      if (error) throw error;
      return data as AvailabilityRule[];
    },
  });
};

export const useUpsertAvailabilityRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rule: Omit<AvailabilityRule, "id" | "created_at"> & { id?: string }) => {
      const { data, error } = await supabase
        .from("availability_rules")
        .upsert(rule)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["availabilityRules"] }),
  });
};

export const useDeleteAvailabilityRule = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("availability_rules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["availabilityRules"] }),
  });
};

// --- Availability Exceptions ---
export const useAvailabilityExceptions = () => {
  return useQuery({
    queryKey: ["availabilityExceptions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("availability_exceptions")
        .select("*")
        .order("start_date");

      if (error) throw error;
      return data as AvailabilityException[];
    },
  });
};

export const useCreateAvailabilityException = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (exception: Omit<AvailabilityException, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("availability_exceptions")
        .insert(exception)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["availabilityExceptions"] }),
  });
};

export const useDeleteAvailabilityException = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("availability_exceptions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["availabilityExceptions"] }),
  });
};

// --- Helper: Check if a given datetime is within availability ---
export function isWithinAvailability(
  date: Date,
  rules: AvailabilityRule[],
  exceptions: AvailabilityException[]
): boolean {
  const dateStr = date.toISOString().split("T")[0]; // "YYYY-MM-DD"

  // Check for exceptions first (e.g., vacation / closure)
  const isException = exceptions.some((ex) => {
    const isClosed = ex.is_closed;
    const inRange = dateStr >= ex.start_date && dateStr <= ex.end_date;
    return isClosed && inRange;
  });

  if (isException) return false;

  const dayOfWeek = date.getDay(); // 0=Sunday
  const timeStr = date.toTimeString().slice(0, 8); // "HH:MM:SS"

  const matchingRule = rules.find(
    (r) => r.day_of_week === dayOfWeek && timeStr >= r.start_time && timeStr < r.end_time
  );

  return !!matchingRule;
}

export function getAvailableDays(rules: AvailabilityRule[]): number[] {
  return [...new Set(rules.map((r) => r.day_of_week))].sort();
}
