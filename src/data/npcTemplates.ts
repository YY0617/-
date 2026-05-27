export interface NPC {
  id: string;
  name: string;
  gender: 'male' | 'female';
  appearance: string;
  personality: string;
  background: string;
  currentRealm: number;
  currentSubLevel: number;
  cultivation: number;
  gold: number;
  location: string;
  status: 'cultivating' | 'exploring' | 'fighting' | 'resting' | 'socializing';
  traits: {
    greedy: number;
    kind: number;
    ambitious: number;
    social: number;
    brave: number;
  };
  relationships: {
    [npcId: string]: {
      trust: number;
      type: 'friend' | 'rival' | 'lover' | 'teacher' | 'student' | 'neutral';
    };
  };
  currentGoal: {
    type: 'cultivate' | 'explore' | 'find_treasure' | 'make_friend' | 'defeat_rival';
    target: string | null;
    progress: number;
    deadline: number;
  } | null;
  longTermGoal: string;
  memories: {
    [playerId: string]: {
      interactions: number;
      trust: number;
      lastMeeting: number;
      importantMoments: string[];
    };
  };
  lastActive: number;
  dailySchedule: {
    [time: string]: string;
  };
}

// 比武NPC名字池
const COMPETITOR_NAMES = [
  '张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十',
  '郑十一', '王十二', '冯十三', '陈十四', '褚十五', '卫十六',
  '慕容雪', '独孤剑', '林清风', '陈雨墨', '赵日天', '叶良辰',
  '龙傲宇', '凤舞天', '雷震天', '风逍遥', '云飞扬', '月无痕',
  '星陨落', '山巍峨', '水柔情', '火燎原', '土厚重', '木逢春'
];

const COMPETITOR_TITLES = [
  '初出茅庐', '江湖新秀', '武林新锐', '一方豪强', '名震一方',
  '威震江湖', '武林高手', '绝世强者', '一代宗师', '隐世高人'
];

// 生成随机比武对手
export interface CompetitionOpponent {
  id: string;
  name: string;
  title: string;
  realm: number;
  subLevel: number;
  stats: {
    attack: number;
    defense: number;
    hpMax: number;
    agility: number;
  };
  combatPower: number;
  difficulty: 'easy' | 'normal' | 'hard';
}

