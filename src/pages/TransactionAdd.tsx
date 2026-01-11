import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { store } from "../flux/Store";
import { actions } from "../flux/actions";
import { TransactionForm } from "../components/transactions/TransactionForm";

export default function TransactionAdd() {
    const navigate = useNavigate();
    const [state, setState] = useState(store.getState());

    useEffect(() => {
        const handleChange = () => setState(store.getState());
        store.addChangeListener(handleChange);
        actions.fetchCategories();
        return () => store.removeChangeListener(handleChange);
    }, []);

    const handleSubmit = async (data: {
        date: string;
        amount: number;
        description: string;
        categoryId: string;
    }) => {
        await actions.addTransaction(data);
        navigate("/transactions");
    };

    const handleCancel = () => {
        navigate("/transactions");
    };

    if (state.loading.categories) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Ładowanie kategorii...</div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dodaj nową transakcję</h1>
            <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                <TransactionForm
                    categories={state.categories}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}
