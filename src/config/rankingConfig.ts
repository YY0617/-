/**
 * Ranking Config - 排行榜系统配置
 * NPC预设 + 动态变化排行榜
 */
import { randomPick, randomInt, generateId, randomFloat } from '../utils/gameUtils';

/**
 * 排行榜类型
 */
export type RankingType = 'potential' | 'combat' | 'wealth' | 'reputation' | 'cultivation';

/**
 * 排行榜NPC预设
 */
export interface RankingNPC {
  id: string;
  name: string;
  title: string;
  realm: number;
  realmName: string;
  subLevel: number;
  portrait: string;
  personality: string;
  
  // 初始属性
  initialStats: {
    potential?: number;
    combat?: number;
    wealth?: number;
    reputation?: number;
    cultivation?: number;
  };
  
  // 成长系数
  growthRate: number;
  
  // 背景故事
  backstory: string;
}

/**
 * 排行榜条目
 */
export interface RankingEntry {
  rank: number;
  name: string;
  title: string;
  realmName: string;
  value: number;
  change: number;  // 排名变化
  isPlayer: boolean;
  npcId?: string;
  realm?: number;
  subLevel?: number;
}

/**
 * 排行榜配置
 */
export interface RankingConfig {
  type: RankingType;
  name: string;
  description: string;
  icon: string;
  unit: string;
  refreshInterval: number;  // 刷新间隔（游戏天数）
}

/**
 * 境界名称映射
 */
const REALM_NAMES = ['煅体', '玄脉', '武心', '灵现', '凌虚', '悟道', '冠绝', '绝圣', '圣君', '君帝'];
const SUB_LEVELS = ['初期', '中期', '后期', '圆满'];

/**
 * 预设NPC池 - 按境界分组，使用原创玄幻风格名字
 */
