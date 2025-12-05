import { NavLink, Outlet } from "react-router";
import { LayoutDashboard, Receipt, FolderOpen, Wallet } from "lucide-react";

export function Layout() {
    const navLinkClass = ({ isActive }: { isActive: boolean }) => {
        return `
            flex items-center gap-2 py-2 rounded-lg transition-colors ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}
        `;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="bg-white shadow-md border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Wallet className="text-blue-600" size={32} />
                            <h1 className="text-2xl font-bold text-gray-900">Budżet Domowy</h1>
                        </div>

                        <div className="flex gap-2">
                            <NavLink to="/dashboard" className={navLinkClass}>
                                <LayoutDashboard size={20} />
                                <span className="font-medium">Dashboard</span>
                            </NavLink>

                            <NavLink to="/dashboard" className={navLinkClass}>
                                <Receipt size={20} />
                                <span className="font-medium">Paragony</span>
                            </NavLink>

                            <NavLink to="/dashboard" className={navLinkClass}>
                                <FolderOpen size={20} />
                                <span className="font-medium">Kategorie</span>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </nav>
            <main className="py-6">
                <Outlet />
            </main>
        </div>
    );
}
