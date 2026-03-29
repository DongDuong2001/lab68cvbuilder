"use client";

import { Link } from "@/i18n/routing";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteResume } from "@/actions/resume";
import type { Resume } from "@/db/schema";
import { TEMPLATES } from "@/lib/constants";

interface ResumeCardProps {
  resume: Resume;
}

export function ResumeCard({ resume }: ResumeCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [isSavingShare, setIsSavingShare] = useState(false);
  const [isPublic, setIsPublic] = useState(resume.isPublic);
  const [shareEmail, setShareEmail] = useState(resume.data.personalInfo.shareEmail !== false);
  const [sharePhone, setSharePhone] = useState(resume.data.personalInfo.sharePhone !== false);
  const [shareLocation, setShareLocation] = useState(
    resume.data.personalInfo.shareLocation !== false
  );
  const router = useRouter();

  const template = TEMPLATES.find((t) => t.id === resume.templateId);
  const updatedDate = new Date(resume.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteResume(resume.id);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete resume:", error);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const publicLink = `/r/${resume.id}`;

  const handleSaveShare = async () => {
    setIsSavingShare(true);
    try {
      const response = await fetch(`/api/resume/${resume.id}/share`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic, shareEmail, sharePhone, shareLocation }),
      });

      if (!response.ok) {
        throw new Error("Failed to save share settings");
      }

      router.refresh();
    } catch (error) {
      console.error("Failed to save share settings:", error);
    } finally {
      setIsSavingShare(false);
    }
  };

  return (
    <div className="border border-black p-6 hover:border-2 transition-all duration-150 relative group">
      {/* Template badge */}
      <span className="label-mono block mb-3 text-gray-500">
        {template?.name.toUpperCase() || "TEMPLATE"}
      </span>

      {/* Title */}
      <h3 className="text-2xl font-black tracking-tight mb-2 line-clamp-2">
        {resume.title}
      </h3>

      {/* Meta info */}
      <div className="mb-4 pb-4 border-b border-gray-200">
        <span className="text-xs text-gray-500">
          Last edited: {updatedDate}
        </span>
      </div>

      {/* Quick stats */}
      <div className="mb-6 grid grid-cols-2 gap-2 text-xs">
        <div className="border border-gray-300 p-2">
          <span className="label-mono block text-gray-500">EXPERIENCE</span>
          <span className="font-bold">{resume.data.experience.length}</span>
        </div>
        <div className="border border-gray-300 p-2">
          <span className="label-mono block text-gray-500">EDUCATION</span>
          <span className="font-bold">{resume.data.education.length}</span>
        </div>
      </div>

      {/* Actions */}
      {!showDeleteConfirm ? (
        <div className="flex gap-2">
          <Link
            href={`/builder/${resume.id}`}
            className="flex-1 border border-black bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-center hover:bg-white hover:text-black transition-colors duration-150"
          >
            Edit
          </Link>
          <Link
            href={`/builder/${resume.id}?entry=import#personal`}
            className="border border-gray-400 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:border-black hover:bg-black hover:text-white transition-colors duration-150"
          >
            Import
          </Link>
          <Link
            href={`/builder/${resume.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-400 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:border-black hover:bg-black hover:text-white transition-colors duration-150"
          >
            ⧉
          </Link>
          <button
            onClick={() => setShowSharePanel((prev) => !prev)}
            className="border border-gray-400 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:border-black hover:bg-black hover:text-white transition-colors duration-150"
          >
            Share
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="border border-gray-400 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:border-red-600 hover:text-red-600 transition-colors duration-150"
          >
            ×
          </button>
        </div>
      ) : (
        <div className="border-2 border-red-600 p-3">
          <span className="label-mono block mb-2 text-red-600">CONFIRM</span>
          <p className="text-xs mb-3">Delete this resume permanently?</p>
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 border border-red-600 bg-red-600 text-white px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-red-600 transition-colors duration-150 disabled:opacity-50"
            >
              {isDeleting ? "..." : "Delete"}
            </button>
            <button
              onClick={() => setShowDeleteConfirm(false)}
              disabled={isDeleting}
              className="flex-1 border border-black px-3 py-2 text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-150 disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showSharePanel && !showDeleteConfirm ? (
        <div className="mt-4 border border-black p-3 space-y-3">
          <span className="label-mono block">PUBLIC SHARE</span>
          <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Enable public link
          </label>
          <div className="grid gap-2 text-xs">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={shareEmail}
                onChange={(e) => setShareEmail(e.target.checked)}
              />
              Show email
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={sharePhone}
                onChange={(e) => setSharePhone(e.target.checked)}
              />
              Show phone
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={shareLocation}
                onChange={(e) => setShareLocation(e.target.checked)}
              />
              Show location
            </label>
          </div>

          {isPublic ? (
            <Link
              href={publicLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex border border-black px-3 py-1 text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-colors duration-150"
            >
              Open public link
            </Link>
          ) : null}

          <div className="flex gap-2">
            <button
              onClick={handleSaveShare}
              disabled={isSavingShare}
              className="border border-black bg-black text-white px-3 py-1 text-xs font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-colors duration-150 disabled:opacity-50"
            >
              {isSavingShare ? "Saving..." : "Save share settings"}
            </button>
          </div>
        </div>
      ) : null}

      {/* Public indicator */}
      {resume.isPublic && (
        <div className="absolute top-4 right-4">
          <span className="label-mono text-xs bg-black text-white px-2 py-1">
            PUBLIC
          </span>
        </div>
      )}
    </div>
  );
}
