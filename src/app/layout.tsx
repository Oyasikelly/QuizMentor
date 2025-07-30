import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/context/AuthContext';
import { QuizProvider } from '@/context/QuizContext';
import { Toaster } from 'sonner';

// const geistSans = Geist({
// 	variable: "--font-geist-sans",
// 	subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
// 	variable: "--font-geist-mono",
// 	subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: 'Quiz Mentor',
  description: 'A quiz platform that adapts to you.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <QuizProvider>{children}</QuizProvider>
            <Toaster
              position="top-right"
              richColors
              closeButton
              duration={4000}
            />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
