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
    // ==================== QUOTE UPLOAD ENDPOINTS ====================

    uploadDrawing: build.mutation<
      ApiResponse<QuotationRequest>,
      FormData
    >({
      query: (formData) => ({
        url: "/quotes/upload",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Quote", "History"],
    }),

    uploadMultipleDrawings: build.mutation<
      ApiResponse<QuotationRequest[]>,
      FormData
    >({
      query: (formData) => ({
        url: "/quotes/batch",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Quote", "History"],
    }),

    // ==================== QUOTE ENDPOINTS ====================

    getQuote: build.query<ApiResponse<QuotationResult>, string>({
      query: (quoteId) => `/quotes/${quoteId}`,
      providesTags: (result, error, quoteId) => [
        { type: "Quote", id: quoteId },
      ],
    }),

    updateQuoteStatus: build.mutation<
      ApiResponse<void>,
      { quoteId: string; status: "reviewed" | "approved" | "rejected" | "finalized" }
    >({
      query: ({ quoteId, status }) => ({
        url: `/quotes/${quoteId}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { quoteId }) => [
        { type: "Quote", id: quoteId },
      ],
    }),

    getQuotes: build.query<
      PaginatedResponse<QuotationResult>,
      {
        page?: number;
        limit?: number;
        status?: string;
      }
    >({
      query: (params = {}) => ({
        url: "/quotes",
        params,
      }),
      providesTags: ["Quote"],
    }),

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