const NPC_POOL_BY_REALM: Record<number, Omit<RankingNPC, 'id' | 'realm' | 'realmName' | 'subLevel' | 'initialStats' | 'growthRate'>[]> = {
  // 9: 君帝级别 - 最高境界，称号必须是帝、尊、天等
  9: [
    { name: '苍澜', title: '寰宇大帝', portrait: '👑', personality: '威严', backstory: '执掌寰宇，威压万古的至强者' },
    { name: '青冥', title: '青冥圣尊', portrait: '🌌', personality: '神秘', backstory: '来自青冥深处的古老存在' },
    { name: '焚寂', title: '炎天帝君', portrait: '🔥', personality: '霸道', backstory: '以火证道，焚尽九天' },
    { name: '沧澜', title: '沧澜天后', portrait: '🌊', personality: '清冷', backstory: '执掌水域法则的至高存在' },
    { name: '玄霄', title: '玄霄天尊', portrait: '⚡', personality: '孤傲', backstory: '雷道之祖，万雷俯首' },
    { name: '墨渊', title: '墨渊帝君', portrait: '🖤', personality: '深沉', backstory: '黑暗法则的掌控者' },
    { name: '紫宸', title: '紫宸女皇', portrait: '💜', personality: '高贵', backstory: '紫微星域的主宰' },
    { name: '鸿蒙', title: '鸿蒙圣祖', portrait: '✨', personality: '威严', backstory: '开天辟地的古老存在' },
  ],
  
  // 8: 圣君级别 - 次高境界
  8: [
    { name: '龙渊', title: '龙渊圣君', portrait: '🐉', personality: '霸气', backstory: '龙族至尊，威震诸天' },
    { name: '凤曦', title: '凤曦神女', portrait: '🦅', personality: '高贵', backstory: '凤凰之祖，浴火涅槃' },
    { name: '轩辕', title: '轩辕人皇', portrait: '🛡️', personality: '威严', backstory: '人族共主，守护苍生' },
    { name: '幽冥', title: '幽冥圣君', portrait: '💀', personality: '阴狠', backstory: '执掌幽冥，号令亡灵' },
    { name: '剑尘', title: '剑尘剑圣', portrait: '🗡️', personality: '孤傲', backstory: '剑道巅峰，一剑破万法' },
    { name: '云渺', title: '云渺仙尊', portrait: '☁️', personality: '飘逸', backstory: '云端之上的逍遥圣者' },
    { name: '星辰', title: '星辰圣主', portrait: '⭐', personality: '深邃', backstory: '星辰法则的掌控者' },
  ],
  
  // 7: 绝圣级别 - 圣人级别
  7: [
    { name: '丹辰', title: '丹辰丹圣', portrait: '⚗️', personality: '温婉', backstory: '丹道第一人，九转仙丹随手炼' },
    { name: '阵玄', title: '阵玄阵圣', portrait: '🔲', personality: '沉稳', backstory: '阵法通神，困天锁地' },
    { name: '器灵', title: '器灵器圣', portrait: '⚙️', personality: '执着', backstory: '炼器无双，神器自手中生' },
    { name: '智玄', title: '智玄智圣', portrait: '🧠', personality: '睿智', backstory: '智谋无双，算无遗策' },
    { name: '符渊', title: '符渊符圣', portrait: '📜', personality: '灵动', backstory: '符文之道，出神入化' },
    { name: '道衍', title: '道衍道圣', portrait: '📖', personality: '飘逸', backstory: '道家圣人，清静无为' },
    { name: '儒风', title: '儒风儒圣', portrait: '🎓', personality: '儒雅', backstory: '儒家圣人，教化万民' },
  ],
  
  // 6: 冠绝级别 - 顶级高手
  6: [
    { name: '雷震天', title: '雷震天君', portrait: '⚡', personality: '暴躁', backstory: '掌控雷霆，万雷俯首' },
    { name: '水灵', title: '水灵水尊', portrait: '🌊', personality: '柔美', backstory: '碧波仙子，行云布雨' },
    { name: '炎昊', title: '炎昊火尊', portrait: '🔥', personality: '火爆', backstory: '焚天煮海，烈焰滔天' },
    { name: '青木', title: '青木木尊', portrait: '🌲', personality: '温和', backstory: '生机无限，枯木逢春' },
    { name: '磐石', title: '磐石土尊', portrait: '🏔️', personality: '厚重', backstory: '大地之子，稳如泰山' },
    { name: '鲲鹏', title: '鲲鹏大圣', portrait: '🐋', personality: '威严', backstory: '北冥有鱼，其名为鲲' },
    { name: '麒麟', title: '麒麟圣王', portrait: '🦄', personality: '高贵', backstory: '麒麟一族，祥瑞之兽' },
  ],
  
  // 5: 悟道级别 - 悟道境界
  5: [
    { name: '云飞', title: '云飞仙尊', portrait: '☁️', personality: '飘逸', backstory: '驾云而行，逍遥天地' },
    { name: '风痕', title: '风痕风君', portrait: '🌪️', personality: '洒脱', backstory: '来无影去无踪，追风逐电' },
    { name: '星极', title: '星极星主', portrait: '⭐', personality: '深邃', backstory: '观星悟道，执掌星辰' },
    { name: '辰萱', title: '辰萱辰仙', portrait: '🌠', personality: '神秘', backstory: '来自星空深处的传承' },
    { name: '梦无涯', title: '梦无涯梦尊', portrait: '💤', personality: '梦幻', backstory: '一梦千年，梦中证道' },
    { name: '鬼谋', title: '鬼谋谋圣', portrait: '🕵️', personality: '神秘', backstory: '谋略无双，纵横捭阖' },
    { name: '黄石', title: '黄石隐士', portrait: '🏡', personality: '淡泊', backstory: '深山隐士，洞察天机' },
  ],
  
  // 4: 凌虚级别 - 凌空而行
  4: [
    { name: '寒江', title: '寒江冰仙', portrait: '❄️', personality: '冰冷', backstory: '极北冰原的守护者' },
    { name: '赤练', title: '赤练毒仙', portrait: '🐍', personality: '妖娆', backstory: '万毒缠身，百毒不侵' },
    { name: '金鹏', title: '金鹏鹏王', portrait: '🐦', personality: '高傲', backstory: '金翅大鹏，一飞冲天' },
    { name: '九幽', title: '九幽魔女', portrait: '😈', personality: '邪魅', backstory: '来自九幽之地的魔女' },
    { name: '玉书', title: '玉书儒仙', portrait: '📚', personality: '儒雅', backstory: '以文入道，笔墨诛心' },
    { name: '百花', title: '百花花仙', portrait: '🌸', personality: '娇媚', backstory: '百花之主，芳香四溢' },
    { name: '酒仙', title: '酒仙醉圣', portrait: '🍶', personality: '洒脱', backstory: '仗剑天涯，醉卧红尘' },
  ],
  
  // 3: 灵现级别 - 年轻天才
  3: [
    { name: '玲珑', title: '玲珑灵童', portrait: '👧', personality: '纯真', backstory: '天生灵体，悟性超凡' },
    { name: '虎娃', title: '虎娃兽王', portrait: '🐯', personality: '勇猛', backstory: '蛮荒之地的兽王转世' },
    { name: '九尾', title: '九尾狐仙', portrait: '🦊', personality: '妩媚', backstory: '九尾狐族，魅惑众生' },
    { name: '玄武', title: '玄武传人', portrait: '🐢', personality: '沉稳', backstory: '玄武神兽转世，防御无双' },
    { name: '朱雀', title: '朱雀化身', portrait: '🐦‍🔥', personality: '灵动', backstory: '朱雀神火，焚尽万物' },
    { name: '青龙', title: '青龙传人', portrait: '🐉', personality: '威严', backstory: '青龙血脉，威震四方' },
    { name: '白虎', title: '白虎圣女', portrait: '🐅', personality: '勇猛', backstory: '白虎之体，杀伐果断' },
  ],
  
  // 2: 武心级别 - 年轻高手
  2: [
    { name: '陈凡', title: '陈凡奇才', portrait: '🧑', personality: '坚毅', backstory: '出身平凡，却有逆天机缘' },
    { name: '苏灵', title: '苏灵天才', portrait: '👧', personality: '聪慧', backstory: '百年难遇的修炼天才' },
    { name: '赵天', title: '赵天天骄', portrait: '🗡️', personality: '傲气', backstory: '大宗门的天才弟子' },
    { name: '林韵', title: '林韵医女', portrait: '💊', personality: '善良', backstory: '传承古老医道' },
    { name: '王小虎', title: '王小虎少年', portrait: '🧑', personality: '淳朴', backstory: '深山少年，偶获奇遇' },
    { name: '燕赤', title: '燕赤剑客', portrait: '⚔️', personality: '正义', backstory: '斩妖除魔，守护苍生' },
    { name: '聂小', title: '聂小倩女', portrait: '👻', personality: '痴情', backstory: '千年狐妖，渴望真情' },
  ],
  
  // 1: 玄脉级别 - 宗门弟子
  1: [
    { name: '周川', title: '周川外门', portrait: '🧑', personality: '勤奋', backstory: '宗门普通弟子，刻苦修炼' },
    { name: '吴青', title: '吴青侍女', portrait: '👧', personality: '伶俐', backstory: '仙门侍女，渴望修仙' },
    { name: '郑牛', title: '郑牛药童', portrait: '🧑', personality: '憨厚', backstory: '丹药房的小童' },
    { name: '赵灵', title: '赵灵内门', portrait: '👧', personality: '聪慧', backstory: '宗门内门弟子' },
    { name: '钱宝', title: '钱宝杂役', portrait: '🧑', personality: '机灵', backstory: '宗门杂役，心怀大志' },
    { name: '孙红', title: '孙红厨娘', portrait: '👧', personality: '勤劳', backstory: '膳房厨娘，暗藏灵根' },
  ],
  
  // 0: 煅体级别 - 初学者
  0: [
    { name: '石头', title: '石头杂役', portrait: '🧑', personality: '老实', backstory: '宗门杂役，默默修炼' },
    { name: '柳月', title: '柳月厨娘', portrait: '👧', personality: '勤劳', backstory: '膳房厨娘，暗藏灵根' },
    { name: '赵铁', title: '赵铁矿工', portrait: '⛏️', personality: '憨厚', backstory: '矿场矿工，力大无穷' },
    { name: '李花', title: '李花采药', portrait: '🌿', personality: '善良', backstory: '山野少女，精通草药' },
    { name: '张狗', title: '张狗猎户', portrait: '🏹', personality: '勇猛', backstory: '山村猎户，身手矫健' },
  ],
};

