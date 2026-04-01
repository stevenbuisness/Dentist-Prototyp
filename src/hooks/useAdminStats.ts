import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      // Calculate Mon-Fri of the current week
      const currentDow = startOfDay.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
      const diffToMonday = currentDow === 0 ? -6 : 1 - currentDow;
      const monday = new Date(startOfDay);
      monday.setDate(monday.getDate() + diffToMonday);
      const friday = new Date(monday);
      friday.setDate(friday.getDate() + 4);
      friday.setHours(23, 59, 59, 999);

      // 1. Total Patients
      const { count: patientCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .neq("role", "admin");

      // 2. Fetch Sessions & Bookings for Mon-Fri of this week
      const { data: recentSessions } = await supabase
        .from("sessions")
        .select("start_time, max_slots")
        .gte("start_time", monday.toISOString())
        .lte("start_time", friday.toISOString());

      const { data: recentBookings } = await supabase
        .from("bookings")
        .select(`
          id, 
          status,
          session:sessions!inner(id, start_time)
        `)
        .gte("session.start_time", monday.toISOString())
        .lte("session.start_time", friday.toISOString())
        .neq("status", "canceled_by_user")
        .neq("status", "canceled_by_admin");

      // Build exactly 5 days: Mon-Fri
      const weeklyOccupancy = [];
      for (let i = 0; i < 5; i++) {
        const d = new Date(monday);
        d.setDate(d.getDate() + i);
        const dStr = d.toISOString().split("T")[0];

        const daySessions = recentSessions?.filter(s => (s as any).start_time.startsWith(dStr)) || [];
        const dayBookings = recentBookings?.filter(b => (b as any).session.start_time.startsWith(dStr)) || [];

        const totalSlots = daySessions.reduce((acc, s) => acc + (s as any).max_slots, 0);
        const bookedSlots = dayBookings.length;
        const percentage = totalSlots > 0 ? Math.round((bookedSlots / totalSlots) * 100) : 0;

        weeklyOccupancy.push({
          date: dStr,
          dayName: d.toLocaleDateString("de-DE", { weekday: "short" }),
          percentage,
          bookedSlots,
          totalSlots,
        });
      }

      // 3. New Bookings (this week Mon-Fri)
      const { count: newCount } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .gte("created_at", monday.toISOString());

      // 4. Upcoming Appointments (Next 5)
      const { data: upcomingBookings } = await supabase
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
        .limit(5);

      const todayStr = startOfDay.toISOString().split("T")[0];
      const todayStats = weeklyOccupancy.find(w => w.date === todayStr);

      return {
        patientCount: patientCount || 0,
        todayCount: todayStats?.bookedSlots || 0,
        newSevenDays: newCount || 0,
        upcomingBookings: (upcomingBookings || []) as any[], 
        occupancyToday: todayStats?.percentage || 0, 
        weeklyOccupancy
      };
    },
    staleTime: 1000 * 60 * 5,
  });
};
