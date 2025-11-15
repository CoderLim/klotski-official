import { PuzzleConfig, validatePuzzleConfig } from './types';
import { getColorByShape } from '../utils/colors';
import { BlockData } from './types';

// 重新导出类型，方便外部使用
export type { PuzzleConfig, BlockData, Shape, Position, MoveHistory } from './types';

/**
 * 拼图配置数据库
 * 包含经典华容道布局
 */

// 1. 横刀立马
const hengdaoConfig: PuzzleConfig = {
  name: 'Heng Dao Li Ma',
  slug: 'hengdao',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [0, 0] },
    { shape: [2, 1], position: [0, 3] },
    { shape: [2, 1], position: [2, 0] },
    { shape: [2, 1], position: [2, 3] },
    { shape: [1, 2], position: [2, 1] },
    { shape: [1, 1], position: [3, 1] },
    { shape: [1, 1], position: [3, 2] },
    { shape: [1, 1], position: [4, 0] },
    { shape: [1, 1], position: [4, 3] }
  ],
};

// 2. 指挥若定
const zhihuiruodingConfig: PuzzleConfig = {
  name: 'Zhi Hui Ruo Ding',
  slug: 'zhihuiruoding',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [0, 0] },
    { shape: [2, 1], position: [0, 3] },
    { shape: [2, 1], position: [3, 0] },
    { shape: [2, 1], position: [3, 3] },
    { shape: [1, 2], position: [2, 1] },
    { shape: [1, 1], position: [2, 0] },
    { shape: [1, 1], position: [2, 3] },
    { shape: [1, 1], position: [3, 1] },
    { shape: [1, 1], position: [3, 2] }
  ],
};

// 3. 将拥曹营
const jiangyongcaoyingConfig: PuzzleConfig = {
  name: 'Jiang Yong Cao Ying',
  slug: 'jiangyongcaoying',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [1, 0] },
    { shape: [2, 1], position: [1, 3] },
    { shape: [2, 1], position: [2, 1] },
    { shape: [2, 1], position: [2, 2] },
    { shape: [1, 2], position: [4, 0] },
    { shape: [1, 1], position: [3, 0] },
    { shape: [1, 1], position: [3, 3] },
    { shape: [1, 1], position: [4, 2] },
    { shape: [1, 1], position: [4, 3] }
  ],
};

// 4. 齐头并进
const qitoubingjinConfig: PuzzleConfig = {
  name: 'Qi Tou Bing Jin',
  slug: 'qitoubingjin',
  difficulty: 'medium',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [0, 0] },
    { shape: [2, 1], position: [0, 3] },
    { shape: [2, 1], position: [3, 0] },
    { shape: [2, 1], position: [3, 3] },
    { shape: [1, 2], position: [3, 1] },
    { shape: [1, 1], position: [2, 0] },
    { shape: [1, 1], position: [2, 1] },
    { shape: [1, 1], position: [2, 2] },
    { shape: [1, 1], position: [2, 3] }
  ],
};

// 5. 并分三路
const bingfensanluConfig: PuzzleConfig = {
  name: 'Bing Fen San Lu',
  slug: 'bingfensanlu',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [1, 0] },
    { shape: [2, 1], position: [1, 3] },
    { shape: [2, 1], position: [3, 0] },
    { shape: [2, 1], position: [3, 3] },
    { shape: [1, 2], position: [2, 1] },
    { shape: [1, 1], position: [0, 0] },
    { shape: [1, 1], position: [0, 3] },
    { shape: [1, 1], position: [3, 1] },
    { shape: [1, 1], position: [3, 2] }
  ],
};

