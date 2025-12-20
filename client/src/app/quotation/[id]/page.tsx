"use client";

import React from "react";
import { useGetQuoteQuery } from "@/state/api";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, AlertCircle } from "lucide-react";
import { formatCurrency, formatDate } from "@/utils/helpers";

export default function QuotationPage() {
  const params = useParams();
  const router = useRouter();
  const quoteId = params.id as string;

  const { data: quoteData, isLoading, error } = useGetQuoteQuery(quoteId, {
    skip: !quoteId,
  });

  const quote = quoteData?.data;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-slate-600">Loading quotation...</p>
        </div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="card max-w-md w-full mx-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-6 h-6 text-danger-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-danger-900">Error Loading Quote</h2>
              <p className="text-sm text-danger-800 mt-2">
                The quotation could not be loaded. Please try again.
              </p>
              <button
                onClick={() => router.back()}
                className="btn-primary mt-4 w-full"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  Quotation Details
                </h1>
                <p className="text-slate-600 mt-1">ID: {quote.quoteId}</p>
              </div>
            </div>
            <button className="btn-primary">
              <Download className="w-4 h-4 inline mr-2" />
              Export PDF
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cost Breakdown */}
            <div className="card">
              <h2 className="text-xl font-bold text-slate-900 mb-6">
                Cost Breakdown
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-700">Base Cost</span>
                  <span className="font-semibold text-slate-900">
                    ¥{quote.baseCost?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-slate-200">
                  <span className="text-slate-700">Market Adjustment</span>
                  <span className="font-semibold text-slate-900">
                    ¥{quote.marketAdjustment?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-4 bg-primary-50 px-4 py-3 rounded-lg">
                  <span className="font-semibold text-slate-900">
                    Final Price
                  </span>
                  <span className="text-lg font-bold text-primary-600">
                    ¥{quote.finalPrice?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Extracted Specs */}
            {quote.extractedSpecs && (
              <div className="card">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Extracted Specifications
                </h2>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">
                    {JSON.stringify(quote.extractedSpecs, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {/* Breakdown */}
            {quote.breakdown && (
              <div className="card">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  Detailed Breakdown
                </h2>
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                  <pre className="text-sm text-slate-700 whitespace-pre-wrap font-mono">
                    {JSON.stringify(quote.breakdown, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Summary */}
            <div className="card">
              <h3 className="font-semibold text-slate-900 mb-4">Summary</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-600">Quote ID</p>
                  <p className="text-slate-900 font-mono text-xs break-all">
                    {quote.quoteId}
                  </p>
                </div>
                <div>
                  <p className="text-slate-600">Confidence Score</p>
                  <p className="text-slate-900 font-semibold">
                    {(quote.confidenceScore * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-slate-600">Generated At</p>
                  <p className="text-slate-900">
                    {new Date().toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Analysis */}
            {quote.analysis && (
              <div className="card">
                <h3 className="font-semibold text-slate-900 mb-4">Analysis</h3>
                <div className="text-sm text-slate-700 space-y-2">
                  <p>{quote.analysis}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
