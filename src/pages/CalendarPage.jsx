import * as React from "react"
// import { type DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"
function CalendarPage() {
  const [dateRange, setDateRange] = React.useState({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 5, 15),
  })
  return (
    <div style={{ padding: 24 }}>
      <h2>Calendar</h2>
      <p>打卡日历</p>
      <Calendar
      mode="range"
      defaultMonth={dateRange?.from}
      selected={dateRange}
      onSelect={setDateRange}
      numberOfMonths={2}
      className="rounded-lg border shadow-sm"
    />
    </div>
  );
}

export default CalendarPage;
