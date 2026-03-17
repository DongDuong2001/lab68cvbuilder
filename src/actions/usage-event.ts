"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { usageEvents } from "@/db/schema";

async function getAuthUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

export async function trackUsageEvent(
  eventName: string,
  metadata: Record<string, unknown> = {}
) {
  const userId = await getAuthUserId();

  await db.insert(usageEvents).values({
    userId,
    eventName,
    metadata,
  });
}