// 6. 雨声淅沥
const yushengxiliConfig: PuzzleConfig = {
  name: 'Yu Sheng Xi Li',
  slug: 'yushengxili',
  difficulty: 'medium',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [0, 0] },
    { shape: [2, 1], position: [2, 0] },
    { shape: [2, 1], position: [2, 3] },
    { shape: [2, 1], position: [3, 1] },
    { shape: [1, 2], position: [2, 1] },
    { shape: [1, 1], position: [0, 3] },
    { shape: [1, 1], position: [1, 3] },
    { shape: [1, 1], position: [4, 0] },
    { shape: [1, 1], position: [4, 3] }
  ],
};

// 7. 左右布兵
const zuoyoububingConfig: PuzzleConfig = {
  name: 'Zuo You Bu Bing',
  slug: 'zuoyoububing',
  difficulty: 'medium',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [2, 0] },
    { shape: [2, 1], position: [2, 1] },
    { shape: [2, 1], position: [2, 2] },
    { shape: [2, 1], position: [2, 3] },
    { shape: [1, 2], position: [4, 1] },
    { shape: [1, 1], position: [0, 0] },
    { shape: [1, 1], position: [0, 3] },
    { shape: [1, 1], position: [1, 0] },
    { shape: [1, 1], position: [1, 3] }
  ],
};

// 8. 桃花园中
const taohuayuanzhongConfig: PuzzleConfig = {
  name: 'Tao Hua Yuan Zhong',
  slug: 'taohuayuanzhong',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [1, 0] },
    { shape: [2, 1], position: [1, 3] },
    { shape: [2, 1], position: [2, 1] },
    { shape: [2, 1], position: [2, 2] },
    { shape: [1, 2], position: [4, 1] },
    { shape: [1, 1], position: [0, 0] },
    { shape: [1, 1], position: [0, 3] },
    { shape: [1, 1], position: [3, 0] },
    { shape: [1, 1], position: [3, 3] }
  ],
};

// 9. 一路进军
const yilujinjunConfig: PuzzleConfig = {
  name: 'Yi Lu Jin Jun',
  slug: 'yilujinjun',
  difficulty: 'medium',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [0, 0] },
    { shape: [2, 1], position: [2, 0] },
    { shape: [2, 1], position: [2, 1] },
    { shape: [2, 1], position: [2, 2] },
    { shape: [1, 2], position: [4, 1] },
    { shape: [1, 1], position: [0, 3] },
    { shape: [1, 1], position: [1, 3] },
    { shape: [1, 1], position: [2, 3] },
    { shape: [1, 1], position: [3, 3] }
  ],
};

// 10. 一路顺风
const yilushunfengConfig: PuzzleConfig = {
  name: 'Yi Lu Shun Feng',
  slug: 'yilushunfeng',
  difficulty: 'medium',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [0, 0] },
    { shape: [2, 1], position: [2, 0] },
    { shape: [2, 1], position: [2, 3] },
    { shape: [2, 1], position: [3, 2] },
    { shape: [1, 2], position: [2, 1] },
    { shape: [1, 1], position: [0, 3] },
    { shape: [1, 1], position: [1, 3] },
    { shape: [1, 1], position: [3, 1] },
    { shape: [1, 1], position: [4, 1] }
  ],
};

// 11. 围而不歼
const weierbujianConfig: PuzzleConfig = {
  name: 'Wei Er Bu Jian',
  slug: 'weierbujian',
  difficulty: 'medium',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [0, 0] },
    { shape: [2, 1], position: [2, 0] },
    { shape: [2, 1], position: [3, 1] },
    { shape: [2, 1], position: [3, 2] },
    { shape: [1, 2], position: [2, 1] },
    { shape: [1, 1], position: [0, 3] },
    { shape: [1, 1], position: [1, 3] },
    { shape: [1, 1], position: [2, 3] },
    { shape: [1, 1], position: [3, 3] }
  ],
};

