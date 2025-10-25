import { Suspense } from 'react';

export const metadata = {
  title: 'Klotski Solver - AI Puzzle Solver',
  description: 'Professional Klotski puzzle solver using advanced algorithms',
};

export default function SolverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}

