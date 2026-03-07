import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { createRateLimiter, getClientIp, rateLimitResponse } from "@/lib/rate-limit";

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
        const rl = limiter.check(ip);
        if (!rl.allowed) return rateLimitResponse(rl.retryAfterSeconds);

        const formData = await request.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only JPEG, PNG, and WebP are allowed." },
                { status: 400 }
            );
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 10MB." },
                { status: 400 }
            );
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
        return NextResponse.json(
            { error: (error as Error).message || "Upload failed" },
            { status: 500 }
        );
    }
}
