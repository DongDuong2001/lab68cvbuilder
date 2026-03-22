"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { usageEvents } from "@/db/schema";
import type { UsageEventName } from "@/lib/usage-events";

async function getAuthUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

export async function trackUsageEvent(
  eventName: UsageEventName,
  metadata: Record<string, unknown> = {}
) {
  try {
    const userId = await getAuthUserId();
    await db.insert(usageEvents).values({
      userId,
      eventName,
      metadata,
    });
    return { success: true as const };
  } catch {
    // Analytics must never block the primary user flow.
    return { success: false as const };
  }
}
