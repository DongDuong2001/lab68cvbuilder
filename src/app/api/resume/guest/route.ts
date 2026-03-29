import { NextResponse } from "next/server";
import { createResumeFromGuestData } from "@/actions/resume";
import { mapErrorToApiResponse } from "@/lib/api-error";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const resume = await createResumeFromGuestData(payload);
    return NextResponse.json({ id: resume.id });
  } catch (error: unknown) {
    return mapErrorToApiResponse(error, "Failed to migrate guest resume");
  }
}
