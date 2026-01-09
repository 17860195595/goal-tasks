import MobileBottomNav from "@/components/MobileBottomNav";

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 内容区域：底部留出空间，避免被 tab bar 挡住 */}
      <main className="mx-auto max-w-md px-4 pt-4 pb-24">{children}</main>
      <MobileBottomNav />
    </div>
  );
}
