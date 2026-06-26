import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { LevelUpModal } from "@/components/LevelUpModal";
import { StoreSync } from "@/components/StoreSync";
import { StudySessionModal } from "@/components/StudySessionModal";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-canvas">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 lg:p-5 pb-20 lg:pb-5">
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>

      <BottomNav />
      <LevelUpModal />
      <StudySessionModal />
      <StoreSync />
    </div>
  );
}
