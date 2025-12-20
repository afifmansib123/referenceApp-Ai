"use client";

import React from "react";
import { useGetQuotesQuery } from "@/state/api";
import { useRouter } from "next/navigation";
import { Upload, FileText, BarChart3, Clock } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: quotations, isLoading: quotationsLoading } = useGetQuotesQuery(
    { limit: 5 }
  );
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="container-custom py-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Manufacturing Quotation AI
            </h1>
            <p className="text-slate-600 mt-1">
              Automated quotation generation system
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom py-12">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Link href="/upload">
            <div className="card cursor-pointer hover:shadow-lg hover:border-primary-300 transition-all">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-primary-100 rounded-lg">
                  <Upload className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Upload Drawing</h3>
                  <p className="text-sm text-slate-600">Start new quotation</p>
                </div>
              </div>
            </div>
          </Link>

          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-success-100 rounded-lg">
                <FileText className="w-6 h-6 text-success-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  {quotations?.pagination?.total || 0}
                </h3>
                <p className="text-sm text-slate-600">Total Quotes</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-warning-100 rounded-lg">
                <Clock className="w-6 h-6 text-warning-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Processing</h3>
                <p className="text-sm text-slate-600">In progress</p>
              </div>
            </div>
          </div>

          <Link href="/history">
            <div className="card cursor-pointer hover:shadow-lg hover:border-primary-300 transition-all">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-secondary-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-secondary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">View History</h3>
                  <p className="text-sm text-slate-600">All quotations</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Quotes */}
        <div className="card">
          <h2 className="text-xl font-bold text-slate-900 mb-6">
            Recent Quotes
          </h2>

          {quotationsLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-slate-600">Loading quotes...</p>
            </div>
          ) : quotations?.data?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Quote ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Final Price
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Confidence
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {quotations.data.map((quote: any) => (
                    <tr
                      key={quote.quoteId}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-3 px-4 text-slate-900 font-mono text-sm">
                        {quote.quoteId?.substring(0, 8)}...
                      </td>
                      <td className="py-3 px-4">
                        <span className="badge badge-success">Completed</span>
                      </td>
                      <td className="py-3 px-4 text-slate-900 font-semibold">
                        ¥{quote.finalPrice?.toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {(quote.confidenceScore * 100).toFixed(0)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No quotes yet</p>
              <Link href="/upload">
                <button className="btn-primary mt-4">Create First Quote</button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
