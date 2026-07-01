import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-ajo-surface">
      <DashboardSidebar />
      <div className="ml-60 flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}
