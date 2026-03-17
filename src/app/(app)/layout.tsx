import { FloatingDock } from "@/components/floating-dock";
import { TopBar } from "@/components/top-bar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar userName="Alex" partnerName="Jordan" />
      <main className="flex-1 px-6 pb-24">
        <div className="mx-auto max-w-[760px]">{children}</div>
      </main>
      <FloatingDock />
    </div>
  );
}
