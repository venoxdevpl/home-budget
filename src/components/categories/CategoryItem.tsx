
import { Pencil, Trash2 } from "lucide-react";
import { type Category } from "../../services/Api";
import { Button } from "../Button";

interface CategoryItemProps {
    category: Category;
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
}

export function CategoryItem({ category, onEdit, onDelete }: CategoryItemProps) {
    return (
        <div className="flex flex-items justify-between p-4 bg-white rounded-lg shadow-sm border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
                <div
                    className={`w-3 h-3 rounded-full ${
                        category.type === "income" ? "bg-green-500" : "bg-red-500"
                    }`}
                >
                    <div>
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">
                            {category.type === "income" ? "Przychód" : "Wydatek"}
                        </p>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button onClick={() => onEdit(category)} className="p-2 text-blue">
                        <Pencil size={18} />
                    </Button>

                    <Button onClick={() => onDelete(category.id)}>
                        <Trash2 size={18} />
                    </Button>
                </div>
            </div>
        </div>
    );
}