// 12. 捷足先登
const jiezuxiandengConfig: PuzzleConfig = {
  name: 'Jie Zu Xian Deng',
  slug: 'jiezuxiandeng',
  difficulty: 'easy',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [3, 0] },
    { shape: [2, 1], position: [3, 1] },
    { shape: [2, 1], position: [3, 2] },
    { shape: [2, 1], position: [3, 3] },
    { shape: [1, 2], position: [2, 1] },
    { shape: [1, 1], position: [0, 0] },
    { shape: [1, 1], position: [0, 3] },
    { shape: [1, 1], position: [1, 0] },
    { shape: [1, 1], position: [1, 3] }
  ],
};

// 13. 插翅难飞
const chachinanfeiConfig: PuzzleConfig = {
  name: 'Cha Chi Nan Fei',
  slug: 'chachinanfei',
  difficulty: 'medium',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [0, 0] },
    { shape: [2, 1], position: [3, 0] },
    { shape: [2, 1], position: [3, 3] },
    { shape: [1, 2], position: [2, 0] },
    { shape: [1, 2], position: [3, 1] },
    { shape: [1, 1], position: [0, 3] },
    { shape: [1, 1], position: [1, 3] },
    { shape: [1, 1], position: [2, 2] },
    { shape: [1, 1], position: [2, 3] }
  ],
};

// 14. 守口如瓶 (变体1)
const shoukourupingConfig: PuzzleConfig = {
  name: 'Shou Kou Ru Ping',
  slug: 'shoukouruping',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [0, 0] },
    { shape: [2, 1], position: [0, 3] },
    { shape: [2, 1], position: [2, 1] },
    { shape: [1, 2], position: [4, 0] },
    { shape: [1, 2], position: [4, 2] },
    { shape: [1, 1], position: [2, 0] },
    { shape: [1, 1], position: [2, 3] },
    { shape: [1, 1], position: [3, 0] },
    { shape: [1, 1], position: [3, 3] }
  ],
};

// 15. 守口如瓶 (变体2)
const shoukouruping2Config: PuzzleConfig = {
  name: 'Shou Kou Ru Ping (Variant)',
  slug: 'shoukouruping-2',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [1, 0] },
    { shape: [2, 1], position: [1, 3] },
    { shape: [2, 1], position: [2, 1] },
    { shape: [1, 2], position: [4, 0] },
    { shape: [1, 2], position: [4, 2] },
    { shape: [1, 1], position: [0, 0] },
    { shape: [1, 1], position: [0, 3] },
    { shape: [1, 1], position: [3, 0] },
    { shape: [1, 1], position: [3, 3] }
  ],
};

// 16. 双将挡路
const shuangjiangdangluConfig: PuzzleConfig = {
  name: 'Shuang Jiang Dang Lu',
  slug: 'shuangjiangdanglu',
  difficulty: 'medium',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [0, 0] },
    { shape: [2, 1], position: [2, 0] },
    { shape: [2, 1], position: [2, 3] },
    { shape: [1, 2], position: [2, 1] },
    { shape: [1, 2], position: [3, 1] },
    { shape: [1, 1], position: [0, 3] },
    { shape: [1, 1], position: [1, 3] },
    { shape: [1, 1], position: [4, 0] },
    { shape: [1, 1], position: [4, 3] }
  ],
};

// 17. 横马当关
const hengmadangguanConfig: PuzzleConfig = {
  name: 'Heng Ma Dang Guan',
  slug: 'hengmadangguan',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [0, 0] },
    { shape: [2, 1], position: [0, 3] },
    { shape: [2, 1], position: [3, 1] },
    { shape: [1, 2], position: [2, 0] },
    { shape: [1, 2], position: [2, 2] },
    { shape: [1, 1], position: [3, 0] },
    { shape: [1, 1], position: [3, 3] },
    { shape: [1, 1], position: [4, 0] },
    { shape: [1, 1], position: [4, 3] }
  ],
};

