import { NextResponse } from "next/server";
import { updateResume } from "@/actions/resume";
import { mapErrorToApiResponse } from "@/lib/api-error";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const payload = await request.json();
    const resume = await updateResume(id, payload);
    return NextResponse.json({ id: resume.id, updatedAt: resume.updatedAt });
  } catch (error: unknown) {
    return mapErrorToApiResponse(error, "Failed to update resume");
  }
}
