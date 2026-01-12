import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

// yyyy-mm-dd -> Date（本地 00:00）
function parseYMD(ymd) {
  return new Date(ymd + "T00:00:00");
}

// Date -> yyyy-mm-dd（本地）
function toYMD(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function CalendarPage() {
  const { goalId } = useParams();

  const [goal, setGoal] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("goals") || "[]");
    const found = stored.find((g) => g.id === goalId) || null;
    setGoal(found);

    if (found?.startDate && found?.endDate) {
      setDateRange({
        from: parseYMD(found.startDate),
        to: parseYMD(found.endDate),
      });
    } else {
      setDateRange(null);
    }
  }, [goalId]);

  // ✅ 固定范围：范围外禁用（不需要 useMemo）
  const disabledFn = (date) => {
    if (!dateRange?.from || !dateRange?.to) return false;

    const from = new Date(
      dateRange.from.getFullYear(),
      dateRange.from.getMonth(),
      dateRange.from.getDate()
    );

    const to = new Date(
      dateRange.to.getFullYear(),
      dateRange.to.getMonth(),
      dateRange.to.getDate()
    );

    const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return d < from || d > to;
  };

  // ✅ 计算“完成日期”集合（用于变绿）
  const completedDates = useMemo(() => {
    if (!goal?.dailyTasks) return [];

    return goal.dailyTasks
      .filter((d) => Array.isArray(d.tasks) && d.tasks.length > 0)
      .filter((d) => d.tasks.every((t) => !!t.completed))
      .map((d) => parseYMD(d.date));
  }, [goal]);

  return (
    <div
      className="bg-white flex flex-col relative overflow-hidden"
      style={{ height: "85vh" }}
    >
      {/* Header */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3 relative">
        <div className="flex items-center justify-between relative">
          <Button variant="ghost" asChild className="pl-0">
            <Link to={`/goals/${goalId}/today`}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>

          <div className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
            {goal?.title || "Calendar"}
          </div>

          <div className="w-[80px]" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden px-4">
        <div className="max-w-md mx-auto h-full">
          <div className="h-full overflow-auto py-4 space-y-4">
            {!dateRange ? (
              <div className="text-sm text-muted-foreground">
                Goal date range not found. Please create the goal first.
              </div>
            ) : (
              <>
                <div className="text-xs text-muted-foreground">
                  Range: {toYMD(dateRange.from)} ~ {toYMD(dateRange.to)}
                </div>

                <div className="flex justify-center">
                  <Calendar
                    className="w-full max-w-[360px]"
                    mode="range"
                    selected={dateRange}
                    onSelect={() => {}}
                    disabled={disabledFn}
                    modifiers={{ completed: completedDates }}
                    modifiersClassNames={{
                      completed:
                        "!bg-green-500 !text-white hover:!bg-green-600 focus:!bg-green-600 rounded-md",
                    }}
                  />
                </div>

                <div className="text-xs text-muted-foreground">
                  Green = all tasks completed for that day.
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
