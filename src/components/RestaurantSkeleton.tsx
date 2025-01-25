import React from "react";

/**
 * Loading skeleton for restaurant data
 */
export function RestaurantSkeleton(): JSX.Element {
  return (
    <div className="animate-pulse">
      <div className="h-48 bg-gray-200 rounded-lg"></div>
      <div className="mt-4 h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  );
} 