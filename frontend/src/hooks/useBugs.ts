import { useCallback, useEffect, useState } from 'react';
import { Bug, BugStats } from '../types/bug.types';
import { fetchBugs } from '../services/bug.service';
import { getErrorMessage } from '../services/api';

interface UseBugsResult {
  bugs: Bug[];
  stats: BugStats | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBugs(): UseBugsResult {
  const [bugs, setBugs] = useState<Bug[]>([]);
  const [stats, setStats] = useState<BugStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadBugs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchBugs();
      setBugs(response.bugs);
      setStats(response.stats);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBugs();
  }, [loadBugs]);

  return { bugs, stats, isLoading, error, refetch: loadBugs };
}
