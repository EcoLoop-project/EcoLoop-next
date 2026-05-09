import './globals.css';
import { AppProvider } from '@/components/AppContext';
import Navbar from '@/components/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 flex flex-col">
        <AppProvider>
          <Navbar />

          <main className="flex-grow w-full px-0 py-0">
            {children}
          </main>

        </AppProvider>
      </body>
    </html>
  );
}