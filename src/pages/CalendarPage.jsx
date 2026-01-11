import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function CalendarPage() {
  const { goalId } = useParams();

  const [dateRange, setDateRange] = React.useState({
    from: new Date(2025, 5, 12),
    to: new Date(2025, 6, 15),
  });

  return (
    <div className="mx-auto max-w-4xl px-8 py-10 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild className="pl-0">
          <Link to={`/goals/${goalId}/today`}>
            <ChevronLeft className="mr-2 h-4 w-4" />
          </Link>
        </Button>

        <div className="text-lg font-semibold">Calendar</div>

        <div className="w-[80px]" />
      </div>

      {/* Calendar */}
      <div>
        <Calendar
          mode="range"
          numberOfMonths={2}
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={setDateRange}
          className="rounded-lg border shadow-sm"
        />
      </div>
    </div>
  );
}
