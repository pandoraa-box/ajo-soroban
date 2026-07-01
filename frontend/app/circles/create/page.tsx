import { CreateCircleForm } from '@/components/circles/CreateCircleForm';

export default function CreateCirclePage() {
  return (
    <div className="min-h-screen bg-ajo-bg px-6 py-14">
      <div className="mx-auto max-w-xl">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-ajo-dark">
            Start a Circle
          </h1>
          <p className="mt-2 text-ajo-muted">
            Configure your Ajo savings group. You&apos;ll be assigned rotation slot #1.
          </p>
        </div>
        <div className="rounded-2xl border border-ajo-border bg-white p-8 shadow-sm">
          <CreateCircleForm />
        </div>
      </div>
    </div>
  );
}