// 18. 层层设防 (变体1)
const cengcengshefangConfig: PuzzleConfig = {
  name: 'Ceng Ceng She Fang',
  slug: 'cengcengshefang',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [0, 0] },
    { shape: [2, 1], position: [0, 3] },
    { shape: [1, 2], position: [2, 1] },
    { shape: [1, 2], position: [3, 1] },
    { shape: [1, 2], position: [4, 1] },
    { shape: [1, 1], position: [2, 0] },
    { shape: [1, 1], position: [2, 3] },
    { shape: [1, 1], position: [3, 0] },
    { shape: [1, 1], position: [3, 3] }
  ],
};

// 19. 层层设防 (变体2)
const cengcengshefang2Config: PuzzleConfig = {
  name: 'Ceng Ceng She Fang (Variant)',
  slug: 'cengcengshefang-2',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [1, 0] },
    { shape: [2, 1], position: [1, 3] },
    { shape: [1, 2], position: [2, 1] },
    { shape: [1, 2], position: [3, 1] },
    { shape: [1, 2], position: [4, 1] },
    { shape: [1, 1], position: [0, 0] },
    { shape: [1, 1], position: [0, 3] },
    { shape: [1, 1], position: [3, 0] },
    { shape: [1, 1], position: [3, 3] }
  ],
};

// 20. 兵挡将阻
const bingdangjiangzuConfig: PuzzleConfig = {
  name: 'Bing Dang Jiang Zu',
  slug: 'bingdangjiangzu',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [0, 3] },
    { shape: [2, 1], position: [2, 0] },
    { shape: [1, 2], position: [2, 1] },
    { shape: [1, 2], position: [3, 1] },
    { shape: [1, 2], position: [4, 1] },
    { shape: [1, 1], position: [0, 0] },
    { shape: [1, 1], position: [1, 0] },
    { shape: [1, 1], position: [2, 3] },
    { shape: [1, 1], position: [3, 3] }
  ],
};

// 21. 堵塞要道
const dusaiyaodaoConfig: PuzzleConfig = {
  name: 'Du Sai Yao Dao',
  slug: 'dusaiyaodao',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [2, 0] },
    { shape: [2, 1], position: [2, 1] },
    { shape: [1, 2], position: [2, 2] },
    { shape: [1, 2], position: [3, 2] },
    { shape: [1, 2], position: [4, 1] },
    { shape: [1, 1], position: [0, 0] },
    { shape: [1, 1], position: [0, 3] },
    { shape: [1, 1], position: [1, 0] },
    { shape: [1, 1], position: [1, 3] }
  ],
};

// 22. 瓮中之鳖
const wengzhongzhibieConfig: PuzzleConfig = {
  name: 'Weng Zhong Zhi Bie',
  slug: 'wengzhongzhibie',
  difficulty: 'expert',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [0, 0] },
    { shape: [2, 1], position: [0, 3] },
    { shape: [1, 2], position: [2, 0] },
    { shape: [1, 2], position: [2, 2] },
    { shape: [1, 2], position: [3, 1] },
    { shape: [1, 1], position: [3, 0] },
    { shape: [1, 1], position: [3, 3] },
    { shape: [1, 1], position: [4, 0] },
    { shape: [1, 1], position: [4, 3] }
  ],
};

// 23. 层峦叠嶂
const cengluandiezhangConfig: PuzzleConfig = {
  name: 'Ceng Luan Die Zhang',
  slug: 'cengluandiezhang',
  difficulty: 'expert',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [0, 0] },
    { shape: [2, 1], position: [0, 3] },
    { shape: [1, 2], position: [2, 1] },
    { shape: [1, 2], position: [3, 0] },
    { shape: [1, 2], position: [3, 2] },
    { shape: [1, 1], position: [2, 0] },
    { shape: [1, 1], position: [2, 3] },
    { shape: [1, 1], position: [4, 0] },
    { shape: [1, 1], position: [4, 3] }
  ],
};

