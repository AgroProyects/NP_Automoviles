'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';

export function VehicleCardSkeleton() {
  return (
    <Card className="overflow-hidden animate-pulse border-0 bg-white">
      <div className="relative aspect-[4/3] w-full bg-gray-200" />

      <CardContent className="p-5">
        <div className="h-7 bg-gray-200 rounded-lg mb-4 w-3/4" />

        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-14 bg-gray-100 rounded-lg" />
          ))}
        </div>

        <div className="h-20 bg-gray-100 rounded-xl" />
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <div className="w-full h-11 bg-gray-200 rounded-lg" />
      </CardFooter>
    </Card>
  );
}

export function VehicleGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <VehicleCardSkeleton key={i} />
      ))}
    </div>
  );
}
