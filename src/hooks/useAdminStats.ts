import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";

export const useAdminStats = (selectedDate: Date = new Date()) => {
  return useQuery({
    queryKey: ["admin-stats", selectedDate.toISOString().slice(0, 7)],
    queryFn: async () => {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0);
      
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      // Calculate Mon-Fri of the current week (independent of selected month for the dashboard bar chart)
      const now = new Date();
      const currentDow = now.getDay();
      const diffToMonday = currentDow === 0 ? -6 : 1 - currentDow;
      const monday = new Date(now);
      monday.setDate(monday.getDate() + diffToMonday);
      monday.setHours(0, 0, 0, 0);
      
      const friday = new Date(monday);
      friday.setDate(monday.getDate() + 4);
      friday.setHours(23, 59, 59, 999);

      // Boundaries for fetching bookings: we fetch the larger of (current week) or (selected month)
      const fetchStart = new Date(Math.min(monday.getTime(), startOfMonth.getTime())).toISOString();
      const fetchEnd = new Date(Math.max(friday.getTime(), endOfMonth.getTime())).toISOString();

      // 1. Total Patients
      const { count: patientCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .neq("role", "admin");

      // 2. Fetch Bookings containing duration_minutes
      const { data: bookings } = await supabase
        .from("bookings")
        .select(`
          id,
          status,
          session:sessions!inner(
            start_time,
            session_type:session_types(name, duration_minutes)
          ),
          user:users(first_name, last_name)
        `)
        .gte("session.start_time", fetchStart)
        .lte("session.start_time", fetchEnd)
        .neq("status", "canceled_by_user")
        .neq("status", "canceled_by_admin");

      const DAILY_CAPACITY_MINUTES = 480;

      // Helper to format date as YYYY-MM-DD without timezone shift
      const formatDate = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      // Helper for occupancy calculation
      const calculateDayStats = (dateStr: string) => {
        const dayBookings = bookings?.filter(b => (b as any).session.start_time.startsWith(dateStr)) || [];
        const bookedMinutes = dayBookings.reduce((sum, b) => sum + ((b as any).session?.session_type?.duration_minutes || 30), 0);
        const percentage = Math.min(100, Math.round((bookedMinutes / DAILY_CAPACITY_MINUTES) * 100));
        
        let statusColor = "emerald";
        if (percentage > 85) statusColor = "red";
        else if (percentage > 70) statusColor = "orange";

        return { percentage, bookedMinutes, statusColor, count: dayBookings.length };
      };

      // Weekly Data (Fixed Mo-Fr of current week)
      const weeklyOccupancy = [];
      for (let i = 0; i < 5; i++) {
        const d = new Date(monday);
        d.setDate(d.getDate() + i);
        const dStr = formatDate(d);
        const stats = calculateDayStats(dStr);
        weeklyOccupancy.push({
          date: dStr,
          dayName: d.toLocaleDateString("de-DE", { weekday: "short" }),
          ...stats,
          availableMinutes: Math.max(0, DAILY_CAPACITY_MINUTES - stats.bookedMinutes)
        });
      }

      // Monthly Data (Mapping for the calendar view)
      const monthlyOccupancy: Record<string, any> = {};
      for (let i = 1; i <= endOfMonth.getDate(); i++) {
        const d = new Date(year, month, i);
        const dStr = formatDate(d);
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        
        if (!isWeekend) {
          monthlyOccupancy[dStr] = calculateDayStats(dStr);
        }
      }

      // 3. New Bookings (last 7 days)
      const { count: newCount } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .gte("created_at", new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString());

      // 4. Upcoming Appointments
      const { data: upcomingBookings } = await supabase
        .from("bookings")
        .select(`
          id,
          status,
          session:sessions!inner(id, start_time, session_type:session_types(name, duration_minutes)),
          user:users(first_name, last_name)
        `)
        .gte("session.start_time", new Date().toISOString())
        .neq("status", "canceled_by_user")
        .neq("status", "canceled_by_admin")
        .order("session(start_time)", { ascending: true })
        .limit(5);

      const todayStr = formatDate(now);
      const todayStats = monthlyOccupancy[todayStr] || calculateDayStats(todayStr);

      return {
        patientCount: patientCount || 0,
        todayCount: todayStats.count,
        newSevenDays: newCount || 0,
        upcomingBookings: (upcomingBookings || []) as any[], 
        occupancyToday: todayStats.percentage, 
        bookedMinutesToday: todayStats.bookedMinutes,
        weeklyOccupancy,
        monthlyOccupancy,
        allBookings: (bookings || []) as any[] // Alle Buchungen für die Timeline
      };
    },
    staleTime: 1000 * 10, 
    refetchInterval: 5000, // True Live-Dashboard feel
  });
};
