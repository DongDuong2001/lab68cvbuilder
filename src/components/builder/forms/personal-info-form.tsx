"use client";

import { useRef, useState } from "react";
import { useResumeStore } from "@/store/resume-store";

// ── Validation Helpers ────────────────────────────────────────
const MAX_NAME_LENGTH = 100;
const MAX_SUMMARY_LENGTH = 500;
const MAX_PHONE_LENGTH = 20;

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d\s\-().]*$/;

/** Strip HTML tags to prevent XSS in rendered output */
function sanitize(value: string): string {
  return value.replace(/<[^>]*>/g, "");
}

export function PersonalInfoForm() {
  const { data, setData } = useResumeStore();
  const { personalInfo } = data;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateField = (field: keyof typeof personalInfo, value: string) => {
    // Sanitize all text input
    const clean = sanitize(value);

    // Clear any error for this field
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });

    setData({
      ...data,
      personalInfo: {
        ...personalInfo,
        [field]: clean,
      },
    });
  };

  // ── Field-level validation on blur ──────────────────────────
  const validateField = (field: string, value: string) => {
    let error = "";

    switch (field) {
      case "fullName":
        if (!value.trim()) error = "Name is required";
        else if (value.length > MAX_NAME_LENGTH) error = `Max ${MAX_NAME_LENGTH} characters`;
        break;
      case "email":
        if (!value.trim()) error = "Email is required";
        else if (!EMAIL_REGEX.test(value)) error = "Enter a valid email address";
        break;
      case "phone":
        if (value && !PHONE_REGEX.test(value))
          error = "Use digits, spaces, +, -, or parentheses only";
        break;
    }

    setErrors((prev) => {
      const next = { ...prev };
      if (error) next[field] = error;
      else delete next[field];
      return next;
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      alert("Image must be under 10MB.");
      return;
    }

    // Validate type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Only JPEG, PNG, and WebP images are allowed.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload/avatar", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const { url } = await res.json();
      updateField("avatarUrl", url);
    } catch (err: unknown) {
      alert((err as Error).message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeAvatar = () => {
    updateField("avatarUrl", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /** Helper: input class with error state */
  const inputClass = (field: string) =>
    `w-full border bg-transparent px-4 py-3 transition-all duration-150 ${errors[field]
      ? "border-red-500 focus:bg-red-50 focus:text-red-900"
      : "border-black focus:bg-black focus:text-white"
    }`;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <span className="label-mono block mb-4">SECTION_01 // PERSONAL</span>
        <h2 className="text-3xl font-black tracking-tight mb-2">
          Personal Information
        </h2>
        <p className="text-sm text-gray-600">
          Basic contact details and professional links
        </p>
      </div>

      <div className="border-t border-black pt-6 space-y-6">
        {/* Avatar Upload */}
        <div>
          <label className="label-mono block mb-3">AVATAR_PHOTO</label>
          <p className="text-xs text-gray-500 mb-3">
            Optional — used in the Creative / Portfolio template
          </p>
          <div className="flex items-center gap-4">
            {personalInfo.avatarUrl ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={personalInfo.avatarUrl}
                  alt="Avatar"
                  className="w-20 h-20 rounded-full object-cover border-2 border-black"
                />
                <button
                  onClick={removeAvatar}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
                >
                  ✕
                </button>
              </div>
            ) : isUploading ? (
              <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center text-xs font-bold animate-pulse bg-gray-100">
                UPLOADING
              </div>
            ) : (
              <div className="w-20 h-20 rounded-full border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-400 text-xs">
                No Photo
              </div>
            )}
            <div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className={`border border-black px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-150 ${isUploading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "hover:bg-black hover:text-white"
                  }`}
              >
                {isUploading ? "Uploading..." : personalInfo.avatarUrl ? "Change Photo" : "Upload Photo"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarUpload}
                className="hidden"
              />
              <div className="text-[10px] text-gray-400 mt-1">
                JPG, PNG, WebP • Max 10MB
              </div>
            </div>
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="label-mono block mb-2">FULL_NAME *</label>
          <input
            type="text"
            value={personalInfo.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            onBlur={(e) => validateField("fullName", e.target.value)}
            placeholder="John Doe"
            maxLength={MAX_NAME_LENGTH}
            className={inputClass("fullName")}
          />
          <div className="flex justify-between mt-1">
            {errors.fullName ? (
              <span className="text-xs text-red-500 font-medium">{errors.fullName}</span>
            ) : (
              <span />
            )}
            <span className="label-mono text-gray-400 text-[10px]">
              {personalInfo.fullName.length}/{MAX_NAME_LENGTH}
            </span>
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="label-mono block mb-2">EMAIL *</label>
          <input
            type="email"
            value={personalInfo.email}
            onChange={(e) => updateField("email", e.target.value)}
            onBlur={(e) => validateField("email", e.target.value)}
            placeholder="john@example.com"
            className={inputClass("email")}
          />
          {errors.email && (
            <span className="text-xs text-red-500 font-medium mt-1 block">{errors.email}</span>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="label-mono block mb-2">PHONE</label>
          <input
            type="tel"
            value={personalInfo.phone || ""}
            onChange={(e) => {
              // Only allow valid phone characters
              if (PHONE_REGEX.test(e.target.value) || e.target.value === "") {
                updateField("phone", e.target.value);
              }
            }}
            onBlur={(e) => validateField("phone", e.target.value)}
            placeholder="+1 (555) 123-4567"
            maxLength={MAX_PHONE_LENGTH}
            className={inputClass("phone")}
          />
          {errors.phone ? (
            <span className="text-xs text-red-500 font-medium mt-1 block">{errors.phone}</span>
          ) : (
            <span className="text-[10px] text-gray-400 mt-1 block">
              Digits, spaces, +, -, or parentheses
            </span>
          )}
        </div>

        {/* Location */}
        <div>
          <label className="label-mono block mb-2">LOCATION</label>
          <input
            type="text"
            value={personalInfo.location || ""}
            onChange={(e) => updateField("location", e.target.value)}
            placeholder="San Francisco, CA"
            maxLength={100}
            className="w-full border border-black bg-transparent px-4 py-3 focus:bg-black focus:text-white transition-all duration-150"
          />
        </div>

        {/* Website */}
        <div>
          <label className="label-mono block mb-2">WEBSITE</label>
          <input
            type="url"
            value={personalInfo.website || ""}
            onChange={(e) => updateField("website", e.target.value)}
            placeholder="https://example.com"
            className="w-full border border-black bg-transparent px-4 py-3 focus:bg-black focus:text-white transition-all duration-150"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="label-mono block mb-2">LINKEDIN</label>
          <input
            type="url"
            value={personalInfo.linkedin || ""}
            onChange={(e) => updateField("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/johndoe"
            className="w-full border border-black bg-transparent px-4 py-3 focus:bg-black focus:text-white transition-all duration-150"
          />
        </div>

        {/* GitHub */}
        <div>
          <label className="label-mono block mb-2">GITHUB</label>
          <input
            type="url"
            value={personalInfo.github || ""}
            onChange={(e) => updateField("github", e.target.value)}
            placeholder="https://github.com/johndoe"
            className="w-full border border-black bg-transparent px-4 py-3 focus:bg-black focus:text-white transition-all duration-150"
          />
        </div>

        {/* Summary */}
        <div>
          <label className="label-mono block mb-2">PROFESSIONAL_SUMMARY</label>
          <textarea
            value={personalInfo.summary || ""}
            onChange={(e) => {
              if (e.target.value.length <= MAX_SUMMARY_LENGTH) {
                updateField("summary", e.target.value);
              }
            }}
            placeholder="A brief professional summary or objective statement..."
            rows={6}
            maxLength={MAX_SUMMARY_LENGTH}
            className="w-full border border-black bg-transparent px-4 py-3 focus:bg-black focus:text-white transition-all duration-150 resize-none"
          />
          <span className="label-mono text-gray-500 text-xs block mt-2">
            {personalInfo.summary?.length || 0} / {MAX_SUMMARY_LENGTH} characters
          </span>
        </div>
      </div>
    </div>
  );
}
