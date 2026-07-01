import type { Metadata } from 'next';
import './globals.css';
import { WalletProvider } from '@/context/WalletContext';
import { ClientShell } from '@/components/layout/ClientShell';

export const metadata: Metadata = {
  title: 'Ajo — Save together, the African way',
  description:
    'Pool your savings with friends and family. Everyone puts in, one person wins each round. Built on Stellar — no banks, no fees, no paperwork.',
  keywords: ['ajo', 'esusu', 'rosca', 'savings', 'stellar', 'soroban', 'community savings'],
  openGraph: {
    title: 'Ajo — Save together, the African way',
    description: 'Community rotating savings, run automatically on the blockchain.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <ClientShell>{children}</ClientShell>
        </WalletProvider>
      </body>
    </html>
  );
}
