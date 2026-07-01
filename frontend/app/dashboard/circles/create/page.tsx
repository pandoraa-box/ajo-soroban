import { CreateCircleForm } from '@/components/circles/CreateCircleForm';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function DashboardCreateCirclePage() {
  return (
    <>
      {/* Page header */}
      <div className="border-b border-ajo-border bg-white px-10 py-8">
        <Link
          href="/dashboard/circles"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-ajo-muted hover:text-ajo-dark transition-colors"
        >
          <ChevronLeft size={14} />
          Back to Circles
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-ajo-dark">Start a Circle</h1>
        <p className="mt-2 text-ajo-muted">
          Set up your savings group. You'll be first in the rotation.
        </p>
      </div>

      <div className="px-10 py-10">
        <div className="max-w-xl">
          <div className="rounded-3xl border border-ajo-border bg-white p-10 shadow-sm">
            <CreateCircleForm />
          </div>
        </div>
      </div>
    </>
  );
}
