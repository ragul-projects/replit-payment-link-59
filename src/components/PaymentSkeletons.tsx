import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function PaymentFormSkeleton() {
  return (
    <Card className="card-payment">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-muted/50 rounded-full w-fit">
          <Skeleton className="h-6 w-6" />
        </div>
        <Skeleton className="h-8 w-48 mx-auto mb-2" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-56" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-12 w-full" />
        <div className="space-y-1">
          <Skeleton className="h-3 w-64 mx-auto" />
          <Skeleton className="h-3 w-72 mx-auto" />
        </div>
      </CardContent>
    </Card>
  );
}

export function PaymentDisplaySkeleton() {
  return (
    <Card className="card-payment">
      <CardContent className="p-8 space-y-6">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
        
        <div className="flex justify-center">
          <Skeleton className="h-48 w-48 rounded-xl" />
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}

export function StatusCheckerSkeleton() {
  return (
    <Card className="card-payment">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-muted/50 rounded-full w-fit">
          <Skeleton className="h-6 w-6" />
        </div>
        <Skeleton className="h-8 w-40 mx-auto mb-2" />
        <Skeleton className="h-4 w-64 mx-auto" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  );
}