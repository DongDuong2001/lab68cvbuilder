import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Link } from "@/i18n/routing";
import { getUserJobs, createJob } from "@/actions/job";
import {
  createApplication,
  deleteApplication,
  getUserApplications,
  updateApplication,
} from "@/actions/application";
import { getUserResumes } from "@/actions/resume";
import { APPLICATION_STATUSES, type ApplicationStatus } from "@/lib/application-status";

function formatDate(value: Date | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default async function ApplicationsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [jobs, resumes, applications] = await Promise.all([
    getUserJobs(),
    getUserResumes(),
    getUserApplications(),
  ]);

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b border-black p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <span className="label-mono block mb-1">APPLICATIONS // TRACKER</span>
            <h1 className="text-3xl font-black tracking-tight">Job Pipeline</h1>
          </div>
          <Link
            href="/dashboard"
            className="border border-black px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-150"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 grid gap-6 lg:grid-cols-2">
        <section className="border border-black p-6">
          <h2 className="text-xl font-black mb-4">Create Job</h2>
          <form
            action={async (formData) => {
              "use server";
              await createJob({
                title: String(formData.get("title") || "").trim(),
                company: String(formData.get("company") || "").trim(),
                location: String(formData.get("location") || "").trim() || undefined,
                sourceUrl: String(formData.get("sourceUrl") || "").trim() || undefined,
                jdText: String(formData.get("jdText") || "").trim(),
              });
            }}
            className="space-y-3"
          >
            <input name="title" required placeholder="Job title" className="w-full border border-black px-3 py-2 text-sm" />
            <input name="company" required placeholder="Company" className="w-full border border-black px-3 py-2 text-sm" />
            <input name="location" placeholder="Location (optional)" className="w-full border border-black px-3 py-2 text-sm" />
            <input name="sourceUrl" placeholder="Source URL (optional)" className="w-full border border-black px-3 py-2 text-sm" />
            <textarea
              name="jdText"
              required
              placeholder="Paste job description"
              rows={8}
              className="w-full border border-black px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="border border-black bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-150"
            >
              Save Job
            </button>
          </form>
        </section>

        <section className="border border-black p-6">
          <h2 className="text-xl font-black mb-4">Create Application</h2>
          <form
            action={async (formData) => {
              "use server";

              const selectedStatus = String(formData.get("status") || "wishlist");
              await createApplication({
                jobId: String(formData.get("jobId")),
                resumeId: String(formData.get("resumeId") || "") || undefined,
                status: selectedStatus as ApplicationStatus,
                notes: String(formData.get("notes") || "").trim() || undefined,
              });
            }}
            className="space-y-3"
          >
            <select aria-label="Select job" name="jobId" required className="w-full border border-black px-3 py-2 text-sm bg-white">
              <option value="">Select job</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} @ {job.company}
                </option>
              ))}
            </select>

            <select aria-label="Select resume" name="resumeId" className="w-full border border-black px-3 py-2 text-sm bg-white">
              <option value="">Attach resume (optional)</option>
              {resumes.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.title}
                </option>
              ))}
            </select>

            <select aria-label="Select status" name="status" defaultValue="wishlist" className="w-full border border-black px-3 py-2 text-sm bg-white">
              {APPLICATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status.toUpperCase()}
                </option>
              ))}
            </select>

            <textarea name="notes" placeholder="Notes (optional)" rows={5} className="w-full border border-black px-3 py-2 text-sm" />
            <button
              type="submit"
              className="border border-black bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-150"
            >
              Add Application
            </button>
          </form>
        </section>

        <section className="lg:col-span-2 border border-black">
          <div className="px-6 py-4 border-b border-black flex items-center justify-between gap-4">
            <h2 className="text-xl font-black">Pipeline</h2>
            <span className="label-mono">{applications.length} records</span>
          </div>

          {applications.length === 0 ? (
            <p className="p-6 text-sm text-gray-600">No applications yet. Add your first one above.</p>
          ) : (
            <div className="divide-y divide-black/10">
              {applications.map((item) => (
                <div key={item.applicationId} className="p-6 grid gap-4 lg:grid-cols-[1fr_auto]">
                  <div>
                    <p className="text-lg font-black tracking-tight">{item.jobTitle}</p>
                    <p className="text-sm text-gray-600">{item.company} {item.location ? `• ${item.location}` : ""}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Applied: {formatDate(item.appliedAt)} • Updated: {formatDate(item.updatedAt)}
                    </p>
                    {item.resumeTitle ? (
                      <p className="text-xs mt-2">Resume: <span className="font-bold">{item.resumeTitle}</span></p>
                    ) : null}
                    {item.notes ? (
                      <p className="text-sm mt-3 border-l-2 border-black pl-3">{item.notes}</p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-2">
                    <form
                      action={async (formData) => {
                        "use server";
                        await updateApplication(String(formData.get("id")), {
                          status: String(formData.get("status")) as ApplicationStatus,
                        });
                      }}
                      className="flex gap-2"
                    >
                      <input type="hidden" name="id" value={item.applicationId} />
                      <select aria-label="Update application status" name="status" defaultValue={item.status} className="border border-black px-2 py-1 text-xs bg-white">
                        {APPLICATION_STATUSES.map((status) => (
                          <option key={status} value={status}>
                            {status.toUpperCase()}
                          </option>
                        ))}
                      </select>
                      <button type="submit" className="border border-black px-3 py-1 text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-150">
                        Save
                      </button>
                    </form>

                    <form
                      action={async (formData) => {
                        "use server";
                        await deleteApplication(String(formData.get("id")));
                      }}
                    >
                      <input type="hidden" name="id" value={item.applicationId} />
                      <button type="submit" className="border border-red-600 text-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider hover:bg-red-600 hover:text-white transition-colors duration-150 w-full">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
