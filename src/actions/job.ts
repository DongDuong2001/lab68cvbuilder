"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { jobs } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

async function getAuthUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

function extractKeywords(jdText: string): string[] {
  const stopwords = new Set([
    "and", "the", "with", "from", "that", "this", "will", "your", "you",
    "are", "for", "our", "have", "has", "into", "their", "who", "what",
  ]);

  const words = jdText
    .toLowerCase()
    .replace(/[^a-z0-9+.#\-\s]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !stopwords.has(w));

  const freq = new Map<string, number>();
  for (const word of words) {
    freq.set(word, (freq.get(word) ?? 0) + 1);
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 25)
    .map(([word]) => word);
}

export async function createJob(input: {
  title: string;
  company: string;
  location?: string;
  sourceUrl?: string;
  jdText: string;
}) {
  const userId = await getAuthUserId();

  const [created] = await db
    .insert(jobs)
    .values({
      userId,
      title: input.title,
      company: input.company,
      location: input.location,
      sourceUrl: input.sourceUrl,
      jdText: input.jdText,
      extractedKeywords: extractKeywords(input.jdText),
    })
    .returning();

  return created;
}

export async function getUserJobs() {
  const userId = await getAuthUserId();

  return db
    .select()
    .from(jobs)
    .where(eq(jobs.userId, userId))
    .orderBy(desc(jobs.updatedAt));
}

export async function updateJob(
  jobId: string,
  input: Partial<{
    title: string;
    company: string;
    location: string;
    sourceUrl: string;
    jdText: string;
  }>
) {
  const userId = await getAuthUserId();

  const payload = {
    ...input,
    ...(input.jdText ? { extractedKeywords: extractKeywords(input.jdText) } : {}),
    updatedAt: new Date(),
  };

  const [updated] = await db
    .update(jobs)
    .set(payload)
    .where(and(eq(jobs.id, jobId), eq(jobs.userId, userId)))
    .returning();

  if (!updated) {
    throw new Error("Job not found or unauthorized");
  }

  return updated;
}

export async function deleteJob(jobId: string) {
  const userId = await getAuthUserId();

  const [deleted] = await db
    .delete(jobs)
    .where(and(eq(jobs.id, jobId), eq(jobs.userId, userId)))
    .returning();

  if (!deleted) {
    throw new Error("Job not found or unauthorized");
  }

  return deleted;
}
