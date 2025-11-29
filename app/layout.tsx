import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Digimon Evolution Companion',
  description: 'Find evolution paths for Digimon Dawn/Dusk',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
