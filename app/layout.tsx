import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from './components/ThemeProvider'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bus Booking System',
  description: 'Book your bus tickets easily and securely',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-[var(--background-color)] text-[var(--text-color)]">
              <Navbar />
              <main>{children}</main>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
} 