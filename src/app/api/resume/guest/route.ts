import { NextResponse } from "next/server";
import { createResumeFromGuestData } from "@/actions/resume";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const resume = await createResumeFromGuestData(payload);
    return NextResponse.json({ id: resume.id });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message || "Failed to migrate guest resume" },
      { status: 500 }
    );
  }
}
