import { useState, useEffect, useMemo } from "react";
import { TrendingUp, TrendingDown, Wallet, PieChart } from "lucide-react";
import { store } from "~/flux/Store";
import { actions } from "~/flux/actions";
import { SummaryCard } from "~/components/SummaryCard";

export default function Dashboard() {
    const [state, setState] = useState(store.getState());

    useEffect(() => {
        const handleChange = () => setState(store.getState());
        store.addChangeListener(handleChange);

        actions.fetchTransactions();
        actions.fetchCategories();

        return () => store.removeChangeListener(handleChange);
    }, []);

    const availableMonths = useMemo(() => {
        const months = new Set<string>();

        state.transactions.forEach((t) => {
            months.add(t.date.slice(0, 7));
        });

        return Array.from(months).sort().reverse();
    }, [state.transactions]);

    const filteredTransactions = useMemo(() => {
        return state.transactions.filter((t) => t.date.startsWith(state.monthFilter));
    }, [state.transactions, state.monthFilter]);

    const summary = useMemo(() => {
        let income = 0;
        let expenses = 0;

        filteredTransactions.forEach((t) => {
            const category = state.categories.find((c) => c.id === t.categoryId);

            if (category?.type === "income") {
                income += t.amount;
            } else {
                expenses += t.amount;
            }
        });

        return { income, expenses, balance: income - expenses };
    }, [filteredTransactions, state.categories]);

    const categoryStats = useMemo(() => {
        const stats: {
            [key: string]: { name: string; amount: number; type: string };
        } = {};

        filteredTransactions.forEach((t) => {
            const category = state.categories.find((c) => c.id === t.categoryId);

            if (category) {
                if (!stats[category.id]) {
                    stats[category.id] = { name: category.name, amount: 0, type: category.type };
                }
                stats[category.id].amount += t.amount;
            }
        });

        return Object.values(stats).sort((a, b) => b.amount - a.amount);
    }, [filteredTransactions, state.categories]);

    const expenseStats = categoryStats.filter((s) => s.type === "expense");
    const totalExpenses = summary.expenses;

    const handleMonthChange = (month: string) => {
        actions.setMonthFilter(month);
    };

    const getMonthLabel = (monthStr: string) => {
        const [year, month] = monthStr.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1);
        return date.toLocaleDateString("pl-PL", { year: "numeric", month: "long" });
    };

    if (state.loading.transactions || state.loading.categories) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Ładowanie danych...</div>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-7xl mx-auto p-6 space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-bold text-gray-900">Panel główny</h1>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Filtr miesięczny
                        </label>
                        <select
                            value={state.monthFilter}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                handleMonthChange(e.target.value)
                            }
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        >
                            {availableMonths.length > 0 ? (
                                availableMonths.map((m) => (
                                    <option key={m} value={m}>
                                        {getMonthLabel(m)}
                                    </option>
                                ))
                            ) : (
                                <option value={state.monthFilter}>
                                    {getMonthLabel(state.monthFilter)}
                                </option>
                            )}
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SummaryCard
                    title="Przychody"
                    value={summary.income}
                    type="income"
                    icon={<TrendingUp size={24} />}
                />

                <SummaryCard
                    title="Wydatki"
                    value={summary.expenses}
                    type="expense"
                    icon={<TrendingDown size={24} />}
                />

                <SummaryCard
                    title="Bilans"
                    value={summary.balance}
                    type="balance"
                    icon={<Wallet size={24} />}
                />
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <PieChart className="text-blue-600" size={28} />
                    <h2 className="text-2xl font-bold text-gray-900">Statystyki kategorii</h2>
                </div>

                {expenseStats.length === 0 ? (
                    <p className="text-center text-gray-500 py-8">Brak wydatków w tym miesiącu</p>
                ) : (
                    <div className="space-y-4">
                        {expenseStats.map((stat) => {
                            const percentage =
                                totalExpenses > 0 ? (stat.amount / totalExpenses) * 100 : 0;
                            return (
                                <div key={stat.name} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-900">
                                            {stat.name}
                                        </span>
                                        <div className="text-right">
                                            <span className="font-bold text-gray-900">
                                                {stat.amount.toLocaleString("pl-PL", {
                                                    style: "currency",
                                                    currency: "PLN",
                                                })}
                                            </span>
                                            <span className="text-sm text-gray-500 ml-2">
                                                ({percentage.toFixed(1)}%)
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Podsumowanie {getMonthLabel(state.monthFilter)}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                        <p className="text-gray-600">Liczba transakcji</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {filteredTransactions.length}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600">Średni wydatek</p>
                        <p className="text-2xl font-bold text-gray-900">
                            {expenseStats.length > 0
                                ? (summary.expenses / expenseStats.length).toLocaleString("pl-PL", {
                                      style: "currency",
                                      currency: "PLN",
                                  })
                                : "0,00 zł"}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600">Liczba kategorii</p>
                        <p className="text-2xl font-bold text-gray-900">{categoryStats.length}</p>
                    </div>
                </div>
            </div>
        </>
    );
}
