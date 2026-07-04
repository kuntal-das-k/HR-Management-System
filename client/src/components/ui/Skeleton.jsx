// Skeleton loading placeholder components

export const SkeletonLine = ({ className = '' }) => (
  <div className={`skeleton h-4 rounded-lg ${className}`} />
);

export const SkeletonCard = () => (
  <div className="glass-card p-5 space-y-3">
    <div className="flex items-center gap-3">
      <div className="skeleton w-12 h-12 rounded-2xl" />
      <div className="flex-1 space-y-2">
        <SkeletonLine className="w-3/4" />
        <SkeletonLine className="w-1/2 h-3" />
      </div>
    </div>
    <SkeletonLine className="w-full" />
    <SkeletonLine className="w-5/6" />
  </div>
);

export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="glass-card overflow-hidden">
    <div className="bg-gray-50 dark:bg-slate-800 p-4 flex gap-4">
      {Array(cols).fill(0).map((_, i) => (
        <SkeletonLine key={i} className={`h-3 flex-1 ${i === 0 ? 'w-1/4' : ''}`} />
      ))}
    </div>
    <div className="divide-y divide-gray-100 dark:divide-slate-700">
      {Array(rows).fill(0).map((_, rowI) => (
        <div key={rowI} className="p-4 flex items-center gap-4">
          <div className="skeleton w-8 h-8 rounded-full flex-shrink-0" />
          {Array(cols - 1).fill(0).map((_, colI) => (
            <SkeletonLine key={colI} className={`flex-1 ${colI === 0 ? 'w-1/3' : 'w-1/4'}`} />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonStats = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array(4).fill(0).map((_, i) => (
      <div key={i} className="glass-card p-5 space-y-3">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <SkeletonLine className="w-1/2 h-3" />
            <SkeletonLine className="w-2/3 h-7" />
          </div>
          <div className="skeleton w-12 h-12 rounded-2xl" />
        </div>
      </div>
    ))}
  </div>
);