export function generateCompetitionOpponent(playerRealm: number, playerSubLevel: number, playerCombatPower: number): CompetitionOpponent {
  // 随机选择难度
  const difficulties: ('easy' | 'normal' | 'hard')[] = ['easy', 'normal', 'hard'];
  const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
  
  // 根据难度调整战力范围
  let powerMultiplier: number;
  if (difficulty === 'easy') {
    powerMultiplier = 0.7 + Math.random() * 0.2; // 0.7-0.9
  } else if (difficulty === 'normal') {
    powerMultiplier = 0.85 + Math.random() * 0.3; // 0.85-1.15
  } else {
    powerMultiplier = 1.1 + Math.random() * 0.3; // 1.1-1.4
  }
  
  // 境界范围：与玩家相差不超过1个大境界
  let opponentRealm = playerRealm;
  if (Math.random() > 0.6 && playerRealm > 0) {
    opponentRealm = playerRealm - 1;
  } else if (Math.random() > 0.7) {
    opponentRealm = playerRealm + 1;
  }
  
  // 副境界随机
  const opponentSubLevel = Math.floor(Math.random() * 4);
  
  // 计算对手战力
  const opponentCombatPower = Math.floor(playerCombatPower * powerMultiplier);
  
  // 根据战力分配属性
  const totalPoints = opponentCombatPower * 2;
  const attack = Math.floor(totalPoints * 0.35);
  const defense = Math.floor(totalPoints * 0.25);
  const hpMax = Math.floor(totalPoints * 0.3);
  const agility = Math.floor(totalPoints * 0.1);
  
  // 选择名字和称号
  const name = COMPETITOR_NAMES[Math.floor(Math.random() * COMPETITOR_NAMES.length)];
  const titleIndex = Math.min(opponentRealm, COMPETITOR_TITLES.length - 1);
  const title = COMPETITOR_TITLES[titleIndex];
  
  return {
    id: `opponent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    title,
    realm: opponentRealm,
    subLevel: opponentSubLevel,
    stats: { attack, defense, hpMax, agility },
    combatPower: opponentCombatPower,
    difficulty
  };
}

export const NPC_TEMPLATES: NPC[] = [
  {
    id: 'npc_ye_qing',
    name: '叶清',
    gender: 'female',
    appearance: '身着青衫，容貌秀丽，眉宇间有股英气',
    personality: '善良、坚毅、有正义感',
    background: '出身小宗门，父母早逝，独自修炼',
    currentRealm: 1,
    currentSubLevel: 0,
    cultivation: 100,
    gold: 50,
    location: '落叶山脉',
    status: 'exploring',
    traits: { greedy: 20, kind: 90, ambitious: 70, social: 60, brave: 80 },
    relationships: {},
    currentGoal: null,
    longTermGoal: '成为一代女侠，惩恶扬善',
    memories: {},
    lastActive: Date.now(),
    dailySchedule: {
      '06:00': '晨练修炼',
      '10:00': '探索山脉',
      '14:00': '回城补给',
      '18:00': '休息修炼',
      '22:00': '休息睡觉'
    }
  },
  {
    id: 'npc_chen_hao',
    name: '陈浩',
    gender: 'male',
    appearance: '身形高大，面容刚毅，眼神锐利',
    personality: '争强好胜、重情重义',
    background: '世家子弟，天赋异禀，但性格急躁',
    currentRealm: 2,
    currentSubLevel: 0,
    cultivation: 250,
    gold: 200,
    location: '黑炎岭',
    status: 'fighting',
    traits: { greedy: 40, kind: 60, ambitious: 90, social: 50, brave: 95 },
    relationships: {},
    currentGoal: null,
    longTermGoal: '超越所有同龄人，成为最强者',
    memories: {},
    lastActive: Date.now(),
    dailySchedule: {
      '05:00': '早起练剑',
      '09:00': '挑战妖兽',
      '13:00': '恢复修炼',
      '17:00': '自由活动',
      '21:00': '休息修炼'
    }
  },
  {
    id: 'npc_li_wan_er',
    name: '李婉儿',
    gender: 'female',
    appearance: '温柔婉约，容貌绝美，气质高雅',
    personality: '温柔善良、心思缜密',
    background: '书香门第之后，擅长炼丹和医术',
    currentRealm: 0,
    currentSubLevel: 9,
    cultivation: 95,
    gold: 100,
    location: '落叶城',
    status: 'socializing',
    traits: { greedy: 10, kind: 95, ambitious: 40, social: 85, brave: 50 },
    relationships: {},
    currentGoal: null,
    longTermGoal: '成为一代丹圣，救死扶伤',
    memories: {},
    lastActive: Date.now(),
    dailySchedule: {
      '07:00': '起床炼丹',
      '11:00': '坐堂看诊',
      '15:00': '药材采购',
      '19:00': '休息看书',
      '23:00': '休息睡觉'
    }
  },
  {
    id: 'npc_zhao_ming',
    name: '赵明',
    gender: 'male',
    appearance: '身材微胖，笑容满面，看起来很和善',
    personality: '圆滑世故、善于经营',
    background: '商人世家，精通经商之道',
    currentRealm: 1,
    currentSubLevel: 1,
    cultivation: 120,
    gold: 500,
    location: '落叶城',
    status: 'resting',
    traits: { greedy: 80, kind: 50, ambitious: 60, social: 90, brave: 30 },
    relationships: {},
    currentGoal: null,
    longTermGoal: '成为修炼界首富',
    memories: {},
    lastActive: Date.now(),
    dailySchedule: {
      '09:00': '开铺营业',
      '12:00': '四处闲逛',
      '15:00': '谈生意',
      '18:00': '休息算账',
      '22:00': '休息睡觉'
    }
  },
  {
    id: 'npc_sun_lei',
    name: '孙磊',
    gender: 'male',
    appearance: '皮肤黝黑，肌肉结实，一看就是练家子',
    personality: '憨厚老实、勤奋刻苦',
    background: '农家子弟，资质平庸但非常努力',
    currentRealm: 0,
    currentSubLevel: 5,
    cultivation: 55,
    gold: 20,
    location: '落叶城',
    status: 'cultivating',
    traits: { greedy: 15, kind: 75, ambitious: 50, social: 40, brave: 70 },
    relationships: {},
    currentGoal: null,
    longTermGoal: '光宗耀祖，让父母过上好日子',
    memories: {},
    lastActive: Date.now(),
    dailySchedule: {
      '05:00': '早起修炼',
      '10:00': '找份零工',
      '14:00': '继续修炼',
      '18:00': '吃饭休息',
      '21:00': '休息睡觉'
    }
  },
  {
    id: 'npc_lin_xiao',
    name: '林霄',
    gender: 'male',
    appearance: '面容俊朗，风度翩翩，自带一股书生气息',
    personality: '温文尔雅、才华横溢、好奇心强',
    background: '出身修炼世家，对古籍和古老遗迹有浓厚兴趣',
    currentRealm: 1,
    currentSubLevel: 5,
    cultivation: 180,
    gold: 300,
    location: '青云峰',
    status: 'exploring',
    traits: { greedy: 30, kind: 70, ambitious: 60, social: 75, brave: 55 },
    relationships: {},
    currentGoal: null,
    longTermGoal: '发现失落的修炼传承',
    memories: {},
    lastActive: Date.now(),
    dailySchedule: {
      '06:00': '晨练',
      '08:00': '研读古籍',
      '12:00': '休息用餐',
      '14:00': '探索遗迹',
      '18:00': '整理发现',
      '22:00': '休息'
    }
  },
  {
    id: 'npc_bai_luo',
    name: '白洛',
    gender: 'female',
    appearance: '肌肤胜雪，眉目如画，似有仙气萦绕',
    personality: '冷若冰霜、心地善良、不苟言笑',
    background: '冰系灵根，常年在冰魄湖修炼',
    currentRealm: 2,
    currentSubLevel: 2,
    cultivation: 320,
    gold: 250,
    location: '碧波湖',
    status: 'cultivating',
    traits: { greedy: 10, kind: 85, ambitious: 70, social: 30, brave: 60 },
    relationships: {},
    currentGoal: null,
    longTermGoal: '领悟冰系大道',
    memories: {},
    lastActive: Date.now(),
    dailySchedule: {
      '04:00': '冰下修炼',
      '10:00': '湖面吐纳',
      '14:00': '感悟天地',
      '18:00': '冥想',
      '22:00': '休息'
    }
  },
  {
    id: 'npc_wu_gan',
    name: '吴敢',
    gender: 'male',
    appearance: '凶神恶煞，一道刀疤从左额到右颊，看起来很吓人',
    personality: '外表粗犷、内心细腻、重情义',
    background: '曾是修炼界魔头，后来改邪归正',
    currentRealm: 3,
    currentSubLevel: 1,
    cultivation: 450,
    gold: 180,
    location: '清风谷',
    status: 'resting',
    traits: { greedy: 25, kind: 60, ambitious: 40, social: 45, brave: 90 },
    relationships: {},
    currentGoal: null,
    longTermGoal: '弥补过去的罪过',
    memories: {},
    lastActive: Date.now(),
    dailySchedule: {
      '06:00': '练拳',
      '10:00': '静思过',
      '14:00': '巡逻守护',
      '18:00': '晚餐',
      '22:00': '打坐感悟'
    }
  },
  {
    id: 'npc_xiao_xiao',
    name: '萧潇',
    gender: 'female',
    appearance: '活泼可爱，扎着双马尾，眼睛亮晶晶的',
    personality: '古灵精怪、喜欢恶作剧、但心地善良',
    background: '修炼界的小有名气的小偷，不过只偷坏人',
    currentRealm: 0,
    currentSubLevel: 7,
    cultivation: 80,
    gold: 120,
    location: '落叶城',
    status: 'socializing',
    traits: { greedy: 50, kind: 65, ambitious: 35, social: 80, brave: 40 },
    relationships: {},
    currentGoal: null,
    longTermGoal: '成为最厉害的神偷',
    memories: {},
    lastActive: Date.now(),
    dailySchedule: {
      '09:00': '踩点',
      '12:00': '吃饭',
      '14:00': '目标行动',
      '17:00': '收工',
      '20:00': '休息'
    }
  },
  {
    id: 'npc_huang_yu',
    name: '黄宇',
    gender: 'male',
    appearance: '衣着华贵，气宇轩昂，一看就是大人物',
    personality: '自视甚高、但讲原则、好面子',
    background: '皇族后裔，天生拥有皇室血脉',
    currentRealm: 2,
    currentSubLevel: 5,
    cultivation: 380,
    gold: 800,
    location: '落叶城',
    status: 'socializing',
    traits: { greedy: 45, kind: 40, ambitious: 95, social: 85, brave: 65 },
    relationships: {},
    currentGoal: null,
    longTermGoal: '恢复皇室荣光',
    memories: {},
    lastActive: Date.now(),
    dailySchedule: {
      '07:00': '晨练',
      '10:00': '处理事务',
      '14:00': '会客',
      '18:00': '修炼',
      '22:00': '休息'
    }
  },
  {
    id: 'npc_ning_cheng',
    name: '宁尘',
    gender: 'male',
    appearance: '一袭白衣，手持折扇，面如冠玉，气质出尘',
    personality: '温文尔雅、博学多才、风趣幽默',
    background: '隐世书香门第的公子，博览群书，通晓古今',
    currentRealm: 1,
    currentSubLevel: 8,
    cultivation: 200,
    gold: 350,
    location: '青云峰',
    status: 'socializing',
    traits: { greedy: 20, kind: 85, ambitious: 50, social: 70, brave: 30 },
    relationships: {},
    currentGoal: null,
    longTermGoal: '收集天下奇书',
    memories: {},
    lastActive: Date.now(),
    dailySchedule: {
      '07:00': '读书练字',
      '10:00': '拜访友人',
      '14:00': '藏书阁翻阅',
      '18:00': '品茶论道',
      '22:00': '休息'
    }
  },
  {
    id: 'npc_xue_lian',
    name: '雪莲',
    gender: 'female',
    appearance: '冰肌玉骨，一袭蓝裙，不食人间烟火',
    personality: '冷若冰霜、外冷内热、重情重义',
    background: '冰属性天灵根修士，修炼冰系功法',
    currentRealm: 3,
    currentSubLevel: 5,
    cultivation: 550,
    gold: 300,
    location: '碧波湖',
    status: 'cultivating',
    traits: { greedy: 15, kind: 75, ambitious: 60, social: 25, brave: 85 },
    relationships: {},
    currentGoal: null,
    longTermGoal: '登临绝顶，一览众山小',
    memories: {},
    lastActive: Date.now(),
    dailySchedule: {
      '05:00': '冰系吐纳',
      '09:00': '湖心修炼',
      '13:00': '领悟意境',
      '17:00': '静思打坐',
      '21:00': '休息'
    }
  },
  {
    id: 'npc_huo_yan',
    name: '霍炎',
    gender: 'male',
    appearance: '虎背熊腰，满脸横肉，脾气火爆',
    personality: '暴躁易怒、但义薄云天、爱憎分明',
    background: '铁匠出身，凭借火焰天赋成为炼器师',
    currentRealm: 2,
    currentSubLevel: 3,
    cultivation: 350,
    gold: 220,
    location: '黑炎岭',
    status: 'exploring',
    traits: { greedy: 55, kind: 45, ambitious: 75, social: 60, brave: 95 },
    relationships: {},
    currentGoal: null,
    longTermGoal: '打造出旷世神兵',
    memories: {},
    lastActive: Date.now(),
    dailySchedule: {
      '06:00': '淬炼体魄',
      '10:00': '寻找矿材',
      '14:00': '锻造练习',
      '18:00': '休息吃饭',
      '22:00': '休息'
    }
  },
  {
    id: 'npc_yin_su',
    name: '尹素',
    gender: 'female',
    appearance: '妩媚动人，举手投足间尽显风情',
    personality: '千娇百媚、心思缜密、亦正亦邪',
    background: '魅惑系功法修士，来历神秘',
    currentRealm: 1,
    currentSubLevel: 7,
    cultivation: 190,
    gold: 400,
    location: '落叶城',
    status: 'socializing',
    traits: { greedy: 70, kind: 30, ambitious: 90, social: 95, brave: 40 },
    relationships: {},
    currentGoal: null,
    longTermGoal: '掌控自己的命运',
    memories: {},
    lastActive: Date.now(),
    dailySchedule: {
      '09:00': '梳妆打扮',
      '12:00': '四处走走',
      '15:00': '收集情报',
      '19:00': '修炼功法',
      '23:00': '休息'
    }
  },
  {
    id: 'npc_wu_kong',
    name: '悟空',
    gender: 'male',
    appearance: '光头和尚打扮，但眼神狡黠',
    personality: '玩世不恭、看似不正经、实则大智若愚',
    background: '佛道双修的高人，隐藏身份游戏人间',
    currentRealm: 4,
    currentSubLevel: 9,
    cultivation: 1500,
    gold: 0,
    location: '清风谷',
    status: 'exploring',
    traits: { greedy: 30, kind: 90, ambitious: 20, social: 50, brave: 80 },
    relationships: {},
    currentGoal: null,
    longTermGoal: '普度众生',
    memories: {},
    lastActive: Date.now(),
    dailySchedule: {
      '05:00': '早课诵经',
      '09:00': '云游四方',
      '13:00': '化缘吃斋',
      '17:00': '打坐修行',
      '21:00': '休息'
    }
  },
  {
    id: 'npc_mei_mei',
    name: '梅梅',
    gender: 'female',
    appearance: '天真烂漫，背着小背篓，笑起来有两个小酒窝',
    personality: '单纯可爱、好奇心强、富有同情心',
    background: '药王谷的小弟子，对草药有天赋',
    currentRealm: 0,
    currentSubLevel: 4,
    cultivation: 45,
    gold: 80,
    location: '清风谷',
    status: 'exploring',
    traits: { greedy: 10, kind: 95, ambitious: 25, social: 90, brave: 20 },
    relationships: {},
    currentGoal: null,
    longTermGoal: '成为药王谷最厉害的药师',
    memories: {},
    lastActive: Date.now(),
    dailySchedule: {
      '07:00': '采药',
      '11:00': '晒药',
      '15:00': '配药',
      '19:00': '看书学习',
      '23:00': '休息'
    }
  },
  {
    id: 'npc_qin_long',
    name: '秦龙',
    gender: 'male',
    appearance: '身材魁梧，伤痕累累，目光如炬',
    personality: '沉默寡言、忠诚可靠、重情重义',
    background: '曾经是某个大宗门的护卫队长，后宗门被灭',
    currentRealm: 3,
    currentSubLevel: 7,
    cultivation: 650,
    gold: 100,
    location: '黑炎岭',
    status: 'cultivating',
    traits: { greedy: 25, kind: 60, ambitious: 40, social: 35, brave: 100 },
    relationships: {},
    currentGoal: null,
    longTermGoal: '为宗门复仇',
    memories: {},
    lastActive: Date.now(),
    dailySchedule: {
      '05:00': '拼命修炼',
      '10:00': '寻找仇敌线索',
      '14:00': '实战磨练',
      '18:00': '反思总结',
      '22:00': '休息'
    }
  },
  {
    id: 'npc_xiaoyao',
    name: '逍遥子',
    gender: 'male',
    appearance: '鹤发童颜，仙风道骨，逍遥自在',
    personality: '放荡不羁、游戏风尘、深藏不露',
    background: '神秘的散修强者，修为深不可测',
    currentRealm: 6,
    currentSubLevel: 9,
    cultivation: 5000,
    gold: 9999,
    location: '青云峰',
    status: 'resting',
    traits: { greedy: 5, kind: 80, ambitious: 10, social: 15, brave: 90 },
    relationships: {},
    currentGoal: null,
    longTermGoal: '逍遥天地间',
    memories: {},
    lastActive: Date.now(),
    dailySchedule: {
      '随兴': '随遇而安',
      '随缘': '游戏人间'
    }
  }
];

export const LOCATIONS = [
  '落叶城',
  '落叶山脉',
  '黑炎岭',
  '青云峰',
  '碧波湖',
  '清风谷'
];

export const STATUS_LABELS = {
  cultivating: '正在修炼',
  exploring: '探索中',
  fighting: '战斗中',
  resting: '休息中',
  socializing: '社交中'
};