/**
 * 排行榜配置
 */
export const RANKING_CONFIGS: RankingConfig[] = [
  { type: 'potential', name: '潜龙榜', description: '年轻一代潜力排名', icon: '', unit: '潜力值', refreshInterval: 7 },
  { type: 'combat', name: '风云榜', description: '按战斗力排名', icon: '', unit: '战力值', refreshInterval: 3 },
  { type: 'wealth', name: '聚宝榜', description: '按灵石持有量排名', icon: '', unit: '灵石', refreshInterval: 7 },
  { type: 'reputation', name: '声望榜', description: '按江湖声望排名', icon: '', unit: '声望', refreshInterval: 7 },
  { type: 'cultivation', name: '问道榜', description: '按境界+修为排名', icon: '', unit: '修为', refreshInterval: 3 },
];

/**
 * 生成境界名称
 */
function getRealmName(realm: number, subLevel: number): string {
  return REALM_NAMES[realm] + SUB_LEVELS[subLevel] || '未知';
}

/**
 * 生成排行榜NPC - 根据指定境界生成
 */
export function generateRankingNPC(realm: number): RankingNPC {
  const pool = NPC_POOL_BY_REALM[realm] || NPC_POOL_BY_REALM[0];
  const npcTemplate = randomPick(pool);
  const subLevel = randomInt(0, 3);
  
  return {
    id: generateId('npc_'),
    name: npcTemplate.name,
    title: npcTemplate.title,
    realm,
    realmName: getRealmName(realm, subLevel),
    subLevel,
    portrait: npcTemplate.portrait,
    personality: npcTemplate.personality,
    initialStats: {
      potential: randomInt(1000, 10000),
      combat: randomInt(500, 5000),
      wealth: randomInt(100, 10000),
      reputation: randomInt(50, 5000),
      cultivation: randomInt(1000, 100000),
    },
    growthRate: 0.8 + Math.random() * 0.4,  // 0.8 - 1.2
    backstory: npcTemplate.backstory,
  };
}

