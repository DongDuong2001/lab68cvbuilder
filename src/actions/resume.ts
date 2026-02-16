"use server";

import { db } from "@/db";
import { resumes } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
import type { ResumeData } from "@/db/schema";

/**
 * Helper: Get the authenticated user ID or throw.
 * Enforces RLS at the application layer.
 */
async function getAuthUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

// ── CREATE ──────────────────────────────────────────────────

export async function createResume(title: string, templateId: string = "lab-protocol") {
  const userId = await getAuthUserId();

  const defaultData: ResumeData = {
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
      summary: "",
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
  };

  const [resume] = await db
    .insert(resumes)
    .values({
      userId,
      title,
      templateId,
      data: defaultData,
    })
    .returning();

  return resume;
}

// ── READ (LIST) ─────────────────────────────────────────────

export async function getUserResumes() {
  const userId = await getAuthUserId();

  return db
    .select()
    .from(resumes)
    .where(eq(resumes.userId, userId))
    .orderBy(resumes.updatedAt);
}

// ── READ (SINGLE) ───────────────────────────────────────────

export async function getResume(resumeId: string) {
  const userId = await getAuthUserId();

  const [resume] = await db
    .select()
    .from(resumes)
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)));

  if (!resume) {
    throw new Error("Resume not found");
  }

  return resume;
}

// ── UPDATE ──────────────────────────────────────────────────

export async function updateResume(
  resumeId: string,
  data: Partial<{
    title: string;
    data: ResumeData;
    templateId: string;
    fontFamily: string;
    isPublic: boolean;
  }>
) {
  const userId = await getAuthUserId();

  const [updated] = await db
    .update(resumes)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))
    .returning();

  if (!updated) {
    throw new Error("Resume not found or unauthorized");
  }

  return updated;
}

// ── DELETE ──────────────────────────────────────────────────

export async function deleteResume(resumeId: string) {
  const userId = await getAuthUserId();

  const [deleted] = await db
    .delete(resumes)
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))
    .returning();

  if (!deleted) {
    throw new Error("Resume not found or unauthorized");
  }

  return deleted;
}
