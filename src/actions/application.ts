"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { applications, jobs, resumes } from "@/db/schema";
import { and, asc, desc, eq, ilike, or } from "drizzle-orm";
import { isApplicationStatus, type ApplicationStatus } from "@/lib/application-status";
import {
  normalizeApplicationSort,
  normalizeCompanyAndTitle,
  normalizeSearchTerm,
  type ApplicationFilters,
} from "@/lib/application-filters";

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

  const [selectedJob] = await db
    .select({ title: jobs.title, company: jobs.company })
    .from(jobs)
    .where(and(eq(jobs.id, input.jobId), eq(jobs.userId, userId)))
    .limit(1);

  if (!selectedJob) {
    throw new Error("Job not found or unauthorized");
  }

  const duplicateSignature = normalizeCompanyAndTitle(
    selectedJob.company,
    selectedJob.title
  );

  const existing = await db
    .select({
      applicationId: applications.id,
      company: jobs.company,
      title: jobs.title,
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .where(eq(applications.userId, userId));

  const duplicateExists = existing.some(
    (entry) =>
      normalizeCompanyAndTitle(entry.company, entry.title) === duplicateSignature
  );

  if (duplicateExists) {
    throw new Error("Duplicate application detected for this company and role");
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

export async function getUserApplications(filters: ApplicationFilters = {}) {
  const userId = await getAuthUserId();

  const normalizedQ = normalizeSearchTerm(filters.q);
  const normalizedSort = normalizeApplicationSort(filters.sort);

  const whereClauses = [eq(applications.userId, userId)];

  if (filters.status) {
    whereClauses.push(eq(applications.status, filters.status));
  }

  const companyOrRoleFilter = normalizedQ
    ? or(
        ilike(jobs.company, `%${normalizedQ}%`),
        ilike(jobs.title, `%${normalizedQ}%`)
      )
    : undefined;

  const baseQuery = db
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
      extractedKeywords: jobs.extractedKeywords,
      resumeId: resumes.id,
      resumeTitle: resumes.title,
      resumeData: resumes.data,
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .leftJoin(resumes, eq(applications.resumeId, resumes.id));

  const queryWithWhere = companyOrRoleFilter
    ? baseQuery.where(and(...whereClauses, companyOrRoleFilter))
    : baseQuery.where(and(...whereClauses));

  switch (normalizedSort) {
    case "updated_asc":
      return queryWithWhere.orderBy(asc(applications.updatedAt));
    case "applied_desc":
      return queryWithWhere.orderBy(desc(applications.appliedAt), desc(applications.updatedAt));
    case "applied_asc":
      return queryWithWhere.orderBy(asc(applications.appliedAt), desc(applications.updatedAt));
    default:
      return queryWithWhere.orderBy(desc(applications.updatedAt));
  }
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
