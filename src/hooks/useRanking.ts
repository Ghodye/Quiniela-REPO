import { useState, useCallback } from "react";
import type { RankingEntry } from "@/types";

export function useRanking(apiUrl: string) {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl);
      const data = (await res.json()) as { ranking?: RankingEntry[] };
      if (data.ranking) {
        setRanking(data.ranking);
      }
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  return { ranking, loading, load };
}