/**
 * 计算NPC潜力值
 */
export function calculatePotential(stats: {
  lingen: number;
  intelligence: number;
  luck: number;
  realm: number;
}): number {
  return Math.floor(
    stats.intelligence * 10 +
    stats.luck * 5 +
    stats.realm * 100 +
    stats.lingen * 50
  );
}

/**
 * 计算NPC战斗力
 */
export function calculateNPCCombat(stats: {
  attack: number;
  defense: number;
  hpMax: number;
  agility: number;
  realm: number;
}): number {
  return Math.floor(
    stats.attack * 1.5 +
    stats.defense * 1.2 +
    (stats.hpMax / 100) * 0.5 +
    stats.agility * 0.8 +
    stats.realm * 50
  );
}

/**
 * 生成完整排行榜
 */
export function generateRanking(
  type: RankingType,
  npcCount: number,
  playerStats?: {
    name: string;
    title?: string;
    realmName: string;
    value: number;
    realm?: number;
    subLevel?: number;
  },
  existingNPCs?: RankingNPC[]
): RankingEntry[] {
  // 根据类型确定境界范围
  const realmRanges: Record<RankingType, [number, number]> = {
    potential: [0, 4],      // 潜龙榜：年轻一代，境界限制在灵现境及以下
    combat: [4, 9],         // 风云榜：战斗力排名，较高境界
    wealth: [1, 9],         // 聚宝榜：财富排名，各境界都有
    reputation: [2, 9],     // 声望榜：声望排名，中等以上境界
    cultivation: [3, 9],    // 问道榜：修为排名，灵现境及以上
  };
  const [minRealm, maxRealm] = realmRanges[type];
  
  // 生成或使用现有NPC，确保不重复
  const usedNames = new Set<string>();
  const npcs: RankingNPC[] = [];
  
  // 使用现有NPC（如果提供）
  if (existingNPCs) {
    for (const npc of existingNPCs) {
      if (!usedNames.has(npc.name) && npc.realm >= minRealm && npc.realm <= maxRealm) {
        npcs.push(npc);
        usedNames.add(npc.name);
      }
    }
  }
  
  // 生成新NPC，确保同个榜单不会有重复名字的NPC
  while (npcs.length < npcCount) {
    // 根据境界范围随机选择境界
    const realm = randomInt(minRealm, Math.min(maxRealm, 9));
    const pool = NPC_POOL_BY_REALM[realm] || NPC_POOL_BY_REALM[0];
    
    // 过滤掉已使用的名字
    const availableTemplates = pool.filter(t => !usedNames.has(t.name));
    
    if (availableTemplates.length === 0) {
      // 如果当前境界的NPC都用完了，尝试其他境界
      continue;
    }
    
    const npcTemplate = randomPick(availableTemplates);
    usedNames.add(npcTemplate.name);
    
    npcs.push({
      id: generateId('npc_'),
      name: npcTemplate.name,
      title: npcTemplate.title,
      realm,
      realmName: getRealmName(realm, randomInt(0, 3)),
      subLevel: randomInt(0, 3),
      portrait: npcTemplate.portrait,
      personality: npcTemplate.personality,
      initialStats: {
        potential: randomInt(1000, 10000),
        combat: randomInt(500, 5000),
        wealth: randomInt(100, 10000),
        reputation: randomInt(50, 5000),
        cultivation: randomInt(1000, 100000),
      },
      growthRate: 0.8 + Math.random() * 0.4,
      backstory: npcTemplate.backstory,
    });
  }
  
  // 计算每个NPC的排名值
  const entries: RankingEntry[] = npcs.map((npc, index) => {
    const initialStat = npc.initialStats[type];
    const growthBonus = npc.growthRate * (Date.now() % 1000) / 100;
    
    let value: number;
    if (type === 'cultivation') {
      // 问道榜：严格按照境界+修为排名，境界低的绝对不能高过境界高的
      // 境界权重 = 境界 * 10000000 + 子境界 * 1000000 + 修为值
      // 使用更大的权重差距确保境界高的一定排在前面
      const realmBonus = npc.realm * 10000000 + npc.subLevel * 1000000;
      const cultivationValue = Math.floor((initialStat || 0) * (1 + growthBonus / 100));
      value = realmBonus + cultivationValue;
    } else if (type === 'potential') {
      // 潜龙榜：年轻一代潜力，潜力值为主
      value = Math.floor((initialStat || 0) * (1 + growthBonus / 100));
    } else {
      value = Math.floor((initialStat || 0) * (1 + growthBonus / 100));
    }
    
    return {
      rank: index + 1,
      name: npc.name,
      title: npc.title,
      realmName: npc.realmName,
      value,
      change: randomInt(-3, 3),
      isPlayer: false,
      npcId: npc.id,
      realm: npc.realm,
      subLevel: npc.subLevel,
    };
  });
  
  // 添加玩家条目
  if (playerStats) {
    let playerValue: number;
    if (type === 'cultivation' && playerStats.realm !== undefined) {
      // 玩家问道榜：同样加入境界权重，确保境界低的不能高过境界高的
      const realmBonus = playerStats.realm * 10000000 + (playerStats.subLevel || 0) * 1000000;
      playerValue = realmBonus + playerStats.value;
    } else {
      playerValue = playerStats.value;
    }
    
    entries.push({
      rank: 0,
      name: playerStats.name,
      title: playerStats.title || '',
      realmName: playerStats.realmName,
      value: playerValue,
      change: 0,
      isPlayer: true,
      realm: playerStats.realm,
      subLevel: playerStats.subLevel,
    });
  }
  
  // 按值排序（问道榜已通过境界权重确保境界高的在前）
  entries.sort((a, b) => b.value - a.value);
  
  // 重新分配排名
  entries.forEach((entry, index) => {
    entry.rank = index + 1;
  });
  
  return entries;
}

