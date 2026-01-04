import { useNavigate } from "react-router";
import { actions } from "../flux/actions";
import { CategoryForm } from "../components/categories/CategoryForm";

export default function CategoryAdd() {
    const navigate = useNavigate();

    const handleSubmit = async (data: { name: string; type: "income" | "expense" }) => {
        await actions.addCategory(data);
        navigate("/categories");
    };

    const handleCancel = () => {
        navigate("/categories");
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Dodaj nową kategorię</h1>
            <div className="p-6 bg-white rounded-lg shadow-md border border-gray-200">
                <CategoryForm onSubmit={handleSubmit} onCancel={handleCancel} />
            </div>
        </div>
    );
}
