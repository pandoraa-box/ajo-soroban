'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Circle } from '@/types/ajo';
import { fetchCircle, fetchAllCircles } from '@/lib/contract';

export function useCircle(groupId: number, callerKey: string | null) {
  const [circle, setCircle] = useState<Circle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!callerKey) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchCircle(groupId, callerKey);
      setCircle(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load circle');
    } finally {
      setLoading(false);
    }
  }, [groupId, callerKey]);

  useEffect(() => {
    if (callerKey) refresh();
    else setLoading(false);
  }, [refresh, callerKey]);

  return { circle, loading, error, refresh };
}

export function useAllCircles(callerKey: string | null) {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllCircles(callerKey ?? 'DEMO');
      setCircles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load circles');
    } finally {
      setLoading(false);
    }
  }, [callerKey]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { circles, loading, error, refresh };
}
