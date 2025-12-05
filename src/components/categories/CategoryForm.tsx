import { useState } from "react";
import PropTypes from "prop-types";
import { InputField } from "../InputField";
import { Button } from "../Button";
import { type Category } from "../../services/Api";

interface CategoryFormProps {
    category?: Category | null;
    onSubmit: (data: { name: string; type: "income" | "expense" }) => void;
    onCancel: () => void;
}

export function CategoryForm({ category, onSubmit, onCancel }: CategoryFormProps) {
    const [name, setName] = useState(category?.name ?? "");
    const [type, setType] = useState<"income" | "expense">(category?.type ?? "income");
    const [errors, setErrors] = useState<{ name?: string; type?: string }>({});

    const validateForm = () => {
        const newErrors: { name?: string } = {};

        if (name.trim().length < 3) {
            newErrors.name = "Nazwa musi mieć minimum 3 znaki.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validateForm()) {
            onSubmit({ name: name.trim(), type });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
                label="Nazwa kategorii"
                value={name}
                onChange={setName}
                error={errors.name}
                placeholder="Np. Jedzenie, Rachunki"
                required={true}
            />

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Typ <span className="text-red-500">*</span>
                </label>

                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            value="expense"
                            checked={type === "expense"}
                            onChange={() => setType("expense")}
                            className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">Wydatek</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            value="income"
                            checked={type === "income"}
                            onChange={() => setType("income")}
                            className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-gray-700">Przychód</span>
                    </label>
                </div>
            </div>

            <div className="flex gap-3">
                <Button type="submit" variant="primary">
                    {category ? "Zapisz zmiany" : "Dodaj kategorię"}
                </Button>
                <Button type="button" variant="secondary" onClick={onCancel}>
                    Anuluj
                </Button>
            </div>
        </form>
    );
}

CategoryForm.propTypes = {
    category: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.oneOf(["income", "expense"]).isRequired,
    }),
    onSubmit: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};
