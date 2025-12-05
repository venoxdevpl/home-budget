import { dispatcher } from "./Dispatcher";
import { API, type Category, type Transaction } from "~/services/Api";

export const ActionTypes = {
    FETCH_CATEGORIES_REQUEST: "FETCH_CATEGORIES_REQUEST",
    FETCH_CATEGORIES_SUCCESS: "FETCH_CATEGORIES_SUCCESS",
    FETCH_CATEGORIES_ERROR: "FETCH_CATEGORIES_ERROR",

    ADD_CATEGORY: "ADD_CATEGORY",
    EDIT_CATEGORY: "EDIT_CATEGORY",
    DELETE_CATEGORY: "DELETE_CATEGORY",

    FETCH_TRANSACTIONS_REQUEST: "FETCH_TRANSACTIONS_REQUEST",
    FETCH_TRANSACTIONS_SUCCESS: "FETCH_TRANSACTIONS_SUCCESS",
    FETCH_TRANSACTIONS_ERROR: "FETCH_TRANSACTIONS_ERROR",

    ADD_TRANSACTION: "ADD_TRANSACTION",
    EDIT_TRANSACTION: "EDIT_TRANSACTION",
    DELETE_TRANSACTION: "DELETE_TRANSACTION",

    SET_MONTH_FILTER: "SET_MONTH_FILTER",
};

export const actions = {
    async fetchCategories() {
        dispatcher.dispatch({ type: ActionTypes.FETCH_CATEGORIES_REQUEST });
        try {
            const categories = await API.categories.all();
            dispatcher.dispatch({
                type: ActionTypes.FETCH_CATEGORIES_SUCCESS,
                payload: categories,
            });
        } catch (error) {
            dispatcher.dispatch({ type: ActionTypes.FETCH_CATEGORIES_ERROR, payload: error });
        }
    },

    async addCategory(category: Omit<Category, "id">) {
        try {
            const newCategory = await API.categories.create(category);
            dispatcher.dispatch({
                type: ActionTypes.ADD_CATEGORY,
                payload: newCategory,
            });
        } catch (error) {
            console.error("Error adding category:", error);
        }
    },

    async editCategory(id: string, updates: Partial<Omit<Category, "id">>) {
        try {
            const updated = await API.categories.update(id, updates);
            dispatcher.dispatch({
                type: ActionTypes.EDIT_CATEGORY,
                payload: updated,
            });
        } catch (error) {
            console.error("Error editing category:", error);
        }
    },

    async deleteCategory(id: string) {
        try {
            await API.categories.delete(id);
            dispatcher.dispatch({
                type: ActionTypes.DELETE_CATEGORY,
                payload: id,
            });
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    },

    async fetchTransactions() {
        dispatcher.dispatch({ type: ActionTypes.FETCH_TRANSACTIONS_REQUEST });

        try {
            const transactions = await API.transactions.all();
            dispatcher.dispatch({
                type: ActionTypes.FETCH_TRANSACTIONS_SUCCESS,
                payload: transactions,
            });
        } catch (error) {
            dispatcher.dispatch({
                type: ActionTypes.FETCH_TRANSACTIONS_ERROR,
                payload: error,
            });
        }
    },

    async addTransaction(transaction: Omit<Transaction, "id">) {
        try {
            const newTransaction = await API.transactions.create(transaction);
            dispatcher.dispatch({
                type: ActionTypes.ADD_TRANSACTION,
                payload: newTransaction,
            });
        } catch (error) {
            console.error("Error adding transaction:", error);
        }
    },

    async editTransaction(id: string, updates: Partial<Omit<Transaction, "id">>) {
        try {
            const updated = await API.transactions.update(id, updates);
            dispatcher.dispatch({
                type: ActionTypes.EDIT_TRANSACTION,
                payload: updated,
            });
        } catch (error) {
            console.error("Error editing transaction:", error);
        }
    },

    async deleteTransaction(id: string) {
        try {
            await API.transactions.delete(id);
            dispatcher.dispatch({
                type: ActionTypes.DELETE_TRANSACTION,
                payload: id,
            });
        } catch (error) {
            console.error("Error deleting transaction:", error);
        }
    },

    setMonthFilter(month: string) {
        dispatcher.dispatch({
            type: ActionTypes.SET_MONTH_FILTER,
            payload: month,
        });
    },
};
