"use client";

import { useState } from "react";
import { FiUpload, FiFile, FiAlertCircle } from "react-icons/fi";
import AddListingModal from "@/components/AddListingModal";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(selected.type)) {
      setError("Invalid file type. Please upload PDF, Word, Excel, PowerPoint, or image files.");
      setFile(null);
      return;
    }

    if (selected.size > 50 * 1024 * 1024) {
      setError("File size exceeds 50MB limit.");
      setFile(null);
      return;
    }

    setError(null);
    setFile(selected);
  };

  const resetFile = () => {
    setFile(null);
    setError(null);
  };

  return (
    <div className="upload-page p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-black">Upload Training Report</h1>
          <p className="text-sm text-slate-500 mt-1">
            Add a new document to your training repository
          </p>
        </header>

        {/* Upload Area */}
        {!file && (
          <section className="upload-dropzone mb-6">
            <div className="border-dashed border-2 border-slate-200 rounded-lg bg-white p-12 text-center transition hover:border-blue-400">
              <div className="mx-auto inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-50 text-slate-600 mb-4">
                <FiUpload className="text-2xl" />
              </div>
              <h2 className="text-lg font-semibold text-black">Upload Training Report</h2>
              <p className="text-sm text-slate-500 mt-2">
                Drag and drop your training document here, or click to browse files
              </p>

              <div className="mt-6">
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("fileInput")?.click()}
                  className="h-10 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
                >
                  Choose File
                </button>
              </div>

              <p className="text-xs text-slate-400 mt-3">
                Supported formats: PDF, Word, Excel, PowerPoint, Images
                <br />
                Maximum file size: 50MB
              </p>

              {error && (
                <div className="mt-4 flex items-center justify-center text-red-600 text-sm gap-2">
                  <FiAlertCircle />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Tips Section */}
        {!file && (
          <section className="tips bg-white rounded-lg p-6 shadow-sm border border-slate-100">
            <h3 className="text-md font-semibold mb-4 text-black">
              Tips for Better Organization
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-slate-600">
              <div>
                <h4 className="font-medium text-slate-800 mb-2">File Naming</h4>
                <p>Use descriptive names like "Leadership-Workshop-Q1-2024" for easier searching.</p>
              </div>
              <div>
                <h4 className="font-medium text-slate-800 mb-2">Categories</h4>
                <p>Choose the most relevant category to help with filtering and organization.</p>
              </div>
              <div>
                <h4 className="font-medium text-slate-800 mb-2">Tags</h4>
                <p>Add relevant tags like "quarterly", "remote", "certification" for better searchability.</p>
              </div>
              <div>
                <h4 className="font-medium text-slate-800 mb-2">Details</h4>
                <p>Include instructor names, dates, and participant counts for complete documentation.</p>
              </div>
            </div>
          </section>
        )}

        {/* Show form when file uploaded */}
        {file && (
          <div className="mt-8">
            <AddListingModal uploadedFile={file} mode="inline" onClose={resetFile} />
          </div>
        )}
      </div>
    </div>
  );
}
