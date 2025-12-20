// User Types
export interface User {
  cognitoInfo: {
    signInDetails?: any;
    username: string;
    userId: string;
  };
  userInfo: {
    id: string;
    name: string;
    email: string;
    phoneNumber?: string;
    createdAt: string;
    updatedAt: string;
  };
  userRole: "user" | "creator" | "admin";
}

// Drawing Upload Types
export interface DrawingFile {
  id: string;
  filename: string;
  url: string;
  uploadedAt: string;
  size: number;
  mimeType: string;
}

// Quotation Types
export interface QuotationRequest {
  id: string;
  drawingUrl: string;
  filename: string;
  uploadedAt: string;
  status: "pending" | "processing" | "completed" | "failed";
  createdBy: string;
}

export interface QuotationResult {
  id: string;
  requestId: string;
  drawingAnalysis: {
    dimensions: string;
    material: string;
    complexity: string;
    notes: string;
  };
  costEstimate: {
    materialCost: number;
    laborCost: number;
    overheadCost: number;
    totalCost: number;
    currency: string;
  };
  marketPrice: {
    current: number;
    forecast: number;
    trend: "up" | "down" | "stable";
  };
  pricing: {
    recommendedPrice: number;
    minPrice: number;
    maxPrice: number;
    profitMargin: number;
  };
  generatedAt: string;
  aiModel: string;
  confidence: number;
}

export interface QuotationHistory {
  id: string;
  filename: string;
  uploadedAt: string;
  quotationResult: QuotationResult | null;
  status: "pending" | "completed" | "failed";
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  message?: string;
}

// S3 Upload Response
export interface S3UploadResponse {
  url: string;
  key: string;
  bucket: string;
  location: string;
}

// Error Response
export interface ErrorResponse {
  status: number;
  error: string;
  details?: Record<string, any>;
}
