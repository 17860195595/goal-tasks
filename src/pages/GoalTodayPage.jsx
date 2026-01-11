import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function GoalTodayPage() {
  const { goalId } = useParams();

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" asChild className="pl-0">
          <Link to="/goals">
            <ChevronLeft className="mr-2 h-4 w-4" />
          </Link>
        </Button>

        <div className="text-lg font-semibold">Goal: {goalId}</div>

        <Link
          to={`/goals/${goalId}/calendar`}
          className="text-sm rounded-md border px-3 py-1.5 hover:bg-accent transition"
        >
          Calendar
        </Link>
      </div>

      {/* Placeholder */}
      <div className="text-muted-foreground">
        Today Tasks page (layout coming next)
      </div>
    </div>
  );
}
