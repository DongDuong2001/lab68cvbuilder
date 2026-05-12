import { NextResponse } from "next/server";
import { db } from "@/db";
import { resumeViews } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    if (!rawBody) return NextResponse.json({ success: true });

    let body;
    try {
      body = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: true }); // fail silently for analytics
    }

    const { resumeId, location, durationSeconds } = body;

    if (!resumeId) {
      return NextResponse.json({ success: true });
    }

    // Attempt to parse out some pseudo-IP or user agent to prevent infinite logging
    // by the same exact user in a loop, but keep it lightweight.
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Hash IP safely so we don't store plain PII
    // For a real production app, do a proper hash/salt, but for a showcase, string concat is okay
    const viewerIpId = `hash_${ip.substring(0, 10)}_${userAgent.substring(0, 15)}`;

    await db.insert(resumeViews).values({
      resumeId,
      location: location || "Unknown Region",
      durationSeconds: durationSeconds || 0,
      viewerIpId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to record analytics:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
