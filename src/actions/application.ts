"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { applications, jobs, resumes } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { isApplicationStatus, type ApplicationStatus } from "@/lib/application-status";

async function getAuthUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

export async function createApplication(input: {
  jobId: string;
  resumeId?: string;
  resumeVersionId?: string;
  status?: ApplicationStatus;
  notes?: string;
  appliedAt?: Date;
}) {
  const userId = await getAuthUserId();

  const status = input.status ?? "wishlist";
  if (!isApplicationStatus(status)) {
    throw new Error("Invalid application status");
  }

  const [created] = await db
    .insert(applications)
    .values({
      userId,
      jobId: input.jobId,
      resumeId: input.resumeId,
      resumeVersionId: input.resumeVersionId,
      status,
      notes: input.notes,
      appliedAt: input.appliedAt,
    })
    .returning();

  return created;
}

export async function getUserApplications() {
  const userId = await getAuthUserId();

  return db
    .select({
      applicationId: applications.id,
      status: applications.status,
      notes: applications.notes,
      appliedAt: applications.appliedAt,
      nextStepAt: applications.nextStepAt,
      createdAt: applications.createdAt,
      updatedAt: applications.updatedAt,
      jobId: jobs.id,
      jobTitle: jobs.title,
      company: jobs.company,
      location: jobs.location,
      resumeId: resumes.id,
      resumeTitle: resumes.title,
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .leftJoin(resumes, eq(applications.resumeId, resumes.id))
    .where(eq(applications.userId, userId))
    .orderBy(desc(applications.updatedAt));
}

export async function updateApplication(
  applicationId: string,
  input: Partial<{
    status: ApplicationStatus;
    notes: string;
    appliedAt: Date;
    nextStepAt: Date;
    resumeId: string | null;
    resumeVersionId: string | null;
  }>
) {
  const userId = await getAuthUserId();

  if (input.status && !isApplicationStatus(input.status)) {
    throw new Error("Invalid application status");
  }

  const [updated] = await db
    .update(applications)
    .set({
      ...input,
      updatedAt: new Date(),
    })
    .where(and(eq(applications.id, applicationId), eq(applications.userId, userId)))
    .returning();

  if (!updated) {
    throw new Error("Application not found or unauthorized");
  }

  return updated;
}

export async function deleteApplication(applicationId: string) {
  const userId = await getAuthUserId();

  const [deleted] = await db
    .delete(applications)
    .where(and(eq(applications.id, applicationId), eq(applications.userId, userId)))
    .returning();

  if (!deleted) {
    throw new Error("Application not found or unauthorized");
  }

  return deleted;
}
