import {Sidebar} from '@/Components/ui/sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <main className="flex-1 overflow-auto bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
}
