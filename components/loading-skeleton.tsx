"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Report Summary Skeleton */}
      <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="h-6 w-48 bg-slate-700 rounded animate-pulse"></div>
            <div className="h-4 w-4 bg-slate-700 rounded animate-pulse"></div>
          </div>
          <div className="h-4 w-32 bg-slate-700 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 bg-slate-700/30 rounded-lg animate-pulse">
                <div className="h-6 w-16 bg-slate-600 rounded mb-2"></div>
                <div className="h-4 w-20 bg-slate-600 rounded"></div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div className="h-4 w-32 bg-slate-700 rounded animate-pulse"></div>
            <div className="h-6 w-20 bg-slate-700 rounded animate-pulse"></div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Skeleton */}
      <div className="space-y-4">
        <div className="flex space-x-1 bg-slate-800/50 p-1 rounded-lg">
          <div className="h-10 w-32 bg-slate-700 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-slate-700 rounded animate-pulse"></div>
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <div className="h-5 w-40 bg-slate-700 rounded animate-pulse"></div>
                <div className="h-4 w-60 bg-slate-700 rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-slate-700/30 rounded animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
