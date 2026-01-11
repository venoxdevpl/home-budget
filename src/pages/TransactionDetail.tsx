import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Calendar, DollarSign, Tag, FileText } from "lucide-react";
import { store } from "../flux/Store";
import { actions } from "../flux/actions";
import { Button } from "../components/Button";

export function TransactionDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [state, setState] = useState(store.getState());

    useEffect(() => {
        const handleChange = () => setState(store.getState());
        store.addChangeListener(handleChange);

        actions.fetchTransactions();
        actions.fetchCategories();

        return () => store.removeChangeListener(handleChange);
    }, []);

    const transaction = state.transactions.find((t) => t.id === id);

    const category = transaction
        ? state.categories.find((c) => c.id === transaction.categoryId)
        : undefined;

    if (state.loading.transactions) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Ładownie...</div>
            </div>
        );
    }

    if (!transaction) {
        return (
            <div className="max-w-2xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-700 font-medium mb-4">
                        Transakcja nie została znaleziona.
                    </p>
                    <Button onClick={() => navigate("/transactions")}>Wróć do listy</Button>
                </div>
            </div>
        );
    }

    const isIncome = category?.type === "income";

    return (
        <div className="max-w-2xl mx-auto p-6">
            <Button
                variant="secondary"
                onClick={() => navigate("/transactions")}
                className="mb-6 flex items-center gap-2"
            >
                <ArrowLeft size={18} /> Wróć do listy
            </Button>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div
                    className={`p-6 ${
                        isIncome
                            ? "bg-gradient-to-r from-green-50 to-green-100"
                            : "bg-gradient-to-r from-red-50 to-red-100"
                    }`}
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Szczegóły transakcji</h1>
                    <p
                        className={`text-4xl font-bold ${
                            isIncome ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {isIncome ? "+" : "-"}
                        {transaction.amount.toLocaleString("pl-PL", {
                            style: "currency",
                            currency: "PLN",
                        })}
                    </p>
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex-items-start gap-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <FileText className="text-blue-600" size={24} />
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-1">Opis</p>
                            <p className="text-lg font-medium text-gray-900">
                                {transaction.description}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-purple-50 rounded-lg">
                            <Calendar className="text-purple-600" size={24} />
                        </div>

                        <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-1">Data</p>
                            <p className="text-lg font-medium text-gray-900">
                                {new Date(transaction.date).toLocaleDateString("pl-PL", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="p-3 bg-orange-50 rounded-lg">
                            <DollarSign className="text-orange-600" size={24} />
                        </div>

                        <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-1">Kwota</p>
                            <p className="text-lg font-medium text-gray-900">
                                {transaction.amount.toLocaleString("pl-PL", {
                                    style: "currency",
                                    currency: "PLN",
                                })}
                            </p>
                        </div>
                    </div>

                    {category && (
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-teal-50 rounded-lg">
                                <Tag className="text-teal-600" size={24} />
                            </div>

                            <div className="flex-1">
                                <p className="text-sm text-gray-500 mb-1">Kategoria</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-lg font-medium text-gray-900">
                                        {category.name}
                                    </p>
                                    <span
                                        className={`px-3 py-1 text-sm rounded-full ${
                                            isIncome
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}
                                    >
                                        {isIncome ? "Przychód" : "Wydatek"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
