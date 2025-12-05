import { createBrowserRouter } from "react-router";
import Dashboard from "./pages/Dashboard";
import { Layout } from "./layout/Layout";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: Layout,
        children: [
            {
                index: true,
                Component: Dashboard
            }
        ]
    }
]);