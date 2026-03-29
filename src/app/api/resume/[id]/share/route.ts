import { mapErrorToApiResponse } from "@/lib/api-error";
import { updateResumeShareSettings } from "@/actions/resume";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const payload = (await request.json()) as {
      isPublic?: boolean;
      shareEmail?: boolean;
      sharePhone?: boolean;
      shareLocation?: boolean;
    };

    const updated = await updateResumeShareSettings(id, {
      isPublic: Boolean(payload.isPublic),
      shareEmail: payload.shareEmail !== false,
      sharePhone: payload.sharePhone !== false,
      shareLocation: payload.shareLocation !== false,
    });

    return Response.json({
      id: updated.id,
      isPublic: updated.isPublic,
      shareEmail: updated.data.personalInfo.shareEmail !== false,
      sharePhone: updated.data.personalInfo.sharePhone !== false,
      shareLocation: updated.data.personalInfo.shareLocation !== false,
    });
  } catch (error: unknown) {
    return mapErrorToApiResponse(error, "Failed to update share settings");
  }
}
