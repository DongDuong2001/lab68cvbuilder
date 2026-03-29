import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createRateLimiter, getClientIp, rateLimitResponse } from "@/lib/rate-limit";
import { badRequest, mapErrorToApiResponse } from "@/lib/api-error";

// Configure Cloudinary from CLOUDINARY_URL env var
// CLOUDINARY_URL format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
cloudinary.config({
    secure: true,
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const limiter = createRateLimiter({ limit: 5, windowSeconds: 60 });

export async function POST(request: NextRequest) {
    try {
        // Rate limit by client IP
        const ip = getClientIp(request.headers);
        const rl = await limiter.check(ip);
        if (!rl.allowed) return rateLimitResponse(rl.retryAfterSeconds);

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return badRequest("No file provided");
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return badRequest("Invalid file type. Only JPEG, PNG, and WebP are allowed.");
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return badRequest("File too large. Maximum size is 10MB.");
        }

        // Convert to buffer then to base64 data URI for Cloudinary upload
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(base64, {
            folder: "lab68cv/avatars",
            transformation: [
                { width: 400, height: 400, crop: "fill", gravity: "face" },
                { quality: "auto", fetch_format: "auto" },
            ],
        });

        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id,
        });
    } catch (error: unknown) {
        console.error("Avatar upload error:", error);
        return mapErrorToApiResponse(error, "Upload failed");
    }
}
