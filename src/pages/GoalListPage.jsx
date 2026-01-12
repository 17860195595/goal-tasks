import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function GoalListPage() {
  const [goals, setGoals] = useState([]);

  // 读取 localStorage 的 goals
  const loadGoals = () => {
    const stored = JSON.parse(localStorage.getItem("goals") || "[]");
    setGoals(stored);
  };

  // 初次加载 + 回到页面时刷新
  useEffect(() => {
    loadGoals();

    // 同一个标签页里从 Today 返回（focus）时刷新
    const onFocus = () => loadGoals();
    window.addEventListener("focus", onFocus);

    // 其他标签页改了 localStorage（storage）时刷新
    const onStorage = (e) => {
      if (e.key === "goals") loadGoals();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // 计算每个 goal 的 Overall done/total（跨所有天）
  const viewGoals = useMemo(() => {
    return goals.map((g) => {
      // ✅ 优先用 dailyTasks（你的完成状态在这里）
      const allTasks = Array.isArray(g.dailyTasks)
        ? g.dailyTasks.flatMap((d) => (Array.isArray(d.tasks) ? d.tasks : []))
        : [];

      // 如果还没做 dailyTasks（极少情况），fallback 到 g.tasks
      const fallbackTasks = Array.isArray(g.tasks) ? g.tasks : [];

      const tasksToCount = allTasks.length > 0 ? allTasks : fallbackTasks;

      const total = tasksToCount.length;
      const done = tasksToCount.filter((t) => !!t.completed).length;

      return {
        id: g.id,
        title: g.title || g.description || "Untitled Goal",
        done,
        total,
      };
    });
  }, [goals]);

  return (
    <div
      className="bg-white flex flex-col relative overflow-hidden"
      style={{ height: "85vh" }}
    >
      {/* Header */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3 relative">
        <div className="flex items-center justify-center relative">
          <h1 className="text-lg font-semibold">Goal List</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden px-4">
        <div className="max-w-md mx-auto h-full">
          <div className="h-full overflow-auto py-4">
            <div className="grid gap-3">
              {viewGoals.map((goal) => {
                const percent =
                  goal.total === 0
                    ? 0
                    : Math.round((goal.done / goal.total) * 100);

                return (
                  <Link
                    key={goal.id}
                    to={`/goals/${goal.id}/today`}
                    className="block"
                  >
                    <Card className="transition hover:shadow-sm">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">
                            {goal.title}
                          </CardTitle>

                          {/* ✅ 总进度（不是 today） */}
                          <div className="text-sm text-muted-foreground">
                            Overall: {goal.done}/{goal.total} ({percent}%)
                          </div>
                        </div>

                        <div className="flex items-center gap-1 rounded-md border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-accent transition">
                          Enter
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </CardHeader>

                      <CardContent>
                        <Progress
                          value={percent}
                          className="h-3 w-full bg-muted"
                        />
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}

              {viewGoals.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-10">
                  No goals yet. Create one first.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
