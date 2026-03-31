import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // 1. Total Patients
      const { count: patientCount, error: err1 } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .neq("role", "admin");

      // 2. Today's Bookings
      const { data: todayBookings, error: err2 } = await supabase
        .from("bookings")
        .select(`
          id, 
          status,
          session:sessions!inner(id, start_time)
        `)
        .eq("session.start_time", today)
        .neq("status", "canceled_by_user")
        .neq("status", "canceled_by_admin");

      // 3. New Bookings (last 7 days)
      const { count: newCount, error: err3 } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .gte("created_at", sevenDaysAgo.toISOString());

      // 4. Next Appointment
      const { data: nextBooking, error: err4 } = await supabase
        .from("bookings")
        .select(`
          id,
          status,
          session:sessions!inner(id, start_time, session_type:session_types(name)),
          user:users(first_name, last_name)
        `)
        .gte("session.start_time", new Date().toISOString())
        .neq("status", "canceled_by_user")
        .neq("status", "canceled_by_admin")
        .order("session(start_time)", { ascending: true })
        .limit(1)
        .maybeSingle();

      // 5. Total Capacity for today
      const { data: todaySessions, error: err5 } = await supabase
        .from("sessions")
        .select("max_slots")
        .eq("start_time", today);

      if (err1 || err2 || err3 || err4 || err5) {
        console.error("Stats fetch error:", { err1, err2, err3, err4, err5 });
      }

      const totalSlots = todaySessions?.reduce((acc, s) => acc + s.max_slots, 0) || 0;
      const bookedSlots = todayBookings?.length || 0;
      const occupancy = totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0;

      return {
        patientCount: patientCount || 0,
        todayCount: bookedSlots,
        newSevenDays: newCount || 0,
        nextBooking: nextBooking as any, 
        occupancyToday: occupancy, 
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};
