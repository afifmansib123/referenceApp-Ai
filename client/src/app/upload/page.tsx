"use client";

import React, { useState, useRef } from "react";
import { useUploadDrawingMutation } from "@/state/api";
import { useRouter } from "next/navigation";
import { Upload, AlertCircle, CheckCircle2, FileUp } from "lucide-react";
import { formatFileSize } from "@/lib/utils";

export default function UploadPage() {
  const [uploadDrawing, { isLoading }] = useUploadDrawingMutation();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles[0]) {
      setFile(droppedFiles[0]);
      setUploadStatus("idle");
      setErrorMessage("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files[0]) {
      setFile(files[0]);
      setUploadStatus("idle");
      setErrorMessage("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("Please select a file");
      return;
    }

    // Validate file
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setErrorMessage("File size must be less than 10MB");
      setUploadStatus("error");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "application/pdf",
      "image/tiff",
    ];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage("Only JPEG, PNG, PDF, and TIFF files are allowed");
      setUploadStatus("error");
      return;
    }

    try {
      setUploadStatus("uploading");
      const formData = new FormData();
      formData.append("drawing", file);

      const result = await uploadDrawing(formData).unwrap();

      setUploadStatus("success");
      setErrorMessage("");

      // Redirect to quotation page
      setTimeout(() => {
        router.push(`/quotation/${result.data.quoteId}`);
      }, 2000);
    } catch (error: any) {
      setUploadStatus("error");
      setErrorMessage(
        error?.data?.message || error.message || "Upload failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="container-custom py-6">
          <h1 className="text-3xl font-bold text-slate-900">
            Upload Engineering Drawing
          </h1>
          <p className="text-slate-600 mt-2">
            Upload your drawing to generate an automated quotation
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom py-12">
        <div className="max-w-2xl mx-auto">
          <div className="card">
            {/* Upload Area */}
            <div className="mb-8">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-primary-600 bg-primary-50"
                    : "border-slate-300 hover:border-primary-400"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.pdf,.tiff"
                />

                {!file ? (
                  <>
                    <Upload className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      Drop your drawing here
                    </h3>
                    <p className="text-slate-600 mb-4">
                      or click to browse from your computer
                    </p>
                    <p className="text-sm text-slate-500">
                      Supported: JPEG, PNG, PDF, TIFF (max 10MB)
                    </p>
                  </>
                ) : (
                  <>
                    <FileUp className="w-16 h-16 text-success-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                      {file.name}
                    </h3>
                    <p className="text-sm text-slate-600">
                      {formatFileSize(file.size)}
                    </p>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="text-primary-600 hover:text-primary-700 text-sm mt-4"
                    >
                      Change file
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Status Messages */}
            {uploadStatus === "error" && (
              <div className="mb-6 p-4 bg-danger-50 border border-danger-200 rounded-lg flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-danger-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-danger-900">Upload Error</h4>
                  <p className="text-sm text-danger-800 mt-1">{errorMessage}</p>
                </div>
              </div>
            )}

            {uploadStatus === "success" && (
              <div className="mb-6 p-4 bg-success-50 border border-success-200 rounded-lg flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-success-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-success-900">
                    Upload Successful
                  </h4>
                  <p className="text-sm text-success-800 mt-1">
                    Redirecting to quotation...
                  </p>
                </div>
              </div>
            )}

            {/* Upload Button */}
            <div className="flex gap-4">
              <button
                onClick={handleUpload}
                disabled={!file || isLoading}
                className={`flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed ${
                  isLoading ? "opacity-75" : ""
                }`}
              >
                {isLoading ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⟳</span>
                    Uploading...
                  </>
                ) : (
                  "Generate Quotation"
                )}
              </button>
            </div>

            {/* Info */}
            <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
              <h4 className="font-semibold text-slate-900 mb-2">
                How it works:
              </h4>
              <ol className="text-sm text-slate-700 space-y-2">
                <li>1. Upload your engineering drawing (JPEG, PNG, PDF, TIFF)</li>
                <li>2. Our AI analyzes the drawing dimensions and materials</li>
                <li>3. System calculates cost estimate based on specifications</li>
                <li>4. Market prices are analyzed for competitive pricing</li>
                <li>5. You receive a complete quotation with recommendations</li>
              </ol>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