// 24. 水泄不通
const shuixiebutongConfig: PuzzleConfig = {
  name: 'Shui Xie Bu Tong',
  slug: 'shuixiebutong',
  difficulty: 'expert',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [0, 0] },
    { shape: [1, 2], position: [2, 0] },
    { shape: [1, 2], position: [2, 2] },
    { shape: [1, 2], position: [3, 0] },
    { shape: [1, 2], position: [3, 2] },
    { shape: [1, 1], position: [0, 3] },
    { shape: [1, 1], position: [1, 3] },
    { shape: [1, 1], position: [4, 0] },
    { shape: [1, 1], position: [4, 3] }
  ],
};

// 25. 四路进兵
const silujinbingConfig: PuzzleConfig = {
  name: 'Si Lu Jin Bing',
  slug: 'silujinbing',
  difficulty: 'expert',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [2, 0] },
    { shape: [1, 2], position: [2, 2] },
    { shape: [1, 2], position: [3, 2] },
    { shape: [1, 2], position: [4, 0] },
    { shape: [1, 2], position: [4, 2] },
    { shape: [1, 1], position: [0, 0] },
    { shape: [1, 1], position: [0, 3] },
    { shape: [1, 1], position: [1, 0] },
    { shape: [1, 1], position: [1, 3] }
  ],
};

// 26. 入地无门
const rudiwumenConfig: PuzzleConfig = {
  name: 'Ru Di Wu Men',
  slug: 'rudiwumen',
  difficulty: 'expert',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [0, 0] },
    { shape: [1, 2], position: [2, 1] },
    { shape: [1, 2], position: [3, 0] },
    { shape: [1, 2], position: [3, 2] },
    { shape: [1, 2], position: [4, 1] },
    { shape: [1, 1], position: [0, 3] },
    { shape: [1, 1], position: [1, 3] },
    { shape: [1, 1], position: [2, 0] },
    { shape: [1, 1], position: [2, 3] }
  ],
};

// 27. 勇闯五关
const yongchuangwuguanConfig: PuzzleConfig = {
  name: 'Yong Chuang Wu Guan',
  slug: 'yongchuangwuguan',
  difficulty: 'expert',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [1, 2], position: [2, 0] },
    { shape: [1, 2], position: [2, 2] },
    { shape: [1, 2], position: [3, 0] },
    { shape: [1, 2], position: [3, 2] },
    { shape: [1, 2], position: [4, 1] },
    { shape: [1, 1], position: [0, 0] },
    { shape: [1, 1], position: [0, 3] },
    { shape: [1, 1], position: [1, 0] },
    { shape: [1, 1], position: [1, 3] }
  ],
};

// 28. 四面楚歌
const simianchugeConfig: PuzzleConfig = {
  name: 'Si Mian Chu Ge',
  slug: 'simianchuge',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [1, 1] },
    { shape: [2, 1], position: [0, 0] },
    { shape: [2, 1], position: [0, 3] },
    { shape: [2, 1], position: [2, 3] },
    { shape: [2, 1], position: [3, 0] },
    { shape: [1, 2], position: [3, 1] },
    { shape: [1, 1], position: [0, 1] },
    { shape: [1, 1], position: [0, 2] },
    { shape: [1, 1], position: [2, 0] },
    { shape: [1, 1], position: [4, 3] }
  ],
};

// 29. 前呼后拥
const qianhuhouyongConfig: PuzzleConfig = {
  name: 'Qian Hu Hou Yong',
  slug: 'qianhuhouyong',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [0, 2] },
    { shape: [1, 2], position: [1, 0] },
    { shape: [1, 2], position: [2, 0] },
    { shape: [1, 2], position: [2, 2] },
    { shape: [1, 2], position: [3, 0] },
    { shape: [1, 2], position: [3, 2] },
    { shape: [1, 1], position: [0, 0] },
    { shape: [1, 1], position: [0, 1] },
    { shape: [1, 1], position: [4, 2] },
    { shape: [1, 1], position: [4, 3] }
  ],
};

