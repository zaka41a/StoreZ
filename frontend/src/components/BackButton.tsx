import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function BackButton({
                                       to,
                                       label = "Back",
                                       className = "",
                                   }: { to?: string; label?: string; className?: string }) {
    const navigate = useNavigate();
    const go = () => (to ? navigate(to) : navigate(-1));

    return (
        <button
            onClick={go}
            className={
                "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 " +
                "text-sm font-semibold text-gray-700 border-gray-300 hover:bg-gray-50 " +
                "active:scale-[.98] transition " + className
            }
        >
            <ArrowLeft className="w-4 h-4" />
            {label}
        </button>
    );
}
