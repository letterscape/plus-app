export const queryHeurist = async (query: string) => {
    const response = await fetch("/api/heurist-proxy", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.NEXT_PUBLIC_HEURIST_API_KEY}`
        },
        body: JSON.stringify({
            agent_id: "CoinGeckoTokenInfoAgent",
            input: { query, raw_data_only: false }
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};
