"use client";

import Link from "next/link";
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
  const router = useRouter();

  const template = TEMPLATES.find((t) => t.id === resume.templateId);
  const updatedDate = new Date(resume.updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
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
