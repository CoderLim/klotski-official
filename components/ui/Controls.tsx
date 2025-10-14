'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGameStore } from '@/lib/store/useGameStore';
import HelpDialog from './HelpDialog';

export default function Controls() {
  const router = useRouter();
  const { canUndo, canRedo, undo, redo, reset, isMuted, toggleMute } = useGameStore();
  const [showHelp, setShowHelp] = useState(false);

  const handleReset = () => {
    if (confirm('确定要重置当前拼图吗？所有进度将被清除。')) {
      reset();
    }
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
              aria-label="撤销 (U)"
              title="撤销 (U)"
            >
              ↶ 撤销
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
              aria-label="重做 (R)"
              title="重做 (R)"
            >
              ↷ 重做
            </button>

            {/* 重置 */}
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-orange-500/50"
              aria-label="重置"
              title="重置 (Ctrl+R)"
            >
              🔄 重置
            </button>

            {/* 帮助 */}
            <button
              onClick={() => setShowHelp(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/50"
              aria-label="帮助"
            >
              ❓ 帮助
            </button>

            {/* 静音 */}
            <button
              onClick={toggleMute}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95"
              aria-label={isMuted ? '开启声音' : '静音'}
              title={isMuted ? '开启声音' : '静音'}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>

            {/* 返回首页 */}
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-green-500/50"
              aria-label="返回首页"
            >
              🏠 首页
            </button>
          </div>
        </div>
      </div>

      {/* 帮助对话框 */}
      <HelpDialog isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </>
  );
}

