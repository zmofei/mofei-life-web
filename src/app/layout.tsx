import "./globals.css";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mofei - Software Engineer in Finland',
  description: 'Personal blog of Mofei, a software engineer living in Finland',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}