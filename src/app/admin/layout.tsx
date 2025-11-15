export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen">
            <aside className="w-64 bg-gray-900 text-white p-4">
                <h2 className="text-xl font-semibold mb-6">Launchly Admin</h2>

                <nav className="flex flex-col gap-2">
                    <a href="/admin/dashboard">Dashboard</a>
                    <a href="/admin/users">Users</a>
                    <a href="/admin/projects">Projects</a>
                </nav>
            </aside>

            <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
