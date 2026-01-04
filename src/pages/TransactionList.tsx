import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Plus, ArrowUpDown } from "lucide-react";
import { store } from "../flux/Store";
import { actions } from "../flux/actions";
import { TransactionItem } from "../components/transactions/TransactionItem";
import { TransactionForm } from "../components/transactions/TransactionForm";
import { Button } from "../components/Button";
import { type Transaction } from "../services/Api";

type SortType = "date-desc" | "date-asc" | "amount-desc" | "amount-asc";

export function TransactionList() {
    const navigate = useNavigate();
    const [state, setState] = useState(store.getState());
    const [showForm, setShowForm] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [sortType, setSortType] = useState<SortType>("date-desc");

    useEffect(() => {
        const handleChange = () => setState(store.getState());
        store.addChangeListener(handleChange);
        actions.fetchTransactions();
        actions.fetchCategories();
        return () => store.removeChangeListener(handleChange);
    }, []);

    const handleAdd = () => {
        navigate("/transactions/add");
    };

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setShowForm(true);
    };

    const handleSubmit = async (data: {
        date: string;
        amount: number;
        description: string;
        categoryId: string;
    }) => {
        if (editingTransaction) {
            await actions.editTransaction(editingTransaction.id, data);
        } else {
            await actions.addTransaction(data);
        }
        setShowForm(false);
        setEditingTransaction(null);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Czy na pewno chcesz usunąć tę transakcję?")) {
            await actions.deleteTransaction(id);
        }
    };

    const handleView = (id: string) => {
        navigate(`/transactions/${id}`);
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingTransaction(null);
    };

    const cycleSortType = () => {
        const cycle: SortType[] = ["date-desc", "date-asc", "amount-desc", "amount-asc"];
        const currentIndex = cycle.indexOf(sortType);
        setSortType(cycle[(currentIndex + 1) % cycle.length]);
    };

    const getSortLabel = () => {
        const labels = {
            "date-desc": "Data: najnowsze",
            "date-asc": "Data: najstarsze",
            "amount-desc": "Kwota: największa",
            "amount-asc": "Kwota: najmniejsza",
        };
        return labels[sortType];
    };

    const sortedTransactions = [...state.transactions].sort((a, b) => {
        switch (sortType) {
            case "date-desc":
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            case "date-asc":
                return new Date(a.date).getTime() - new Date(b.date).getTime();
            case "amount-desc":
                return b.amount - a.amount;
            case "amount-asc":
                return a.amount - b.amount;
            default:
                return 0;
        }
    });

    if (state.loading.transactions) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Ładowanie transakcji...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Transakcje</h1>
                <div className="flex gap-3">
                    <Button
                        onClick={cycleSortType}
                        variant="secondary"
                        className="flex items-center gap-2"
                    >
                        <ArrowUpDown size={18} />
                        {getSortLabel()}
                    </Button>
                    <Button onClick={handleAdd} className="flex items-center gap-2">
                        <Plus size={18} />
                        Dodaj transakcję
                    </Button>
                </div>
            </div>

            {showForm && (
                <div className="mb-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingTransaction ? "Edytuj transakcję" : "Nowa transakcja"}
                    </h2>
                    <TransactionForm
                        transaction={editingTransaction}
                        categories={state.categories}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </div>
            )}

            <div className="space-y-3">
                {sortedTransactions.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        Brak transakcji. Dodaj pierwszą transakcję!
                    </div>
                ) : (
                    sortedTransactions.map((transaction) => (
                        <TransactionItem
                            key={transaction.id}
                            transaction={transaction}
                            category={state.categories.find((c) => c.id === transaction.categoryId)}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onView={handleView}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
