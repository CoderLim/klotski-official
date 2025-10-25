'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useGameStore } from '@/lib/store/useGameStore';
import HelpDialog from './HelpDialog';
import ConfirmDialog from './ConfirmDialog';

export default function Controls() {
  const t = useTranslations('controls');
  const { canUndo, canRedo, undo, redo, reset } = useGameStore();
  const [showHelp, setShowHelp] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    reset();
  };

  return (
    <>
      <div className="bg-gray-900/80 border-t-2 border-gray-700 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex flex-wrap justify-center gap-2">
            {/* 撤销 */}
            <button
              onClick={undo}
              disabled={!canUndo()}
              className={`px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 ${
                canUndo()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/50'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
              aria-label={`${t('undo')} (U)`}
              title={`${t('undo')} (U)`}
            >
              ↶ {t('undo')}
            </button>

            {/* 重做 */}
            <button
              onClick={redo}
              disabled={!canRedo()}
              className={`px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 ${
                canRedo()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-blue-500/50'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
              aria-label={`${t('redo')} (R)`}
              title={`${t('redo')} (R)`}
            >
              ↷ {t('redo')}
            </button>

            {/* 重置 */}
            <button
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-orange-500/50"
              aria-label={t('reset')}
              title={`${t('reset')} (Ctrl+R)`}
            >
              🔄 {t('reset')}
            </button>

            {/* 帮助 */}
            <button
              onClick={() => setShowHelp(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/50"
              aria-label={t('help')}
            >
              ❓ {t('help')}
            </button>

            {/* AI 求解器 */}
            <Link
              href="/solver"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-cyan-500/50"
              aria-label="AI 求解器"
              title="AI 求解器"
            >
              🤖 AI 求解器
            </Link>
          </div>
        </div>
      </div>

      {/* 帮助对话框 */}
      <HelpDialog isOpen={showHelp} onClose={() => setShowHelp(false)} />

      {/* 重置确认对话框 */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleReset}
        title={t('reset')}
        message={t('resetConfirm')}
        confirmText={t('reset')}
        cancelText={t('cancel')}
      />
    </>
  );
}
