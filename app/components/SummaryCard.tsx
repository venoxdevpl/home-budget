import PropTypes from "prop-types";

interface SummaryCardProps {
    title: string;
    value: number;
    type?: "income" | "expense" | "balance";
    icon?: React.ReactNode;
}

export function SummaryCard({ title, value, type = "balance", icon }: SummaryCardProps) {
    const colorStyles = {
        income: "bg-green-50 border-green-200",
        expense: "bg-red-50 border-red-200",
        balance: "bg-blue-50 border-blue-200",
    };

    const textColorStyles = {
        income: "text-green-700",
        expense: "text-red-700",
        balance: "text-blue-700",
    };

    const valueColorStyles = {
        income: "text-green-900",
        expense: "text-red-900",
        balance: value >= 0 ? "text-green-900" : "text-red-900",
    };

    return (
        <div
            className={`p-6 rounded-xl border-2 ${colorStyles[type]} transition-all hover:shadow-lg`}
        >
            <div className="flex flex-items-center justify-between mb-2">
                <h3 className={`text-sm font-medium ${textColorStyles[type]}`}>{title}</h3>
                {icon && <div className={textColorStyles[type]}>{icon}</div>}
            </div>

            <p className={`text-3xl font-bold ${valueColorStyles[type]}`}>
                {value.toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}
            </p>
        </div>
    );
}

SummaryCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    type: PropTypes.oneOf(["income", "expense", "balance"]),
    icon: PropTypes.node,
};
