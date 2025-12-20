"use client";

import React, { useState } from "react";
import { useGetQuoteHistoryQuery } from "@/state/api";
import { FileText, Search, ChevronRight } from "lucide-react";
import { formatDate } from "@/utils/helpers";
import Link from "next/link";

export default function HistoryPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: history, isLoading } = useGetQuoteHistoryQuery({ 
    page, 
    limit: 10 
  });

  const filteredHistory = history?.data?.filter((item: any) =>
    item.quoteId?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="container-custom py-6">
          <h1 className="text-3xl font-bold text-slate-900">Quote History</h1>
          <p className="text-slate-600 mt-2">
            View and manage all your generated quotations
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-custom py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search quotes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-base w-full pl-12"
            />
          </div>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-slate-600">Loading quotes...</p>
            </div>
          ) : filteredHistory.length > 0 ? (
            filteredHistory.map((item: any) => (
              <Link href={`/quotation/${item.quoteId}`} key={item.quoteId}>
                <div className="card hover:shadow-lg hover:border-primary-300 transition-all cursor-pointer">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="p-3 bg-primary-100 rounded-lg">
                        <FileText className="w-6 h-6 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 font-mono text-sm">
                          {item.quoteId}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-semibold text-slate-900">
                        ¥{item.finalPrice?.toLocaleString()}
                      </p>
                      <span className="badge badge-success mt-2 text-xs">
                        Completed
                      </span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="card text-center py-12">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">No quotes found</p>
              <Link href="/upload">
                <button className="btn-primary mt-4">Create New Quote</button>
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {history && history.pagination && history.pagination.pages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn-secondary disabled:opacity-50"
            >
              Previous
            </button>
            <div className="flex items-center gap-2">
              {Array.from({ length: history.pagination.pages }).map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    page === i + 1
                      ? "bg-primary-600 text-white"
                      : "bg-white text-slate-900 border border-slate-200 hover:border-primary-300"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage(Math.min(history.pagination.pages, page + 1))}
              disabled={page === history.pagination.pages}
              className="btn-secondary disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
