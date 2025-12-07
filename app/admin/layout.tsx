import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Panel Admin - NP Automóviles',
  description: 'Panel de administración de NP Automóviles',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      {children}
    </div>
  );
}
