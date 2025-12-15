
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
        <div className="flex flex-items justify-between p-4 bg-white rounded-lg shadow-sm border-gray-200 hover:shadow-md transition-shadow" style={{
                        backgroundColor: category.type === "income" ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)"
                    }}>
            
                
                    <div className="flex flex-col ml-3">
                        <h3 className="font-medium text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500">
                            {category.type === "income" ? "Przychód" : "Wydatek"}
                        </p>
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
    );
}


