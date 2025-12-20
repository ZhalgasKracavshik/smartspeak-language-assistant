import { Skeleton } from "@/components/ui/skeleton"

export function ChatSkeleton() {
    return (
        <div className="p-4 space-y-4">
            {/* Bot Message Skeleton */}
            <div className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex flex-col gap-2 w-full max-w-[80%]">
                    <Skeleton className="h-20 w-full rounded-2xl rounded-tl-none bg-gray-100" />
                    <Skeleton className="h-3 w-12 bg-gray-100" />
                </div>
            </div>

            {/* User Message Skeleton */}
            <div className="flex gap-3 flex-row-reverse">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex flex-col gap-2 w-full max-w-[80%] items-end">
                    <Skeleton className="h-12 w-2/3 rounded-2xl rounded-tr-none bg-blue-100" />
                    <Skeleton className="h-3 w-12 bg-gray-100" />
                </div>
            </div>

            {/* Bot Message Skeleton */}
            <div className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex flex-col gap-2 w-full max-w-[80%]">
                    <Skeleton className="h-16 w-3/4 rounded-2xl rounded-tl-none bg-gray-100" />
                    <Skeleton className="h-3 w-12 bg-gray-100" />
                </div>
            </div>
        </div>
    )
}
