import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "../lib/supabase";

export type BookingStatus =
  | "confirmed"
  | "canceled_by_user"
  | "canceled_by_admin"
  | "attended"
  | "no_show";

// ── ALL BOOKINGS (admin view) ─────────────────────────────────────────────────

export const useAllBookings = () => {
  return useQuery({
    queryKey: ["bookings", "all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          "*, session:sessions(*, session_type:session_types(*)), user:users(id, first_name, last_name, email)"
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// ── OWN BOOKINGS (patient view) ───────────────────────────────────────────────

export const useMyBookings = (userId?: string) => {
  return useQuery({
    queryKey: ["bookings", "mine", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, session:sessions(*, session_type:session_types(*))")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });
};

// ── CREATE BOOKING ────────────────────────────────────────────────────────────

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (booking: {
      session_id: string;
      user_id: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from("bookings")
        .insert(booking)
        .select()
        .single();

      if (error) {
        // Surface the DB trigger's human-readable message
        const msg = error.message.includes("SLOT_FULL")
          ? "Dieser Termin ist bereits ausgebucht."
          : error.message;
        throw new Error(msg);
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};

// ── UPDATE BOOKING STATUS (with Optimistic Update) ────────────────────────────

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...payload
    }: {
      id: string;
      status?: BookingStatus;
      notes?: string | null;
    }) => {
      const { data, error } = await supabase
        .from("bookings")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};

// Legacy alias for status only
export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    // 1. Optimistically update the cache before the server responds
    onMutate: async ({ bookingId, status }: { bookingId: string; status: BookingStatus }) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["bookings", "all"] });

      // Snapshot previous value for rollback
      const previousBookings = queryClient.getQueryData(["bookings", "all"]);

      // Optimistically patch the booking in cache
      queryClient.setQueryData(["bookings", "all"], (old: any[]) => {
        if (!old) return old;
        return old.map((b) => (b.id === bookingId ? { ...b, status } : b));
      });

      return { previousBookings };
    },

    // 2. Actual server call
    mutationFn: async ({
      bookingId,
      status,
    }: {
      bookingId: string;
      status: BookingStatus;
    }) => {
      const { data, error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    // 3. On error: roll back to the snapshot
    onError: (_err, _vars, context: any) => {
      if (context?.previousBookings) {
        queryClient.setQueryData(["bookings", "all"], context.previousBookings);
      }
    },

    // 4. Always refetch after settled to sync with server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};

// ── REALTIME SUBSCRIPTION (admin: live booking updates) ───────────────────────
// Usage: call useBookingsRealtime() once inside your admin page or layout

export const useBookingsRealtime = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("admin-bookings-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => {
          // Invalidate & refetch whenever any booking row changes
          queryClient.invalidateQueries({ queryKey: ["bookings"] });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sessions" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["sessions"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};
