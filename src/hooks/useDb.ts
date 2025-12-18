import { useEffect, useRef } from 'react';
import { Meta } from '@/models/Meta';
import { Query } from '@/models/Query';
import { db } from '@/lib/db';
import { applyDemoData } from '@/services/demo';

const SAVE_DEBOUNCE_MS = 300;

export function useDb({
  meta,
  queries,
  setMeta,
  setQueries,
  setIsLoading,
}: {
  meta: Meta;
  queries: Query[];
  setMeta: React.Dispatch<React.SetStateAction<Meta>>;
  setQueries: React.Dispatch<React.SetStateAction<Query[]>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const hasLoadedRef = useRef(false);

  // Load once on mount
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);

      const result = await db.load();

      if (cancelled) {
        return;
      }

      if (!result) {
        applyDemoData(setMeta, setQueries);
      } else {
        setMeta(result.meta);
        setQueries(result.queries);
      }

      hasLoadedRef.current = true;
      setIsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [setMeta, setQueries, setIsLoading]);

  // Debounced save on change
  useEffect(() => {
    if (!hasLoadedRef.current) {
      return;
    }

    let cancelled = false;

    const timeoutId = setTimeout(async () => {
      if (cancelled) {
        return;
      }

      await db.save(meta, queries);
    }, SAVE_DEBOUNCE_MS);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [meta, queries]);
}
