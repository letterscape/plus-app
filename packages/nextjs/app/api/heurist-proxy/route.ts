import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    try {
        const apiResponse = await fetch("https://sequencer-v2.heurist.xyz/mesh_request", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": req.headers.get("Authorization") || ""
            },
            body: JSON.stringify(body)
        });
        return NextResponse.json(await apiResponse.json());
    } catch (error) {
        return NextResponse.json(
            { error: "Heurist API request failed" },
            { status: 500 }
        );
    }
}
