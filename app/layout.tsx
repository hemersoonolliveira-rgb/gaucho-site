import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: 'Gaúcho Material de Construção – Rio Branco/AC',
  description: 'Loja de materiais de construção em Rio Branco, Acre. Mais de 38 mil itens em estoque: hidráulica, elétrica, ferramentas, tintas, argamassa, EPI e muito mais. Entrega em Rio Branco. Atendimento especializado.',
  keywords: 'material de construção, Rio Branco, Acre, loja de construção, materiais de obra, hidráulica, elétrica, ferramentas, tintas, EPI, argamassa, cimento, telhas, Gaúcho',
  authors: [{ name: 'Gaúcho Material de Construção' }],
  openGraph: {
    title: 'Gaúcho Material de Construção – Rio Branco/AC',
    description: 'Sua loja de materiais de construção em Rio Branco, Acre. +38mil itens em estoque.',
    type: 'website',
    locale: 'pt_BR',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#E8722A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="bg-background">
      <head>
        {/* Google Analytics Placeholder - Replace GA_MEASUREMENT_ID with your actual ID */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID || 'GA_MEASUREMENT_ID'}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID || 'GA_MEASUREMENT_ID'}');
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
