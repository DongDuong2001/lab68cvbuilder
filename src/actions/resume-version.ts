"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { resumeVersions, resumes, type ResumeData } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

async function getAuthUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

export async function createResumeVersion(input: {
  resumeId: string;
  title: string;
  templateId: string;
  fontFamily: string;
  data: ResumeData;
  source?: string;
  changeSummary?: string;
}) {
  const userId = await getAuthUserId();

  const [created] = await db
    .insert(resumeVersions)
    .values({
      userId,
      resumeId: input.resumeId,
      title: input.title,
      templateId: input.templateId,
      fontFamily: input.fontFamily,
      data: input.data,
      source: input.source ?? "manual",
      changeSummary: input.changeSummary,
    })
    .returning();

  return created;
}

export async function getResumeVersions(resumeId: string) {
  const userId = await getAuthUserId();

  return db
    .select()
    .from(resumeVersions)
    .where(and(eq(resumeVersions.userId, userId), eq(resumeVersions.resumeId, resumeId)))
    .orderBy(desc(resumeVersions.createdAt));
}

export async function restoreResumeVersion(resumeId: string, versionId: string) {
  const userId = await getAuthUserId();

  const [version] = await db
    .select()
    .from(resumeVersions)
    .where(
      and(
        eq(resumeVersions.id, versionId),
        eq(resumeVersions.resumeId, resumeId),
        eq(resumeVersions.userId, userId)
      )
    );

  if (!version) {
    throw new Error("Version not found or unauthorized");
  }

  const [updated] = await db
    .update(resumes)
    .set({
      title: version.title,
      templateId: version.templateId,
      fontFamily: version.fontFamily,
      data: version.data,
      updatedAt: new Date(),
    })
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))
    .returning();

  if (!updated) {
    throw new Error("Resume not found or unauthorized");
  }

  return updated;
}

export async function updateResumeVersionLabel(versionId: string, label: string) {
  const userId = await getAuthUserId();

  const normalized = label.trim().slice(0, 160);

  const [updated] = await db
    .update(resumeVersions)
    .set({
      changeSummary: normalized.length > 0 ? normalized : null,
    })
    .where(and(eq(resumeVersions.id, versionId), eq(resumeVersions.userId, userId)))
    .returning();

  if (!updated) {
    throw new Error("Version not found or unauthorized");
  }

  return updated;
}
