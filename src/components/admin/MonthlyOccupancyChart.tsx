import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../lib/utils";

interface MonthlyOccupancyChartProps {
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
  onDayClick: (dateStr: string) => void;
  data: Record<string, any>; // Record<dateStr, { percentage, statusColor, bookedMinutes }>
}

export const MonthlyOccupancyChart: React.FC<MonthlyOccupancyChartProps> = ({ 
  selectedMonth, 
  onMonthChange, 
  onDayClick,
  data 
}) => {
  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();
  
  // Header Info
  const monthName = selectedMonth.toLocaleDateString("de-DE", { month: "long", year: "numeric" });
  
  // Navigation
  const prevMonth = () => onMonthChange(new Date(year, month - 1, 1));
  const nextMonth = () => onMonthChange(new Date(year, month + 1, 1));

  // Weekdays header
  const weekdays = ["Mo", "Di", "Mi", "Do", "Fr"];
  
  // Current Day for highlighting (Local Time)
  const todayStr = new Date().toLocaleDateString("en-CA");

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-1 duration-500">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4 px-2">
        <button 
          onClick={prevMonth}
          className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-900 transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
        <span className="text-[11px] font-bold text-stone-900 uppercase tracking-widest">{monthName}</span>
        <button 
          onClick={nextMonth}
          className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-900 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Grid Header */}
      <div className="grid grid-cols-5 gap-1 mb-2">
        {weekdays.map(wd => (
          <div key={wd} className="text-[8px] font-bold text-stone-400 uppercase text-center py-1">
            {wd}
          </div>
        ))}
      </div>

      {/* Grid Days */}
      <div className="grid grid-cols-5 gap-1.5 px-1 py-1">
         {/* Since it's a fixed Mo-Fr grid, we might have empty cells at the start if month doesn't start on Mon */}
         {Array.from({ length: 31 }).map((_, i) => {
           const dayNum = i + 1;
           const date = new Date(year, month, dayNum);
           
           if (date.getMonth() !== month) return null;
           const dow = date.getDay();
           if (dow === 0 || dow === 6) return null;

           const dateStr = date.toLocaleDateString("en-CA");
           const dayStats = data[dateStr];
           const isToday = dateStr === todayStr;

           const column = dow; // Mon=1, ..., Fri=5
           
           return (
             <div 
               key={dateStr}
               onClick={() => onDayClick(dateStr)}
               style={{ gridColumnStart: column }}
               className={cn(
                 "relative h-12 flex flex-col items-center justify-center rounded-lg border transition-all group cursor-pointer",
                 isToday ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-stone-100 hover:border-stone-300 bg-white"
               )}
             >
               <span className={cn(
                 "text-[9px] font-bold mb-1",
                 isToday ? "text-primary" : "text-stone-400"
               )}>
                 {dayNum}
               </span>
               
               {dayStats ? (
                <>
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    dayStats.statusColor === "emerald" ? "bg-primary" :
                    dayStats.statusColor === "orange" ? "bg-orange-400" :
                    "bg-red-400"
                  )} />
                  {/* Tooltip */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-stone-900 text-white px-2.5 py-1 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-30 scale-75 group-hover:scale-100 border border-white/5 backdrop-blur-md">
                    <div className="text-[10px] font-bold font-montserrat">{dayStats.percentage}%</div>
                  </div>
                </>
               ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-stone-100" />
               )}
             </div>
           );
         })}
      </div>
    </div>
  );
};