// 30. 兵临曹营
const binglincaoyingConfig: PuzzleConfig = {
  name: 'Bing Lin Cao Ying',
  slug: 'binglincaoying',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [2, 0] },
    { shape: [2, 1], position: [2, 3] },
    { shape: [2, 1], position: [3, 1] },
    { shape: [2, 1], position: [3, 2] },
    { shape: [1, 2], position: [2, 1] },
    { shape: [1, 1], position: [0, 0] },
    { shape: [1, 1], position: [0, 3] },
    { shape: [1, 1], position: [1, 0] },
    { shape: [1, 1], position: [1, 3] }
  ],
};

// 31. 五将逼宫
const wujiangbigongConfig: PuzzleConfig = {
  name: 'Wu Jiang Bi Gong',
  slug: 'wujiangbigong',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [1, 1] },
    { shape: [2, 1], position: [1, 0] },
    { shape: [2, 1], position: [1, 3] },
    { shape: [1, 2], position: [0, 0] },
    { shape: [1, 2], position: [0, 2] },
    { shape: [1, 2], position: [3, 1] },
    { shape: [1, 1], position: [3, 0] },
    { shape: [1, 1], position: [3, 3] },
    { shape: [1, 1], position: [4, 0] },
    { shape: [1, 1], position: [4, 3] }
  ],
};

// 32. 前挡后阻
const qiandanghouzuConfig: PuzzleConfig = {
  name: 'Qian Dang Hou Zu',
  slug: 'qiandanghouzu',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [0, 0] },
    { shape: [2, 1], position: [1, 2] },
    { shape: [2, 1], position: [2, 0] },
    { shape: [2, 1], position: [2, 1] },
    { shape: [1, 2], position: [0, 2] },
    { shape: [1, 2], position: [4, 1] },
    { shape: [1, 1], position: [1, 3] },
    { shape: [1, 1], position: [2, 3] },
    { shape: [1, 1], position: [3, 2] },
    { shape: [1, 1], position: [3, 3] }
  ],
};

// 33. 近在咫尺
const jinzaichichiConfig: PuzzleConfig = {
  name: 'Jin Zai Zhi Chi',
  slug: 'jinzaichichi',
  difficulty: 'easy',
  blocks: [
    { shape: [2, 2], position: [3, 2] },
    { shape: [2, 1], position: [0, 1] },
    { shape: [2, 1], position: [0, 2] },
    { shape: [2, 1], position: [0, 3] },
    { shape: [1, 2], position: [2, 0] },
    { shape: [1, 2], position: [3, 0] },
    { shape: [1, 1], position: [0, 0] },
    { shape: [1, 1], position: [1, 0] },
    { shape: [1, 1], position: [2, 2] },
    { shape: [1, 1], position: [2, 3] }
  ],
};

// 34. 走投无路
const zoutouwuluConfig: PuzzleConfig = {
  name: 'Zou Tou Wu Lu',
  slug: 'zoutouwulu',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [0, 0] },
    { shape: [2, 1], position: [0, 3] },
    { shape: [2, 1], position: [2, 0] },
    { shape: [2, 1], position: [2, 1] },
    { shape: [2, 1], position: [2, 3] },
    { shape: [1, 1], position: [2, 2] },
    { shape: [1, 1], position: [3, 2] },
    { shape: [1, 1], position: [4, 0] },
    { shape: [1, 1], position: [4, 3] }
  ],
};

// 35. 小燕出巢
const xiaoyanchuchaoConfig: PuzzleConfig = {
  name: 'Xiao Yan Chu Chao',
  slug: 'xiaoyanchuchao',
  difficulty: 'medium',
  blocks: [
    { shape: [2, 2], position: [0, 1] },
    { shape: [2, 1], position: [0, 0] },
    { shape: [2, 1], position: [0, 3] },
    { shape: [1, 2], position: [2, 0] },
    { shape: [1, 2], position: [2, 2] },
    { shape: [1, 2], position: [3, 1] },
    { shape: [1, 1], position: [3, 0] },
    { shape: [1, 1], position: [3, 3] },
    { shape: [1, 1], position: [4, 0] },
    { shape: [1, 1], position: [4, 3] }
  ],
};

