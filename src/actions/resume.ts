"use server";

import { db } from "@/db";
import { resumes } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
import type { ResumeData } from "@/db/schema";
import { sanitizeResumeData } from "@/lib/sanitize-resume";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";

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

export async function createResume(title: string, templateId: string = "harvard") {
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

  revalidateTag(`user-resumes-${userId}`);
  revalidatePath("/dashboard");
  return resume;
}

// ── READ (LIST) ─────────────────────────────────────────────

export async function getUserResumes() {
  const userId = await getAuthUserId();
  const fetchCached = unstable_cache(
    async (uid: string) =>
      db.select().from(resumes).where(eq(resumes.userId, uid)).orderBy(resumes.updatedAt),
    ["user-resumes"],
    { tags: [`user-resumes-${userId}`], revalidate: 60 }
  );
  return fetchCached(userId);
}

// ── READ (SINGLE) ───────────────────────────────────────────

export async function getResume(resumeId: string) {
  const userId = await getAuthUserId();
  const fetchCached = unstable_cache(
    async (rid: string, uid: string) => {
      const [resume] = await db
        .select()
        .from(resumes)
        .where(and(eq(resumes.id, rid), eq(resumes.userId, uid)));
      if (!resume) throw new Error("Resume not found");
      return resume;
    },
    ["resume-single"],
    { tags: [`resume-${resumeId}`], revalidate: 30 }
  );
  return fetchCached(resumeId, userId);
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

  const sanitizedPayload = {
    ...data,
    ...(data.data ? { data: sanitizeResumeData(data.data) } : {}),
  };

  const [updated] = await db
    .update(resumes)
    .set({
      ...sanitizedPayload,
      updatedAt: new Date(),
    })
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))
    .returning();

  if (!updated) {
    throw new Error("Resume not found or unauthorized");
  }

  revalidateTag(`resume-${resumeId}`);
  revalidateTag(`user-resumes-${userId}`);
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

  revalidateTag(`resume-${resumeId}`);
  revalidateTag(`user-resumes-${userId}`);
  revalidatePath("/dashboard");
  return deleted;
}

// ── DUPLICATE ───────────────────────────────────────────────

export async function duplicateResume(resumeId: string) {
  const userId = await getAuthUserId();

  const [source] = await db
    .select()
    .from(resumes)
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)));

  if (!source) {
    throw new Error("Resume not found or unauthorized");
  }

  const [copy] = await db
    .insert(resumes)
    .values({
      userId,
      title: `${source.title} (Copy)`,
      templateId: source.templateId,
      fontFamily: source.fontFamily,
      data: source.data,
    })
    .returning();

  revalidateTag(`user-resumes-${userId}`);
  revalidatePath("/dashboard");
  return copy;
}

// ── CREATE FROM GUEST DATA ──────────────────────────────────

export async function createResumeFromGuestData(guestData: {
  title: string;
  templateId: string;
  fontFamily: string;
  data: ResumeData;
}) {
  const userId = await getAuthUserId();

  const sanitized = sanitizeResumeData(guestData.data);

  const [resume] = await db
    .insert(resumes)
    .values({
      userId,
      title: guestData.title || "My Resume",
      templateId: guestData.templateId || "harvard",
      fontFamily: guestData.fontFamily || "inter",
      data: sanitized,
    })
    .returning();

  revalidateTag(`user-resumes-${userId}`);
  revalidatePath("/dashboard");
  return resume;
}
