import { useEffect } from "react";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";

export default function Toast({ message, type, onClose } : { message: string; type: "success" | "error" | "warning"; onClose: () => void }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const config = {
        success: {
            icon: CheckCircle,
            bgColor: "bg-green-50 dark:bg-green-900/20",
            borderColor: "border-green-500",
            iconColor: "text-green-500",
            textColor: "text-green-800 dark:text-green-200",
        },
        error: {
            icon: XCircle,
            bgColor: "bg-red-50 dark:bg-red-900/20",
            borderColor: "border-red-500",
            iconColor: "text-red-500",
            textColor: "text-red-800 dark:text-red-200",
        },
        warning: {
            icon: AlertTriangle,
            bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
            borderColor: "border-yellow-500",
            iconColor: "text-yellow-500",
            textColor: "text-yellow-800 dark:text-yellow-200",
        },
    };

    const {
        icon: Icon,
        bgColor,
        borderColor,
        iconColor,
        textColor,
    } = config[type];

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div
                className={`${bgColor} ${textColor} px-6 py-4 rounded-xl shadow-2xl border-l-4 ${borderColor} backdrop-blur-sm min-w-[320px] max-w-md`}
            >
                <div className="flex items-start gap-3">
                    <Icon
                        className={`w-6 h-6 ${iconColor} flex-shrink-0 mt-0.5`}
                    />
                    <p className="flex-1 font-medium text-sm leading-relaxed">
                        {message}
                    </p>
                    <button
                        onClick={onClose}
                        className={`${iconColor} hover:opacity-70 transition-opacity flex-shrink-0`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
