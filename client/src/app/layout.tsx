"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/state/store";
import "@/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>AI Manufacturing Quotation System</title>
        <meta
          name="description"
          content="Automated manufacturing quotation system powered by AI"
        />
      </head>
      <body>
        <Provider store={store}>
          <div className="min-h-screen bg-slate-50">
            {children}
          </div>
        </Provider>
      </body>
    </html>
  );
}
