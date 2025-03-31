import { useState } from "react";

export const useHeurist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHeurist = async (query: string, agent_id: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/heurist-proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HEURIST_API_KEY}`
        },
        body: JSON.stringify({
          agent_id: agent_id,
          input: { query, raw_data_only: false }
        })
      });

      if (!response.ok) throw new Error("API request failed");
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { fetchHeurist, loading, error };
};
