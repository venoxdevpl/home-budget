import { Pencil, Trash2, Eye } from "lucide-react";
import { type Transaction, type Category } from "../../services/Api";

interface TransactionItemProps {
    transaction: Transaction;
    category?: Category;
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
    onView: (id: string) => void;
}

export function TransactionItem({
    transaction,
    category,
    onEdit,
    onDelete,
    onView,
}: TransactionItemProps) {
    const isIncome = category?.type === "income";

    return (
        <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                    {category && (
                        <span
                            className={`px-2 py-1 text-xs rounded-full ${
                                isIncome ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}
                        >
                            {category.name}
                        </span>
                    )}
                </div>

                <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString("pl-PL", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
            </div>

            <div className="flex items-center gap-4">
                <span
                    className={`text-xl font-bold ${isIncome ? "text-green-600" : "text-red-600"}`}
                >
                    {isIncome ? "+" : "-"}
                    {transaction.amount.toLocaleString("pl-PL", {
                        style: "currency",
                        currency: "PLN",
                    })}
                </span>

                <div className="flex gap-2">
                    <button
                        onClick={() => onView(transaction.id)}
                        className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                        aria-label="Zobacz szczegóły"
                    >
                        <Eye size={18} />
                    </button>
                    <button
                        onClick={() => onEdit(transaction)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        aria-label="Edytuj transakcję"
                    >
                        <Pencil size={18} />
                    </button>
                    <button
                        onClick={() => onDelete(transaction.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Usuń transakcję"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
