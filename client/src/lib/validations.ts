import { z } from "zod";

// File Upload Schemas
export const fileUploadSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= 10 * 1024 * 1024, "File size must be less than 10MB")
    .refine(
      (file) =>
        [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "application/pdf",
          "image/tiff",
        ].includes(file.type),
      "Only JPEG, PNG, PDF, and TIFF files are allowed"
    ),
  folder: z.string().default("drawings"),
});

export type FileUploadInput = z.infer<typeof fileUploadSchema>;

// Quotation Request Schema
export const quotationRequestSchema = z.object({
  drawingUrl: z.string().url("Invalid drawing URL"),
  filename: z.string().min(1, "Filename is required"),
  uploadedAt: z.string().datetime("Invalid datetime"),
});

export type QuotationRequestInput = z.infer<typeof quotationRequestSchema>;

// User Profile Schema
export const userProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().optional(),
  company: z.string().optional(),
  position: z.string().optional(),
});

export type UserProfileInput = z.infer<typeof userProfileSchema>;

// Login Schema (for any manual login form)
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Search/Filter Schema
export const quotationFilterSchema = z.object({
  status: z.enum(["pending", "completed", "failed"]).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
});

export type QuotationFilterInput = z.infer<typeof quotationFilterSchema>;

// Cost Estimate Filter Schema
export const costFilterSchema = z.object({
  minCost: z.number().nonnegative().optional(),
  maxCost: z.number().nonnegative().optional(),
  material: z.string().optional(),
});

export type CostFilterInput = z.infer<typeof costFilterSchema>;
