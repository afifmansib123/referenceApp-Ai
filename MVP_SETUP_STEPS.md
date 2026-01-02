# AI Manufacturing Quotation System - Complete MVP Setup Guide

## Overview
This is a full-stack AI-powered manufacturing quotation system with:
- **Frontend**: Next.js 14 + TypeScript + Redux Toolkit + TailwindCSS
- **Backend**: Express.js + MongoDB + TypeScript
- **AI**: Claude (Anthropic) & Gemini (Google) for drawing analysis
- **Features**: Upload engineering drawings, get AI-generated quotations with market adjustments

---

## Part 1: Frontend Setup (Next.js)

### Step 1: Create Next.js Application

```bash
npx create-next-app@latest client
```

When prompted:
- TypeScript? **Yes**
- ESLint? **Yes**
- Tailwind CSS? **Yes**
- `src/` directory? **Yes**
- App Router? **Yes**
- Import alias (@/*)? **Yes**

```bash
cd client
```

---

### Step 2: Install Frontend Dependencies

```bash
npm install @reduxjs/toolkit react-redux axios react-hook-form zod @hookform/resolvers class-variance-authority clsx tailwind-merge lucide-react aws-amplify @aws-amplify/ui-react
```

**Dependencies Breakdown:**
- **State Management**: `@reduxjs/toolkit`, `react-redux`
- **API Calls**: `axios`
- **Forms**: `react-hook-form`, `zod`, `@hookform/resolvers`
- **Styling**: `class-variance-authority`, `clsx`, `tailwind-merge`
- **Icons**: `lucide-react`
- **Auth (Optional)**: `aws-amplify`, `@aws-amplify/ui-react`

---

### Step 3: Configure TypeScript (tsconfig.json)

Update `client/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "preserve",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    },
    "allowJs": true,
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["src", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

### Step 4: Configure Next.js (next.config.js)

Create/update `client/next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID,
    NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID,
    NEXT_PUBLIC_AWS_COGNITO_DOMAIN: process.env.NEXT_PUBLIC_AWS_COGNITO_DOMAIN,
    NEXT_PUBLIC_AWS_REGION: process.env.NEXT_PUBLIC_AWS_REGION,
    NEXT_PUBLIC_AWS_S3_BUCKET: process.env.NEXT_PUBLIC_AWS_S3_BUCKET,
  },
};

export default nextConfig;
```

---

### Step 5: Configure Tailwind CSS

Update `client/tailwind.config.ts`:

```typescript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c3d66",
        },
        secondary: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
        },
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#145231",
        },
        warning: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        danger: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
      },
      spacing: {
        "128": "32rem",
        "144": "36rem",
      },
      borderRadius: {
        "4xl": "2rem",
      },
    },
  },
  plugins: [],
};
```

---

### Step 6: Update Global Styles

Update `client/src/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Global Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  @apply bg-slate-50 text-slate-900;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
    "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
    "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, "Courier New",
    monospace;
}

/* Utility Classes */
.container-custom {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.btn-base {
  @apply px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2;
}

.btn-primary {
  @apply btn-base bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500;
}

.btn-secondary {
  @apply btn-base bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-500;
}

.btn-danger {
  @apply btn-base bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500;
}

.input-base {
  @apply px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200;
}

.card {
  @apply bg-white rounded-lg shadow-sm border border-slate-200 p-6;
}

.badge {
  @apply inline-block px-3 py-1 rounded-full text-sm font-medium;
}

.badge-success {
  @apply badge bg-success-100 text-success-800;
}

.badge-warning {
  @apply badge bg-warning-100 text-warning-800;
}

.badge-danger {
  @apply badge bg-danger-100 text-danger-800;
}

.badge-info {
  @apply badge bg-primary-100 text-primary-800;
}

/* Loading Animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spinner {
  animation: spin 1s linear infinite;
}
```

---

### Step 7: Create Folder Structure

```bash
cd src

# Create all necessary directories
mkdir -p types state services lib utils app/upload app/quotation/[id] app/history
```

**Final structure:**
```
client/src/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Dashboard (home)
│   ├── upload/
│   │   └── page.tsx         # Upload page
│   ├── quotation/
│   │   └── [id]/
│   │       └── page.tsx     # Quotation detail page
│   └── history/
│       └── page.tsx         # History page
├── types/
│   └── index.ts             # TypeScript interfaces
├── state/
│   ├── api.ts               # RTK Query API
│   └── store.ts             # Redux store
├── services/
│   ├── drawing.service.ts   # Drawing upload service
│   └── auth.service.ts      # Auth service (optional)
├── lib/
│   ├── validations.ts       # Zod schemas
│   └── utils.ts             # Utility functions
├── utils/
│   └── helpers.ts           # Helper functions
└── globals.css              # Global styles
```

---

### Step 8: Create TypeScript Types

Create `client/src/types/index.ts`:

```typescript
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
```

---

### Step 9: Setup Redux Store

Create `client/src/state/store.ts`:

```typescript
import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

---

### Step 10: Setup RTK Query API

Create `client/src/state/api.ts`:

```typescript
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  QuotationRequest,
  QuotationResult,
  QuotationHistory,
  ApiResponse,
  PaginatedResponse,
} from "@/types";

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api",
    prepareHeaders: async (headers) => {
      try {
        const { fetchAuthSession } = await import("aws-amplify/auth");
        const session = await fetchAuthSession();
        const { idToken } = session.tokens ?? {};
        if (idToken) {
          headers.set("Authorization", `Bearer ${idToken.toString()}`);
        }
      } catch (error) {
        console.error("Failed to get auth session:", error);
      }
      return headers;
    },
  }),
  reducerPath: "api",
  tagTypes: ["Quote", "Upload", "History"],
  endpoints: (build) => ({
    // Upload single drawing
    uploadDrawing: build.mutation<ApiResponse<QuotationRequest>, FormData>({
      query: (formData) => ({
        url: "/quotes/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Quote", "History"],
    }),

    // Upload multiple drawings
    uploadMultipleDrawings: build.mutation<ApiResponse<QuotationRequest[]>, FormData>({
      query: (formData) => ({
        url: "/quotes/batch",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Quote", "History"],
    }),

    // Get single quote
    getQuote: build.query<ApiResponse<QuotationResult>, string>({
      query: (quoteId) => `/quotes/${quoteId}`,
      providesTags: (result, error, quoteId) => [{ type: "Quote", id: quoteId }],
    }),

    // Update quote status
    updateQuoteStatus: build.mutation<
      ApiResponse<void>,
      { quoteId: string; status: "reviewed" | "approved" | "rejected" | "finalized" }
    >({
      query: ({ quoteId, status }) => ({
        url: `/quotes/${quoteId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { quoteId }) => [{ type: "Quote", id: quoteId }],
    }),

    // Get all quotes
    getQuotes: build.query<
      PaginatedResponse<QuotationResult>,
      { page?: number; limit?: number; status?: string }
    >({
      query: (params = {}) => ({
        url: "/quotes",
        params,
      }),
      providesTags: ["Quote"],
    }),

    // Get quote history
    getQuoteHistory: build.query<
      PaginatedResponse<QuotationHistory>,
      { page?: number; limit?: number }
    >({
      query: (params = {}) => ({
        url: "/quotes",
        params,
      }),
      providesTags: ["History"],
    }),
  }),
});

export const {
  useUploadDrawingMutation,
  useUploadMultipleDrawingsMutation,
  useGetQuoteQuery,
  useUpdateQuoteStatusMutation,
  useGetQuotesQuery,
  useGetQuoteHistoryQuery,
} = api;
```

---

### Step 11: Create Services

Create `client/src/services/drawing.service.ts`:

```typescript
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001/api";

export const uploadDrawing = async (file: File) => {
  const formData = new FormData();
  formData.append("drawing", file);

  const response = await axios.post(`${API_BASE_URL}/quotes/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const uploadMultipleDrawings = async (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("drawings", file);
  });

  const response = await axios.post(`${API_BASE_URL}/quotes/batch`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
```

Create `client/src/services/auth.service.ts`:

```typescript
// Optional: AWS Cognito authentication
import { signIn, signOut, getCurrentUser, fetchAuthSession } from "aws-amplify/auth";

export const login = async (username: string, password: string) => {
  return await signIn({ username, password });
};

export const logout = async () => {
  return await signOut();
};

export const getUser = async () => {
  return await getCurrentUser();
};

export const getSession = async () => {
  return await fetchAuthSession();
};
```

---

### Step 12: Create Utilities

Create `client/src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

Create `client/src/lib/validations.ts`:

```typescript
import { z } from "zod";

export const drawingUploadSchema = z.object({
  drawing: z
    .instanceof(File)
    .refine((file) => file.size <= 50 * 1024 * 1024, "File size must be less than 50MB")
    .refine(
      (file) =>
        ["image/jpeg", "image/png", "application/pdf", "image/tiff"].includes(file.type),
      "File must be JPEG, PNG, PDF, or TIFF"
    ),
});

export type DrawingUploadInput = z.infer<typeof drawingUploadSchema>;
```

Create `client/src/utils/helpers.ts`:

```typescript
export const formatCurrency = (amount: number, currency: string = "USD"): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
};

export const truncateFilename = (filename: string, maxLength: number = 30): string => {
  if (filename.length <= maxLength) return filename;
  const ext = filename.split(".").pop();
  const name = filename.substring(0, maxLength - ext!.length - 4);
  return `${name}...${ext}`;
};
```

---

### Step 13: Create Environment Variables

Create `client/.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api

# AWS Cognito (Optional - for authentication)
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=your_pool_id
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID=your_client_id
NEXT_PUBLIC_AWS_COGNITO_DOMAIN=your_domain
NEXT_PUBLIC_AWS_REGION=us-east-1

# AWS S3 (Optional - for file storage)
NEXT_PUBLIC_AWS_S3_BUCKET=your_bucket_name
```

Create `client/.env.local.example`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api
```

---

## Part 2: Backend Setup (Express + MongoDB)

### Step 1: Create Server Directory

```bash
# Go back to root
cd ../..

# Create server directory
mkdir server
cd server
```

---

### Step 2: Initialize Node.js Project

```bash
npm init -y
```

Update `package.json`:

```json
{
  "name": "ai-quotation-server",
  "version": "1.0.0",
  "description": "AI Manufacturing Quotation System Backend",
  "main": "dist/index.js",
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src --ext .ts"
  }
}
```

---

### Step 3: Install Backend Dependencies

```bash
npm install express cors dotenv mongoose multer axios sharp uuid bull redis zod @anthropic-ai/sdk @google/generative-ai
```

```bash
npm install -D typescript @types/node @types/express @types/cors @types/multer @types/uuid tsx eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

**Dependencies Breakdown:**
- **Server**: `express`, `cors`, `dotenv`
- **Database**: `mongoose`
- **File Upload**: `multer`, `sharp`
- **AI SDKs**: `@anthropic-ai/sdk`, `@google/generative-ai`
- **Job Queue**: `bull`, `redis`
- **Validation**: `zod`
- **Utilities**: `axios`, `uuid`

---

### Step 4: Configure TypeScript

Create `server/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

---

### Step 5: Create Folder Structure

```bash
mkdir -p src/models src/routes src/services uploads
```

**Final structure:**
```
server/
├── src/
│   ├── index.ts              # Server entry point
│   ├── models/
│   │   └── schemas.ts        # MongoDB schemas
│   ├── routes/
│   │   └── quotes.routes.ts  # API routes
│   └── services/
│       ├── claude.service.ts # Claude AI service
│       ├── gemini.service.ts # Gemini AI service
│       ├── quote.service.ts  # Quote generation logic
│       └── market.service.ts # Market data service
├── uploads/                   # File uploads directory
├── package.json
├── tsconfig.json
└── .env
```

---

### Step 6: Create MongoDB Schemas

Create `server/src/models/schemas.ts`:

```typescript
import mongoose from 'mongoose';

// Drawing Schema
export const drawingSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    auto: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileType: {
    type: String,
    enum: ['pdf', 'image', 'cad'],
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['uploaded', 'processing', 'analyzed', 'failed'],
    default: 'uploaded'
  },
  extractedSpecs: {
    material: String,
    materialQuantity: Number,
    materialUnit: String,
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: String
    },
    manufacturingProcess: [String],
    complexity: Number,
    specialRequirements: [String],
    confidence: Number
  },
  processingTime: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Quote Schema
export const quoteSchema = new mongoose.Schema({
  quoteId: {
    type: String,
    required: true,
    unique: true
  },
  drawingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Drawing',
    required: true
  },
  baseCost: {
    type: Number,
    required: true
  },
  materialCost: Number,
  laborCost: Number,
  overheadCost: Number,
  marketAdjustment: {
    factor: Number,
    reason: String,
    dataSource: String
  },
  finalPrice: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 100
  },
  breakdown: {
    material: {
      description: String,
      quantity: Number,
      unitCost: Number,
      totalCost: Number
    },
    labor: {
      hours: Number,
      hourlyRate: Number,
      totalCost: Number
    },
    overhead: {
      percentage: Number,
      totalCost: Number
    }
  },
  status: {
    type: String,
    enum: ['generated', 'reviewed', 'approved', 'rejected', 'finalized'],
    default: 'generated'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create models
export const Drawing = mongoose.model('Drawing', drawingSchema);
export const Quote = mongoose.model('Quote', quoteSchema);
```

---

### Step 7: Create Server Entry Point

Create `server/src/index.ts`:

```typescript
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import quotesRouter from './routes/quotes.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-quotation';

// Create uploads directory
const uploadDir = process.env.UPLOAD_DIR || './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log(`✓ Created uploads directory: ${uploadDir}`);
}

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use('/api/quotes', quotesRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
  });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Error Handler]', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    console.log('[MongoDB] Connecting to:', MONGODB_URI);
    await mongoose.connect(MONGODB_URI, {
      retryWrites: true,
      w: 'majority',
    });
    console.log('✓ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`
╔════════════════════════════════════════════════╗
║   AI Manufacturing Quotation System             ║
║   Server running on port ${PORT}
║   Database: MongoDB
╚════════════════════════════════════════════════╝

Available endpoints:
  POST   /api/quotes/upload          - Upload drawing
  GET    /api/quotes/:quoteId        - Get quote
  PUT    /api/quotes/:quoteId/status - Update status
  POST   /api/quotes/batch           - Batch upload
  GET    /health                     - Health check
      `);
    });
  } catch (error) {
    console.error('[Fatal Error]', error);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  console.log('\n[Server] Shutting down...');
  await mongoose.disconnect();
  process.exit(0);
});

startServer();

export default app;
```

---

### Step 8: Create Environment Variables

Create `server/.env`:

```env
# Server Configuration
PORT=5001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/ai-quotation

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800

# AI API Keys
ANTHROPIC_API_KEY=your_claude_api_key_here
GOOGLE_API_KEY=your_gemini_api_key_here

# Redis (for job queues)
REDIS_HOST=localhost
REDIS_PORT=6379

# Market Data API (optional)
MARKET_DATA_API_KEY=your_market_api_key_here
```

Create `server/.env.example`:

```env
PORT=5001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/ai-quotation
UPLOAD_DIR=./uploads
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=
```

---

### Step 9: Create Routes (Placeholder)

Create `server/src/routes/quotes.routes.ts`:

```typescript
import express from 'express';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || './uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|tiff/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, PDF, and TIFF allowed.'));
    }
  }
});

// POST /api/quotes/upload - Upload single drawing
router.post('/upload', upload.single('drawing'), async (req, res) => {
  try {
    // TODO: Implement quote generation logic
    res.json({
      success: true,
      message: 'Drawing uploaded successfully',
      data: {
        filename: req.file?.filename,
        path: req.file?.path,
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// POST /api/quotes/batch - Upload multiple drawings
router.post('/batch', upload.array('drawings', 10), async (req, res) => {
  try {
    // TODO: Implement batch processing
    res.json({
      success: true,
      message: 'Drawings uploaded successfully',
      data: req.files,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/quotes/:quoteId - Get quote by ID
router.get('/:quoteId', async (req, res) => {
  try {
    // TODO: Fetch quote from database
    res.json({
      success: true,
      data: {},
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// PUT /api/quotes/:quoteId/status - Update quote status
router.put('/:quoteId/status', async (req, res) => {
  try {
    // TODO: Update quote status
    res.json({
      success: true,
      message: 'Status updated',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// GET /api/quotes - List all quotes
router.get('/', async (req, res) => {
  try {
    // TODO: List quotes with pagination
    res.json({
      success: true,
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
```

---

## Part 3: Database Setup

### Step 1: Install MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Windows:**
Download from https://www.mongodb.com/try/download/community

---

### Step 2: Verify MongoDB

```bash
mongosh
```

```javascript
// In MongoDB shell
use ai-quotation
db.quotes.find()
```

---

## Part 4: Running the Application

### Step 1: Start MongoDB

```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

---

### Step 2: Start Backend Server

```bash
cd server
npm run dev
```

Expected output:
```
✓ MongoDB connected
Server running on port 5001
```

---

### Step 3: Start Frontend

```bash
cd client
npm run dev
```

Expected output:
```
> Local:        http://localhost:3000
```

---

### Step 4: Test the Connection

Open browser:
- Frontend: http://localhost:3000
- Backend health: http://localhost:5001/health

---

## Part 5: Project Structure Summary

```
referenceApp-Ai/
├── client/                          # Next.js Frontend
│   ├── src/
│   │   ├── app/                     # Next.js App Router pages
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx             # Dashboard
│   │   │   ├── upload/page.tsx
│   │   │   ├── quotation/[id]/page.tsx
│   │   │   └── history/page.tsx
│   │   ├── types/index.ts           # TypeScript types
│   │   ├── state/
│   │   │   ├── api.ts               # RTK Query
│   │   │   └── store.ts             # Redux store
│   │   ├── services/
│   │   │   ├── drawing.service.ts
│   │   │   └── auth.service.ts
│   │   ├── lib/
│   │   │   ├── validations.ts       # Zod schemas
│   │   │   └── utils.ts
│   │   ├── utils/helpers.ts
│   │   └── globals.css
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── .env.local
│
├── server/                          # Express Backend
│   ├── src/
│   │   ├── index.ts                 # Server entry
│   │   ├── models/schemas.ts        # MongoDB schemas
│   │   ├── routes/quotes.routes.ts  # API routes
│   │   └── services/                # Business logic
│   │       ├── claude.service.ts
│   │       ├── gemini.service.ts
│   │       ├── quote.service.ts
│   │       └── market.service.ts
│   ├── uploads/                     # Uploaded files
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
└── README.md
```

---

## Part 6: Key Features to Implement

### Frontend Features
1. **Dashboard** - Show stats and recent quotes
2. **Upload Page** - Drag-and-drop file upload with validation
3. **Quotation Detail** - Display AI-generated quote with breakdown
4. **History** - List all quotes with search and pagination

### Backend Features
1. **File Upload** - Multer configuration for drawings
2. **AI Integration** - Claude/Gemini for drawing analysis
3. **Quote Generation** - Calculate costs based on AI analysis
4. **Market Adjustment** - Fetch commodity prices and adjust quotes
5. **Database Operations** - CRUD for quotes and drawings

---

## Part 7: Next Steps

1. **Implement AI Services** (claude.service.ts, gemini.service.ts)
2. **Build Quote Generation Logic** (quote.service.ts)
3. **Create Frontend Pages** (Dashboard, Upload, Quotation Detail, History)
4. **Add Authentication** (AWS Cognito or custom)
5. **Implement Market Data Integration**
6. **Add Error Handling & Logging**
7. **Write Tests**
8. **Deploy to Production**

---

## Technology Stack Summary

**Frontend:**
- Next.js 14 (App Router)
- TypeScript
- Redux Toolkit + RTK Query
- TailwindCSS
- React Hook Form + Zod
- Axios
- Lucide React (icons)

**Backend:**
- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Multer (file uploads)
- Claude AI (Anthropic)
- Gemini AI (Google)
- Bull + Redis (job queues)

**Database:**
- MongoDB

**DevOps:**
- Docker (optional)
- AWS (Cognito, S3)

---

## Quick Reference Commands

```bash
# Frontend
cd client
npm install
npm run dev

# Backend
cd server
npm install
npm run dev

# Database
mongosh
use ai-quotation
db.quotes.find()

# Build for production
cd client && npm run build
cd server && npm run build
```

---

## Environment Variables Checklist

**Frontend (.env.local):**
- ✅ NEXT_PUBLIC_API_BASE_URL

**Backend (.env):**
- ✅ PORT
- ✅ MONGODB_URI
- ✅ ANTHROPIC_API_KEY
- ✅ GOOGLE_API_KEY
- ✅ CORS_ORIGIN

---

This MVP setup guide provides the complete foundation for your AI Manufacturing Quotation System. Follow these steps sequentially to recreate the application from scratch!
