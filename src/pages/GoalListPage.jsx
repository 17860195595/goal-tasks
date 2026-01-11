import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";

export default function GoalListPage() {
  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <h1 className="text-2xl font-bold">Goal List</h1>

      <div className="mt-4 grid gap-3">
        {goals.map((goal) => {
          const percent =
            goal.total === 0 ? 0 : Math.round((goal.done / goal.total) * 100);

          return (
            <Link
              key={goal.id}
              to={`/goals/${goal.id}/today`}
              className="block"
            >
              <Card className="transition hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  {/* Left: title + today text */}
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      Today: {goal.done}/{goal.total} ({percent}%)
                    </div>
                  </div>

                  {/* Right: Enter button-look */}
                  <div
                    className="
      flex items-center gap-1
      rounded-md border
      px-3 py-1.5
      text-sm font-medium
      text-muted-foreground
      hover:bg-accent
      transition
    "
                  >
                    Enter
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardHeader>

                <CardContent>
                  <Progress value={percent} className="h-3 w-full bg-muted" />
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

const goals = [
  { id: "g1", title: "React Basics", done: 0, total: 3 },
  { id: "g2", title: "Node.js Fundamentals", done: 1, total: 2 },
];
