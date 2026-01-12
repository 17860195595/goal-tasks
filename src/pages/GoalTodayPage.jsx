import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { format, addDays, startOfDay, isBefore, isAfter } from "date-fns";

// ✅ Chart (recharts)
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function GoalTodayPage() {
  const { goalId } = useParams();
  const [goal, setGoal] = useState(null);

  // ✅ Keep 风格：可以切换日期
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  // 统一 date 格式
  const normalize = (s) => String(s).slice(0, 10).replaceAll("/", "-");

  // 读取目标
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("goals") || "[]");
    const found = stored.find((g) => g.id === goalId) || null;
    setGoal(found);

    // ✅ 默认日期：落在 goal 的 start/end 范围内
    if (found?.startDate && found?.endDate) {
      const start = startOfDay(
        new Date(normalize(found.startDate) + "T00:00:00")
      );
      const end = startOfDay(new Date(normalize(found.endDate) + "T00:00:00"));
      const today = startOfDay(new Date());

      if (isBefore(today, start)) setSelectedDate(start);
      else if (isAfter(today, end)) setSelectedDate(end);
      else setSelectedDate(today);
    }
  }, [goalId]);

  // ✅ 本地日期字符串
  const selectedDateStr = useMemo(
    () => format(selectedDate, "yyyy-MM-dd"),
    [selectedDate]
  );

  // ✅ start/end Date 对象（用于限制 Prev/Next）
  const startDateObj = useMemo(() => {
    if (!goal?.startDate) return null;
    return startOfDay(new Date(normalize(goal.startDate) + "T00:00:00"));
  }, [goal?.startDate]);

  const endDateObj = useMemo(() => {
    if (!goal?.endDate) return null;
    return startOfDay(new Date(normalize(goal.endDate) + "T00:00:00"));
  }, [goal?.endDate]);

  // ✅ 只取选中那天的任务
  const tasksForSelectedDay = useMemo(() => {
    if (!goal?.dailyTasks) return [];
    const block = goal.dailyTasks.find(
      (d) => normalize(d.date) === selectedDateStr
    );
    return block?.tasks || [];
  }, [goal, selectedDateStr]);

  // ✅ 勾选任务：写回 localStorage + 更新 state
  const toggleTask = (taskId) => {
    if (!goal?.dailyTasks) return;

    const updatedGoal = {
      ...goal,
      dailyTasks: goal.dailyTasks.map((day) => {
        if (normalize(day.date) !== selectedDateStr) return day;
        return {
          ...day,
          tasks: (day.tasks || []).map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          ),
        };
      }),
    };

    // 写回 localStorage
    const all = JSON.parse(localStorage.getItem("goals") || "[]");
    const nextAll = all.map((g) => (g.id === goalId ? updatedGoal : g));
    localStorage.setItem("goals", JSON.stringify(nextAll));

    // 更新 UI
    setGoal(updatedGoal);
  };

  // 空态
  if (!goal) {
    return (
      <div
        className="bg-white flex flex-col relative overflow-hidden"
        style={{ height: "85vh" }}
      >
        <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <Link
              to="/goals"
              className="inline-flex items-center text-sm text-muted-foreground hover:underline"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Link>
            <div className="text-lg font-semibold">Goal</div>
            <div className="w-[80px]" />
          </div>
        </div>

        <div className="flex-1 overflow-hidden px-4">
          <div className="max-w-md mx-auto h-full">
            <div className="h-full overflow-auto py-6 text-sm text-muted-foreground">
              Goal not found.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 选中日完成数
  const doneCount = tasksForSelectedDay.filter((t) => t.completed).length;
  const totalCount = tasksForSelectedDay.length;

  // Prev/Next 操作
  const goPrev = () => {
    const next = addDays(selectedDate, -1);
    if (startDateObj && isBefore(startOfDay(next), startDateObj)) return;
    setSelectedDate(next);
  };

  const goNext = () => {
    const next = addDays(selectedDate, 1);
    if (endDateObj && isAfter(startOfDay(next), endDateObj)) return;
    setSelectedDate(next);
  };

  return (
    <div
      className="bg-white flex flex-col relative overflow-hidden"
      style={{ height: "85vh" }}
    >
      {/* Header */}
      <div className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-3 relative">
        <div className="flex items-center justify-between relative">
          <Link
            to="/goals"
            className="inline-flex items-center text-sm text-muted-foreground hover:underline"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Link>

          <div className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
            {goal?.title || "Goal"}
          </div>

          <Link
            to={`/goals/${goalId}/calendar`}
            className="text-sm rounded-lg border px-4 py-2 hover:bg-accent transition"
          >
            Calendar
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden px-4">
        <div className="max-w-md mx-auto h-full">
          <div className="h-full overflow-auto py-4 space-y-4">
            {/* 日期切换条 */}
            <div className="flex items-center justify-between">
              <button
                className="text-sm rounded-lg border px-4 py-2 hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={goPrev}
                disabled={
                  startDateObj
                    ? isBefore(
                        startOfDay(addDays(selectedDate, -1)),
                        startDateObj
                      )
                    : false
                }
              >
                Prev
              </button>

              <div className="text-sm font-medium">{selectedDateStr}</div>

              <button
                className="text-sm rounded-lg border px-4 py-2 hover:bg-accent transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={goNext}
                disabled={
                  endDateObj
                    ? isAfter(startOfDay(addDays(selectedDate, 1)), endDateObj)
                    : false
                }
              >
                Next
              </button>
            </div>

            {/* 选中日小进度 */}
            <div className="text-xs text-muted-foreground">
              Completed: {doneCount}/{totalCount}
            </div>

            {/* ✅ 最近 7 天学习记录 Chart（连续补齐） */}
            <DailyProgressChart7Days
              dailyTasks={goal.dailyTasks || []}
              startDate={goal.startDate}
              endDate={goal.endDate}
            />

            {/* 选中日任务列表 */}
            {tasksForSelectedDay.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                No tasks for this day.
              </div>
            ) : (
              tasksForSelectedDay.map((t) => (
                <div
                  key={t.id}
                  className="rounded-xl border bg-white px-4 py-3 flex items-start gap-3"
                >
                  <input
                    type="checkbox"
                    checked={!!t.completed}
                    onChange={() => toggleTask(t.id)}
                    className="mt-1 h-5 w-5"
                  />

                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-medium leading-5 break-words ${
                        t.completed ? "line-through text-muted-foreground" : ""
                      }`}
                    >
                      {t.title}
                    </div>

                    <div className="mt-2 text-xs text-muted-foreground">
                      {t.minutes ?? 30} min
                    </div>
                  </div>
                </div>
              ))
            )}

            <div className="h-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * ✅ 最近 7 天学习记录（连续补齐）
 * - 每天完成率柱状图
 * - tooltip 显示：rate% + done/total + doneMinutes
 */
function DailyProgressChart7Days({ dailyTasks, startDate, endDate }) {
  const DAYS = 7;
  const normalize = (s) => String(s).slice(0, 10).replaceAll("/", "-");

  const data = useMemo(() => {
    const list = Array.isArray(dailyTasks) ? dailyTasks : [];
    const map = new Map(list.map((d) => [normalize(d.date), d]));

    // ✅ 结束日：永远是“今天”（本地）
    let end = startOfDay(new Date());

    // ✅ 可选：限制在 goal 范围内（避免目标未开始/已结束导致图表出范围）
    if (startDate) {
      const s = startOfDay(new Date(normalize(startDate) + "T00:00:00"));
      if (isBefore(end, s)) end = s;
    }
    if (endDate) {
      const e = startOfDay(new Date(normalize(endDate) + "T00:00:00"));
      if (isAfter(end, e)) end = e;
    }

    const start = addDays(end, -(DAYS - 1));

    const allDays = [];
    for (let d = new Date(start); d <= end; d = addDays(d, 1)) {
      const key = format(d, "yyyy-MM-dd");
      const block = map.get(key);
      const tasks = Array.isArray(block?.tasks) ? block.tasks : [];

      const total = tasks.length;
      const done = tasks.filter((t) => !!t.completed).length;

      const doneMinutes = tasks
        .filter((t) => !!t.completed)
        .reduce((sum, t) => sum + (Number(t.minutes) || 30), 0);

      const rate = total === 0 ? 0 : Math.round((done / total) * 100);

      allDays.push({
        date: key.slice(5), // MM-DD
        rate,
        done,
        total,
        doneMinutes,
      });
    }

    return allDays;
  }, [dailyTasks, startDate, endDate]);

  const rangeText = useMemo(() => {
    let end = startOfDay(new Date());

    if (startDate) {
      const s = startOfDay(new Date(normalize(startDate) + "T00:00:00"));
      if (isBefore(end, s)) end = s;
    }
    if (endDate) {
      const e = startOfDay(new Date(normalize(endDate) + "T00:00:00"));
      if (isAfter(end, e)) end = e;
    }

    const start = addDays(end, -(DAYS - 1));
    return `${format(start, "MM-dd")} ~ ${format(end, "MM-dd")} (7 days)`;
  }, [startDate, endDate]);

  return (
    <div className="rounded-xl border p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">Daily progress</div>
        <div className="text-xs text-muted-foreground">{rangeText}</div>
      </div>

      <div className="mt-3 h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 12, left: -12, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value, name, item) => {
                const p = item?.payload;
                if (!p) return [value, "Completion"];
                return [
                  `${p.rate}% (${p.done}/${p.total}) · ${p.doneMinutes} min`,
                  "Completion",
                ];
              }}
            />
            <Bar dataKey="rate" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 text-xs text-muted-foreground">
        Last column is always today.
      </div>
    </div>
  );
}
