"use client";

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className = "", style }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse bg-gray-200 rounded ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

export function PriceCardSkeleton() {
  return (
    <div className="card p-6">
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-40" />
        </div>
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-6 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-5 w-32 mb-2" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-10 w-40 rounded-lg" />
      </div>
      <Skeleton className="w-full rounded-lg" style={{ height }} />
      <div className="mt-6 grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <Skeleton className="h-3 w-16 mb-2" />
            <Skeleton className="h-5 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-32 flex-1" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ArticleCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <div className="p-6">
        <Skeleton className="h-4 w-32 mb-3" />
        <Skeleton className="h-6 w-full mb-2" />
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}

export function CalculatorSkeleton() {
  return (
    <div className="card p-6">
      <Skeleton className="h-6 w-40 mb-6" />
      <div className="space-y-4">
        <div>
          <Skeleton className="h-4 w-20 mb-2" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div>
          <Skeleton className="h-4 w-28 mb-2" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg mt-6" />
      </div>
    </div>
  );
}
