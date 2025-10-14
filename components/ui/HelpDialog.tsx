'use client';

import Modal from './Modal';

interface HelpDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpDialog({ isOpen, onClose }: HelpDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="游戏帮助">
      <div className="text-gray-200 space-y-4">
        {/* 游戏规则 */}
        <section>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">🎯 游戏目标</h3>
          <p className="text-sm leading-relaxed">
            将红色的 <span className="text-red-400 font-bold">曹操方块（2×2）</span>{' '}
            移动到棋盘底部中央的出口位置（第4-5行，第2-3列）即可获胜。
          </p>
        </section>

        {/* 操作说明 */}
        <section>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">🎮 操作方式</h3>
          <ul className="text-sm space-y-2">
            <li>
              <strong className="text-white">鼠标/触摸：</strong>拖拽方块移动
            </li>
            <li>
              <strong className="text-white">键盘：</strong>
              <ul className="ml-4 mt-1 space-y-1">
                <li>• Tab/Shift+Tab：切换选中方块</li>
                <li>• 方向键：移动选中的方块</li>
                <li>• Enter：选中/取消选中</li>
              </ul>
            </li>
          </ul>
        </section>

        {/* 快捷键 */}
        <section>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">⌨️ 快捷键</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <kbd className="bg-gray-700 px-2 py-1 rounded">U</kbd>
              <span className="ml-2">撤销</span>
            </div>
            <div>
              <kbd className="bg-gray-700 px-2 py-1 rounded">R</kbd>
              <span className="ml-2">重做</span>
            </div>
            <div>
              <kbd className="bg-gray-700 px-2 py-1 rounded">Ctrl+R</kbd>
              <span className="ml-2">重置</span>
            </div>
            <div>
              <kbd className="bg-gray-700 px-2 py-1 rounded">ESC</kbd>
              <span className="ml-2">关闭弹窗</span>
            </div>
          </div>
        </section>

        {/* 方块说明 */}
        <section>
          <h3 className="text-lg font-semibold text-yellow-400 mb-2">🧩 方块类型</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-500 rounded border-2 border-red-600"></div>
              <span>曹操 (2×2)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-8 bg-amber-500 rounded border-2 border-amber-600"></div>
              <span>竖将 (2×1)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 bg-blue-500 rounded border-2 border-blue-600"></div>
              <span>横将 (1×2)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-emerald-500 rounded border-2 border-emerald-600"></div>
              <span>小兵 (1×1)</span>
            </div>
          </div>
        </section>

        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors mt-4"
          aria-label="关闭帮助"
        >
          知道了
        </button>
      </div>
    </Modal>
  );
}

