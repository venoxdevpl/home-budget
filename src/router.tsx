import { createBrowserRouter } from "react-router";
import Dashboard from "./pages/Dashboard";
import { Layout } from "./layout/Layout";
import { TransactionList } from "./pages/TransactionList";
import { TransactionDetail } from "./pages/TransactionDetail";
import TransactionAdd from "./pages/TransactionAdd";
import { CategoryList } from "./pages/CategoryList";
import CategoryAdd from "./pages/CategoryAdd";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: Layout,
        children: [
            {
                index: true,
                Component: Dashboard,
            },
            {
                path: "transactions",
                Component: TransactionList,
            },
            {
                path: "transactions/add",
                Component: TransactionAdd,
            },
            {
                path: "transactions/:id",
                Component: TransactionDetail,
            },
            {
                path: "categories",
                Component: CategoryList,
            },
            {
                path: "categories/add",
                Component: CategoryAdd,
            },
        ],
    },
]);
