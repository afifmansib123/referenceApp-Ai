import { fileUploadSchema } from "@/lib/validations";

/**
 * Upload drawing file to backend
 */
export const uploadDrawing = async (
  file: File
): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> => {
  try {
    // Validate file
    const validation = fileUploadSchema.safeParse({ file, folder: "drawings" });
    if (!validation.success) {
      return {
        success: false,
        error: validation.error.errors[0]?.message || "Invalid file",
      };
    }

    // Create form data
    const formData = new FormData();
    formData.append("drawing", file);

    // Upload file
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/quotes/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: error.message || "Upload failed",
      };
    }

    const result = await response.json();
    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Unknown error during upload",
    };
  }
};

/**
 * Get file size in MB
 */
export const getFileSizeInMB = (bytes: number): number => {
  return Math.round((bytes / (1024 * 1024)) * 100) / 100;
};

/**
 * Format file size for display
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Check if file is supported format
 */
export const isSupportedFormat = (mimeType: string): boolean => {
  const supportedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "application/pdf",
    "image/tiff",
  ];
  return supportedTypes.includes(mimeType);
};

/**
 * Get file extension
 */
export const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || "";
};
