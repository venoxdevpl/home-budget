import { useState } from "react";
import PropTypes from "prop-types";
import { InputField } from "../InputField";
import { Button } from "../Button";
import { type Transaction, type Category } from "../../services/Api";

interface TransactionFormProps {
    transaction?: Transaction | null;
    categories: Category[];
    onSubmit: (data: {
        date: string;
        amount: number;
        description: string;
        categoryId: string;
    }) => void;
    onCancel: () => void;
}

export function TransactionForm({
    transaction,
    categories,
    onSubmit,
    onCancel,
}: TransactionFormProps) {
    const [date, setDate] = useState(transaction?.date || new Date().toISOString().split("T")[0]);
    const [amount, setAmount] = useState(transaction?.amount.toString() || "");
    const [description, setDescription] = useState(transaction?.description || "");
    const [categoryId, setCategoryId] = useState(transaction?.categoryId || "");
    const [errors, setErrors] = useState<{
        date?: string;
        amount?: string;
        description?: string;
        categoryId?: string;
    }>({});

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!date) {
            newErrors.date = "Data jest wymagana";
        } else if (new Date(date) > new Date()) {
            newErrors.date = "Data nie może być w przyszłości";
        }

        const amountNum = parseFloat(amount);
        if (!amount || isNaN(amountNum)) {
            newErrors.amount = "Kwota musi być liczbą";
        } else if (amountNum <= 0) {
            newErrors.amount = "Kwota musi być większa od 0";
        }

        if (description.trim().length < 5) {
            newErrors.description = "Opis musi mieć minimum 5 znaków";
        }

        if (!categoryId) {
            newErrors.categoryId = "Kategoria jest wymagana";
        } else if (!categories.find((c) => c.id === categoryId)) {
            newErrors.categoryId = "Wybrana kategoria nie istnieje";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({
                date,
                amount: parseFloat(amount),
                description: description.trim(),
                categoryId,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
                label="Data"
                type="date"
                value={date}
                onChange={setDate}
                error={errors.date}
                max={new Date().toISOString().split("T")[0]}
                required
            />

            <InputField
                label="Kwota (PLN)"
                type="number"
                value={amount}
                onChange={setAmount}
                error={errors.amount}
                placeholder="Np. 100.00"
                min="0.01"
                required
            />

            <InputField
                label="Opis"
                value={description}
                onChange={setDescription}
                error={errors.description}
                placeholder="Np. Zakupy spożywcze"
                required
            />

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategoria <span className="text-red-500">*</span>
                </label>
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all ${
                        errors.categoryId ? "border-red-500" : "border-gray-300"
                    }`}
                    required
                >
                    <option value="">Wybierz kategorię</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name} ({category.type === "income" ? "Przychód" : "Wydatek"})
                        </option>
                    ))}
                </select>
                {errors.categoryId && (
                    <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>
                )}
            </div>

            <div className="flex gap-3">
                <Button type="submit" variant="primary">
                    {transaction ? "Zapisz zmiany" : "Dodaj transakcję"}
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Anuluj
                </Button>
            </div>
        </form>
    );
}

TransactionForm.propTypes = {
    transaction: PropTypes.shape({
        id: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
        description: PropTypes.string.isRequired,
        categoryId: PropTypes.string.isRequired,
    }),
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            type: PropTypes.oneOf(["income", "expense"]).isRequired,
        }).isRequired,
    ).isRequired,
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};
