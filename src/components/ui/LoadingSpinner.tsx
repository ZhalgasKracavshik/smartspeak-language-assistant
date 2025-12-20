
import { RefreshCw } from "lucide-react";

export default function LoadingSpinner({ className = "", size = "md" }: { className?: string, size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "w-4 h-4",
        md: "w-8 h-8",
        lg: "w-12 h-12"
    };

    return (
        <div className={`flex justify-center items-center ${className}`}>
            <RefreshCw className={`${sizeClasses[size]} animate-spin text-blue-600`} />
        </div>
    );
}
