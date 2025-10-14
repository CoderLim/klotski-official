'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiProps {
  show: boolean;
}

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  color: string;
  rotation: number;
  scale: number;
}

const COLORS = ['#EF4444', '#F59E0B', '#3B82F6', '#10B981', '#8B5CF6', '#EC4899'];

function generateConfetti(count: number): ConfettiPiece[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: Math.random() * 360,
    scale: 0.5 + Math.random() * 0.5,
  }));
}

export default function Confetti({ show }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (show) {
      setPieces(generateConfetti(50));
      
      // 2秒后清除
      const timer = setTimeout(() => {
        setPieces([]);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <motion.div
          key={piece.id}
          initial={{
            x: `${piece.x}vw`,
            y: '-10vh',
            rotate: piece.rotation,
            scale: piece.scale,
            opacity: 1,
          }}
          animate={{
            x: `${piece.x + (Math.random() - 0.5) * 20}vw`,
            y: '110vh',
            rotate: piece.rotation + 360 * (Math.random() > 0.5 ? 1 : -1),
            opacity: 0,
          }}
          transition={{
            duration: 2 + Math.random() * 1,
            ease: 'linear',
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: piece.color }}
        />
      ))}
    </div>
  );
}

