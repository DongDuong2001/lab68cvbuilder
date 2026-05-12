import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { applications, mockInterviews } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import MockInterviewClient from "@/components/applications/mock-interview-client";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";

export default async function MockInterviewPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id: applicationId } = await params;

  // Verify application exists and belongs to user
  const application = await db
    .select()
    .from(applications)
    .where(
      and(
        eq(applications.id, applicationId),
        eq(applications.userId, session.user.id),
      ),
    )
    .limit(1)
    .then((res) => res[0]);

  if (!application) {
    redirect("/applications");
  }

  // Check if they already have an interview for this app
  const existingInterview = await db
    .select()
    .from(mockInterviews)
    .where(
      and(
        eq(mockInterviews.applicationId, applicationId),
        eq(mockInterviews.userId, session.user.id),
      ),
    )
    .limit(1)
    .then((res) => res[0]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto mb-8">
        <Link
          href="/applications"
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Applications
        </Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-4">
          Interactive Mock Interview
        </h1>
        <p className="mt-2 text-gray-600">
          Tailored to your resume and the target job description. We&apos;ll ask
          you 5 questions, you can speak your answers via microphone or type
          them, and AI will give immediate feedback on how to improve.
        </p>
      </div>

      <MockInterviewClient
        applicationId={applicationId}
        existingInterviewId={existingInterview?.id}
        initialQuestions={existingInterview?.questions || []}
        initialAnswers={existingInterview?.answers || []}
      />
    </div>
  );
}
