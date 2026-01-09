import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {  Gauge, Contact,ClipboardList } from "lucide-react";

const tabs = [
  { to: "/today", label: "Today", icon: ClipboardList },
  { to: "/create-goal", label: "CreateGoal", icon: Gauge },
  { to: "/calendar", label: "User", icon: Contact },
    // { to: "/me", label: "Me", icon: User },
];

// 这些页面不显示底部栏（比如创建目标/登录等）
const HIDE_ON = ["/onboarding", "/login"];

export default function MobileBottomNav() {
  const location = useLocation();
  const shouldHide = HIDE_ON.some((p) => location.pathname.startsWith(p));
  if (shouldHide) return null;

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-50",
        "border-t bg-background/95 backdrop-blur",
        "supports-[backdrop-filter]:bg-background/70"
      )}
      style={{
        paddingBottom: "env(safe-area-inset-bottom)", // iPhone 安全区
      }}
      aria-label="Bottom Navigation"
    >
      <div className="mx-auto max-w-md px-2 ">
        <div className="grid grid-cols-3 gap-1 py-2">
          {tabs.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className="block">
              {({ isActive }) => (
                <button
                  type="button"
                  className={cn(
                    "h-12 w-full flex-col gap-1 rounded-xl",
                    "inline-flex items-center justify-center",
                    "transition-all duration-300 ease-in-out",
                    isActive
                      ? "bg-gradient-to-r from-[hsl(220,70.9%,70.4%)] via-[hsl(220, 83.60%, 85.70%)] to-[hsl(220,80%,60%)] text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-[11px] leading-none">{label}</span>
                </button>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