/**
 * 更新排行榜（动态变化）
 */
export function updateRanking(entries: RankingEntry[], daysElapsed: number): RankingEntry[] {
  // 记录已使用的名字，确保更新后同个榜单不会有重复NPC
  const usedNames = new Set<string>();
  
  return entries.map(entry => {
    if (entry.isPlayer) {
      usedNames.add(entry.name);
      return entry;
    }
    
    // 检查名字是否已被使用
    if (usedNames.has(entry.name)) {
      // 如果重复，生成新的NPC
      const pool = NPC_POOL_BY_REALM[entry.realm || 0] || NPC_POOL_BY_REALM[0];
      const availableTemplates = pool.filter(t => !usedNames.has(t.name));
      
      if (availableTemplates.length > 0) {
        const newTemplate = randomPick(availableTemplates);
        usedNames.add(newTemplate.name);
        return {
          ...entry,
          name: newTemplate.name,
          title: newTemplate.title,
          portrait: newTemplate.portrait as any,
        };
      }
    }
    
    usedNames.add(entry.name);
    
    // 每天随机变化
    const dailyChange = randomFloat(-50, 100) * daysElapsed;
    const growthRate = 0.8 + Math.random() * 0.4;
    
    let newValue = Math.max(0, entry.value + Math.floor(dailyChange * growthRate));
    
    // 对于问道榜，保持境界权重不变，只调整修为部分
    if (entry.realm !== undefined && entry.subLevel !== undefined) {
      const realmBonus = entry.realm * 10000000 + entry.subLevel * 1000000;
      newValue = realmBonus + Math.max(0, newValue - realmBonus);
    }
    
    return {
      ...entry,
      value: newValue,
      change: randomInt(-2, 2),
    };
  });
}