import axios from "axios";

// Konfiguracja axios z bazowym URL do JSON Server
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
        // GET /categories - pobieranie wszystkich kategorii
        async all(): Promise<Category[]> {
            const response = await api.get<Category[]>("/categories");
            return response.data;
        },

        // POST /categories - tworzenie nowej kategorii
        async create(category: Omit<Category, "id">): Promise<Category> {
            const newCategory = {
                ...category,
                id: Date.now().toString(),
            };
            const response = await api.post<Category>("/categories", newCategory);
            return response.data;
        },

        // PATCH /categories/:id - aktualizacja kategorii
        async update(id: string, updates: Partial<Omit<Category, "id">>): Promise<Category> {
            const response = await api.patch<Category>(`/categories/${id}`, updates);
            return response.data;
        },

        // DELETE /categories/:id - usuwanie kategorii
        async delete(id: string): Promise<void> {
            await api.delete(`/categories/${id}`);
        },
    },

    transactions: {
        // GET /transactions - pobieranie wszystkich transakcji
        async all(): Promise<Transaction[]> {
            const response = await api.get<Transaction[]>("/transactions");
            return response.data;
        },

        // GET /transactions/:id - pobieranie pojedynczej transakcji
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

        // POST /transactions - tworzenie nowej transakcji
        async create(transaction: Omit<Transaction, "id">): Promise<Transaction> {
            const newTransaction = {
                ...transaction,
                id: Date.now().toString(),
            };
            const response = await api.post<Transaction>("/transactions", newTransaction);
            return response.data;
        },

        // PATCH /transactions/:id - aktualizacja transakcji
        async update(id: string, updates: Partial<Omit<Transaction, "id">>): Promise<Transaction> {
            const response = await api.patch<Transaction>(`/transactions/${id}`, updates);
            return response.data;
        },

        // DELETE /transactions/:id - usuwanie transakcji
        async delete(id: string): Promise<void> {
            await api.delete(`/transactions/${id}`);
        },
    },
};

