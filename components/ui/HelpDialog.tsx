'use client';

import { useTranslations } from 'next-intl';
import Modal from './Modal';

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpDialog({ isOpen, onClose }: HelpDialogProps) {
  const t = useTranslations('help');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('title')}>
      <div className="text-gray-200 space-y-4">
        {/* 游戏规则 */}
        <section>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">🎯 {t('goal')}</h3>
          <p className="text-sm leading-relaxed">
            {t('goalDescription')}
          </p>
        </section>

        {/* 操作说明 */}
        <section>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">🎮 {t('controls')}</h3>
          <ul className="text-sm space-y-2">
            <li>
              <strong className="text-white">{t('controlsMouse')}</strong> {t('controlsMouseDesc')}
            </li>
            <li>
              <strong className="text-white">{t('controlsKeyboard')}</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• {t('controlsKeyboardTab')}</li>
                <li>• {t('controlsKeyboardArrow')}</li>
                <li>• {t('controlsKeyboardEnter')}</li>
              </ul>
            </li>
          </ul>
        </section>

        {/* 快捷键 */}
        <section>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">⌨️ {t('shortcuts')}</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <kbd className="bg-gray-700 px-2 py-1 rounded">U</kbd>
              <span className="ml-2">{t('shortcutUndo')}</span>
            </div>
            <div>
              <kbd className="bg-gray-700 px-2 py-1 rounded">R</kbd>
              <span className="ml-2">{t('shortcutRedo')}</span>
            </div>
            <div>
              <kbd className="bg-gray-700 px-2 py-1 rounded">Ctrl+R</kbd>
              <span className="ml-2">{t('shortcutReset')}</span>
            </div>
            <div>
              <kbd className="bg-gray-700 px-2 py-1 rounded">ESC</kbd>
              <span className="ml-2">{t('shortcutClose')}</span>
            </div>
          </div>
        </section>

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors mt-4"
          aria-label={t('gotIt')}
        >
          {t('gotIt')}
        </button>
      </div>
    </Modal>
  );
}
