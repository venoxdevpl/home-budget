import { useState, useEffect } from "react";
import { Plus, ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import { store } from "../flux/Store";
import { actions } from "../flux/actions";
import { CategoryItem } from "../components/categories/CategoryItem";
import { CategoryForm } from "../components/categories/CategoryForm";
import { Button } from "../components/Button";
import { type Category } from "../services/Api";

export function CategoryList() {
    const [state, setState] = useState(store.getState());
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

    useEffect(() => {
        const handleChange = () => setState(store.getState());
        store.addChangeListener(handleChange);
        actions.fetchCategories();
        return () => store.removeChangeListener(handleChange);
    }, []);

    const handleAdd = () => {
        setEditingCategory(null);
        setShowForm(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setShowForm(true);
    };

    const handleSubmit = async (data: { name: string; type: "income" | "expense" }) => {
        if (editingCategory) {
            await actions.editCategory(editingCategory.id, data);
        } else {
            await actions.addCategory(data);
        }
        setShowForm(false);
        setEditingCategory(null);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Czy na pewno chcesz usunąć tę kategorię?")) {
            await actions.deleteCategory(id);
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setEditingCategory(null);
    };

    const toggleSort = () => {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    };

    const sortedCategories = [...state.categories].sort((a, b) => {
        return sortOrder === "asc"
            ? a.name.localeCompare(b.name, "pl")
            : b.name.localeCompare(a.name, "pl");
    });

    if (state.loading.categories) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Ładowanie kategorii...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Kategorie</h1>
                <div className="flex gap-3">
                    <Button
                        onClick={toggleSort}
                        variant="secondary"
                        className="flex items-center gap-2"
                    >
                        {sortOrder === "asc" ? <ArrowUpAZ size={18} /> : <ArrowDownAZ size={18} />}
                        Sortuj
                    </Button>
                    <Button onClick={handleAdd} className="flex items-center gap-2">
                        <Plus size={18} />
                        Dodaj kategorię
                    </Button>
                </div>
            </div>

            {showForm && (
                <div className="mb-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingCategory ? "Edytuj kategorię" : "Nowa kategoria"}
                    </h2>
                    <CategoryForm
                        category={editingCategory}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </div>
            )}

            <div className="space-y-3">
                {sortedCategories.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        Brak kategorii. Dodaj pierwszą kategorię!
                    </div>
                ) : (
                    sortedCategories.map((category) => (
                        <CategoryItem
                            key={category.id}
                            category={category}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
