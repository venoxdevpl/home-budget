import { EventEmitter } from "events";
import { dispatcher } from "./Dispatcher";
import { ActionTypes } from "./actions";
import { type Category, type Transaction } from "../services/Api";

interface StoreState {
    categories: Category[];
    transactions: Transaction[];
    monthFilter: string;
    loading: {
        categories: boolean;
        transactions: boolean;
    };
    error: {
        categories: string | null;
        transactions: string | null;
    };
}

class BudgetStore extends EventEmitter {
    private state: StoreState = {
        categories: [],
        transactions: [],
        monthFilter: new Date().toISOString().slice(0, 7),
        loading: {
            categories: false,
            transactions: false,
        },
        error: {
            categories: null,
            transactions: null,
        },
    };

    constructor() {
        super();
        dispatcher.register(this.handleAction.bind(this));
    }

    private handleAction(action: any) {
        switch (action.type) {
            case ActionTypes.FETCH_CATEGORIES_REQUEST:
                this.state.loading.categories = true;
                this.state.error.categories = null;
                this.emitChange();
                break;

            case ActionTypes.FETCH_CATEGORIES_SUCCESS:
                this.state.categories = action.payload;
                this.state.loading.categories = false;
                this.emitChange();
                break;

            case ActionTypes.FETCH_CATEGORIES_ERROR:
                this.state.loading.categories = false;
                this.state.error.categories = action.payload.message;
                this.emitChange();
                break;

            case ActionTypes.ADD_CATEGORY:
                this.state.categories.push(action.payload);
                this.emitChange();
                break;

            case ActionTypes.EDIT_CATEGORY:
                const categoryIndex = this.state.categories.findIndex(
                    (c) => c.id === action.payload.id,
                );
                if (categoryIndex !== -1) {
                    this.state.categories[categoryIndex] = action.payload;
                }
                this.emitChange();
                break;

            case ActionTypes.DELETE_CATEGORY:
                this.state.categories = this.state.categories.filter(
                    (c) => c.id !== action.payload,
                );
                this.emitChange();
                break;

            case ActionTypes.FETCH_TRANSACTIONS_REQUEST:
                this.state.loading.transactions = true;
                this.state.error.transactions = null;
                this.emitChange();
                break;

            case ActionTypes.FETCH_TRANSACTIONS_SUCCESS:
                this.state.transactions = action.payload;
                this.state.loading.transactions = false;
                this.emitChange();
                break;

            case ActionTypes.FETCH_TRANSACTIONS_ERROR:
                this.state.loading.transactions = false;
                this.state.error.transactions = action.payload.message;
                this.emitChange();
                break;

            case ActionTypes.ADD_TRANSACTION:
                this.state.transactions.push(action.payload);
                this.emitChange();
                break;

            case ActionTypes.EDIT_TRANSACTION:
                const transactionIndex = this.state.transactions.findIndex(
                    (t) => t.id === action.payload.id,
                );
                if (transactionIndex !== -1) {
                    this.state.transactions[transactionIndex] = action.payload;
                }
                this.emitChange();
                break;

            case ActionTypes.DELETE_TRANSACTION:
                this.state.transactions = this.state.transactions.filter(
                    (t) => t.id !== action.payload,
                );
                this.emitChange();
                break;

            case ActionTypes.SET_MONTH_FILTER:
                this.state.monthFilter = action.payload;
                this.emitChange();
                break;
        }
    }

    getState(): StoreState {
        return { ...this.state };
    }

    emitChange() {
        this.emit("change");
    }

    addChangeListener(callback: () => void) {
        this.on("change", callback);
    }

    removeChangeListener(callback: () => void) {
        this.removeListener("change", callback);
    }
}

export const store = new BudgetStore();
