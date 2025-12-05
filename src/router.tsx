import { createBrowserRouter } from "react-router";
import Dashboard from "./pages/Dashboard";
import { Layout } from "./layout/Layout";
import { TransactionList } from "./pages/TransactionList";
import { TransactionDetail } from "./pages/TransactionDetail";
import { CategoryList } from "./pages/CategoryList";

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
                path: "transactions/:id",
                Component: TransactionDetail,
            },
            {
                path: "categories",
                Component: CategoryList,
            },
        ],
    },
]);
