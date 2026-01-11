import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3001",
    headers: {
        "Content-Type": "application/json",
    },
});

export interface Category {
    id: string;
    name: string;
    type: "income" | "expense";
}

export interface Transaction {
    id: string;
    date: string;
    amount: number;
    description: string;
    categoryId: string;
}

export const API = {
    categories: {
        async all(): Promise<Category[]> {
            const response = await api.get<Category[]>("/categories");
            return response.data;
        },

        async create(category: Omit<Category, "id">): Promise<Category> {
            const newCategory = {
                ...category,
                id: Date.now().toString(),
            };
            const response = await api.post<Category>("/categories", newCategory);
            return response.data;
        },

        async update(id: string, updates: Partial<Omit<Category, "id">>): Promise<Category> {
            const response = await api.patch<Category>(`/categories/${id}`, updates);
            return response.data;
        },

        async delete(id: string): Promise<void> {
            await api.delete(`/categories/${id}`);
        },
    },

    transactions: {
        async all(): Promise<Transaction[]> {
            const response = await api.get<Transaction[]>("/transactions");
            return response.data;
        },

        async getById(id: string): Promise<Transaction | undefined> {
            try {
                const response = await api.get<Transaction>(`/transactions/${id}`);
                return response.data;
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    return undefined;
                }
                throw error;
            }
        },

        async create(transaction: Omit<Transaction, "id">): Promise<Transaction> {
            const newTransaction = {
                ...transaction,
                id: Date.now().toString(),
            };
            const response = await api.post<Transaction>("/transactions", newTransaction);
            return response.data;
        },

        async update(id: string, updates: Partial<Omit<Transaction, "id">>): Promise<Transaction> {
            const response = await api.patch<Transaction>(`/transactions/${id}`, updates);
            return response.data;
        },

        async delete(id: string): Promise<void> {
            await api.delete(`/transactions/${id}`);
        },
    },
};

