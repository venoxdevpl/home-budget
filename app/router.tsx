import { createBrowserRouter } from "react-router";
import { Layout } from "./layout/Layout";
import Dashboard from "./routes/Dashboard";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
        ],
    },
]);

export default router;