// 36. 比翼横空
const biyihengkongConfig: PuzzleConfig = {
  name: 'Bi Yi Heng Kong',
  slug: 'biyihengkong',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [0, 2] },
    { shape: [2, 1], position: [3, 3] },
    { shape: [1, 2], position: [0, 0] },
    { shape: [1, 2], position: [1, 0] },
    { shape: [1, 2], position: [2, 0] },
    { shape: [1, 2], position: [2, 2] },
    { shape: [1, 1], position: [3, 0] },
    { shape: [1, 1], position: [3, 2] },
    { shape: [1, 1], position: [4, 0] },
    { shape: [1, 1], position: [4, 2] }
  ],
};

// 37. 夹道藏兵
const jiadaocangbingConfig: PuzzleConfig = {
  name: 'Jia Dao Cang Bing',
  slug: 'jiadaocangbing',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [0, 0] },
    { shape: [2, 1], position: [0, 3] },
    { shape: [1, 2], position: [2, 0] },
    { shape: [1, 2], position: [2, 2] },
    { shape: [1, 2], position: [3, 0] },
    { shape: [1, 2], position: [3, 2] },
    { shape: [1, 1], position: [0, 2] },
    { shape: [1, 1], position: [1, 2] },
    { shape: [1, 1], position: [4, 0] },
    { shape: [1, 1], position: [4, 3] }
  ],
};

// 38. 屯兵东路
const tunbingdongluConfig: PuzzleConfig = {
  name: 'Tun Bing Dong Lu',
  slug: 'tunbingdonglu',
  difficulty: 'medium',
  blocks: [
    { shape: [2, 2], position: [0, 0] },
    { shape: [2, 1], position: [0, 2] },
    { shape: [2, 1], position: [0, 3] },
    { shape: [2, 1], position: [3, 0] },
    { shape: [2, 1], position: [3, 1] },
    { shape: [1, 2], position: [2, 0] },
    { shape: [1, 1], position: [2, 2] },
    { shape: [1, 1], position: [2, 3] },
    { shape: [1, 1], position: [3, 2] },
    { shape: [1, 1], position: [3, 3] }
  ],
};

// 39. 四将连关
const sijianglianguanConfig: PuzzleConfig = {
  name: 'Si Jiang Lian Guan',
  slug: 'sijianglianguan',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [0, 0] },
    { shape: [2, 1], position: [2, 0] },
    { shape: [2, 1], position: [2, 1] },
    { shape: [1, 2], position: [0, 2] },
    { shape: [1, 2], position: [1, 2] },
    { shape: [1, 2], position: [2, 2] },
    { shape: [1, 1], position: [3, 2] },
    { shape: [1, 1], position: [3, 3] },
    { shape: [1, 1], position: [4, 0] },
    { shape: [1, 1], position: [4, 3] }
  ],
};

// 40. 峰回路转
const fenghuiluzhuanConfig: PuzzleConfig = {
  name: 'Feng Hui Lu Zhuan',
  slug: 'fenghuiluzhuan',
  difficulty: 'hard',
  blocks: [
    { shape: [2, 2], position: [1, 0] },
    { shape: [2, 1], position: [0, 3] },
    { shape: [2, 1], position: [1, 2] },
    { shape: [2, 1], position: [2, 3] },
    { shape: [1, 2], position: [3, 1] },
    { shape: [1, 2], position: [4, 2] },
    { shape: [1, 1], position: [0, 0] },
    { shape: [1, 1], position: [0, 1] },
    { shape: [1, 1], position: [0, 2] },
    { shape: [1, 1], position: [4, 1] }
  ],
};

