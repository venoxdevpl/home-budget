const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

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

const CATEGORIES_KEY = "budget_categories";
const TRANSACTIONS_KEY = "budget_transactions";

const initData = () => {
    if (!localStorage.getItem(CATEGORIES_KEY)) {
        const defaultCategories: Category[] = [
            { id: "1", name: "Wynagrodzenie", type: "income" },
            { id: "2", name: "Jedzenie", type: "expense" },
            { id: "3", name: "Rachunki", type: "expense" },
            { id: "4", name: "Transport", type: "expense" },
        ];

        localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
    }

    if (!localStorage.getItem(TRANSACTIONS_KEY)) {
        const defaultTransactions: Transaction[] = [
            { id: "1", date: "2025-12-01", amount: 5000, description: "Pensja", categoryId: "1" },
            {
                id: "2",
                date: "2025-12-02",
                amount: 200,
                description: "Zakupy spożywcze",
                categoryId: "2",
            },
            {
                id: "3",
                date: "2025-12-03",
                amount: 350,
                description: "Prąd i gaz",
                categoryId: "3",
            },
        ];
        localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(defaultTransactions));
    }
};

initData();

export const API = {
    categories: {
        async all(): Promise<Category[]> {
            await delay(300);
            const data = localStorage.getItem(CATEGORIES_KEY);
            return data ? JSON.parse(data) : [];
        },

        async create(category: Omit<Category, "id">): Promise<Category> {
            await delay(300);
            const categories = await this.all();
            const newCategory: Category = {
                ...category,
                id: Date.now().toString(),
            };

            categories.push(newCategory);
            localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
            return newCategory;
        },

        async update(id: string, updates: Partial<Omit<Category, "id">>): Promise<Category> {
            await delay(300);
            const categories = await this.all();
            const index = categories.findIndex((c) => c.id === id);

            if (index === -1) throw new Error("Category not found.");
            categories[index] = { ...categories[index], ...updates };
            localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
            return categories[index];
        },

        async delete(id: string): Promise<void> {
            await delay(300);
            const categories = await this.all();
            const filtered = categories.filter((c) => c.id !== id);
            localStorage.setItem(CATEGORIES_KEY, JSON.stringify(filtered));
        },
    },

    transactions: {
        async all(): Promise<Transaction[]> {
            await delay(300);
            const data = localStorage.getItem(TRANSACTIONS_KEY);
            return data ? JSON.parse(data) : [];
        },

        async getById(id: string): Promise<Transaction | undefined> {
            await delay(300);
            const transactions = await this.all();
            return transactions.find((t) => t.id === id);
        },

        async create(transaction: Omit<Transaction, "id">): Promise<Transaction> {
            await delay(300);
            const transactions = await this.all();
            const newTransaction: Transaction = {
                ...transaction,
                id: Date.now().toString(),
            };
            transactions.push(newTransaction);
            localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
            return newTransaction;
        },

        async update(id: string, updates: Partial<Omit<Transaction, "id">>): Promise<Transaction> {
            await delay(300);
            const transactions = await this.all();
            const index = transactions.findIndex((t) => t.id === id);
            if (index === -1) throw new Error("Transaction not found");
            transactions[index] = { ...transactions[index], ...updates };
            localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
            return transactions[index];
        },

        async delete(id: string): Promise<void> {
            await delay(300);
            const transactions = await this.all();
            const filtered = transactions.filter((t) => t.id !== id);
            localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(filtered));
        },
    },
};