/**
 * 所有拼图的注册表
 * 已按困难度排序：Easy (2个) -> Medium (10个) -> Hard (22个) -> Expert (6个)
 */
export const PUZZLES: Record<string, PuzzleConfig> = {
  jiezuxiandeng: jiezuxiandengConfig,
  jinzaichichi: jinzaichichiConfig,
  qitoubingjin: qitoubingjinConfig,
  yushengxili: yushengxiliConfig,
  zuoyoububing: zuoyoububingConfig,
  yilujinjun: yilujinjunConfig,
  yilushunfeng: yilushunfengConfig,
  weierbujian: weierbujianConfig,
  chachinanfei: chachinanfeiConfig,
  shuangjiangdanglu: shuangjiangdangluConfig,
  xiaoyanchuchao: xiaoyanchuchaoConfig,
  tunbingdonglu: tunbingdongluConfig,
  hengdao: hengdaoConfig,
  zhihuiruoding: zhihuiruodingConfig,
  jiangyongcaoying: jiangyongcaoyingConfig,
  bingfensanlu: bingfensanluConfig,
  taohuayuanzhong: taohuayuanzhongConfig,
  shoukouruping: shoukourupingConfig,
  'shoukouruping-2': shoukouruping2Config,
  hengmadangguan: hengmadangguanConfig,
  cengcengshefang: cengcengshefangConfig,
  'cengcengshefang-2': cengcengshefang2Config,
  bingdangjiangzu: bingdangjiangzuConfig,
  dusaiyaodao: dusaiyaodaoConfig,
  simianchuge: simianchugeConfig,
  qianhuhouyong: qianhuhouyongConfig,
  binglincaoying: binglincaoyingConfig,
  wujiangbigong: wujiangbigongConfig,
  qiandanghouzu: qiandanghouzuConfig,
  zoutouwulu: zoutouwuluConfig,
  biyihengkong: biyihengkongConfig,
  jiadaocangbing: jiadaocangbingConfig,
  sijianglianguan: sijianglianguanConfig,
  fenghuiluzhuan: fenghuiluzhuanConfig,
  wengzhongzhibie: wengzhongzhibieConfig,
  cengluandiezhang: cengluandiezhangConfig,
  shuixiebutong: shuixiebutongConfig,
  silujinbing: silujinbingConfig,
  rudiwumen: rudiwumenConfig,
  yongchuangwuguan: yongchuangwuguanConfig,
};
/**
 * 获取所有拼图列表（用于首页显示）
 */
export function getAllPuzzles(): PuzzleConfig[] {
  return Object.values(PUZZLES);
}

/**
 * 根据 slug 获取拼图配置
 */
export function getPuzzleBySlug(slug: string): PuzzleConfig | null {
  return PUZZLES[slug] || null;
}
/**
 * 根据 slug 获取拼图的关卡编号（从1开始）
 */
export function getPuzzleIndex(slug: string): number {
  const allPuzzles = getAllPuzzles();
  const index = allPuzzles.findIndex((p) => p.slug === slug);
  return index >= 0 ? index + 1 : 0;
}


/**
 * 将原始拼图配置转换为运行时方块数据
 */
export function initializeBlocks(config: PuzzleConfig): BlockData[] {
  return config.blocks.map((block, index) => ({
    id: `block-${index}`,
    shape: block.shape,
    position: block.position,
    color: getColorByShape(block.shape),
  }));
}

/**
 * 验证所有拼图配置
 */
export function validateAllPuzzles(): void {
  Object.entries(PUZZLES).forEach(([slug, config]) => {
    try {
      validatePuzzleConfig(config);
    } catch (error) {
      console.error(`拼图配置验证失败: ${slug}`, error);
      throw error;
    }
  });
}

// 在模块加载时验证所有拼图
if (typeof window === 'undefined') {
  // 仅在服务端验证
  validateAllPuzzles();
}

