// 剧情系统数据 - 玄幻世界观

export interface StoryNode {
  id: string;
  title: string;
  content: string;
  choices?: StoryChoice[];
  nextNode?: string;
  requiredRealm?: number;
  requiredBackground?: 'sect' | 'master' | 'solo' | 'family';
  rewards?: {
    gold?: number;
    cultivation?: number;
    talentPoints?: number;
  };
}

export interface StoryChoice {
  text: string;
  nextNode: string;
  consequence?: 'good' | 'neutral' | 'bad';
}

// 通用剧情（所有背景都适用）
export const UNIVERSAL_STORY: Record<string, StoryNode> = {
  'universal_start': {
    id: 'universal_start',
    title: '第一章：初入玄幻大世界',
    content: '天玄大陆，万族林立，诸强并起，你是这个时代的天选之子，身负奇异的开始书写属于你的传奇！',
    choices: [
      { text: '探查周身异变', nextNode: 'universal_investigate', consequence: 'neutral' }
    ],
    rewards: { cultivation: 100 }
  },
  'universal_investigate': {
    id: 'universal_investigate',
    title: '奇异初露锋芒',
    content: '你发现自己体内有特殊的能力，这是你在这个玄幻世界生存的资本！',
    nextNode: 'universal_grow',
    rewards: { gold: 50, cultivation: 80 }
  },
  'universal_grow': {
    id: 'universal_grow',
    title: '变强之路',
    content: '这个世界以实力为尊，只有不断变强，才能活得更好！',
    choices: [
      { text: '继续变强', nextNode: 'universal_power', consequence: 'good' }
    ],
    rewards: { cultivation: 150 }
  },
  'universal_power': {
    id: 'universal_power',
    title: '实力提升',
    content: '你在这个世界，你的实力是王道！',
    nextNode: 'universal_chapter2_start',
    rewards: { gold: 100, cultivation: 200 }
  },
  'universal_chapter2_start': {
    id: 'universal_chapter2_start',
    title: '第二章：天玄风云',
    content: '天玄大陆风起云涌，各种机缘与危机并存！',
    requiredRealm: 1,
    choices: [
      { text: '抓住机缘', nextNode: 'universal_chance', consequence: 'good' }
    ],
    rewards: { cultivation: 200 }
  },
  'universal_chance': {
    id: 'universal_chance',
    title: '奇遇不断',
    content: '你遇到了各种奇遇！',
    nextNode: 'universal_chapter2_end',
    rewards: { gold: 300, cultivation: 400 }
  },
  'universal_chapter2_end': {
    id: 'universal_chapter2_end',
    title: '第二章完',
    content: '你的名声渐起！',
    choices: [
      { text: '继续征程', nextNode: 'universal_chapter3_start', consequence: 'good' }
    ]
  },
  'universal_chapter3_start': {
    id: 'universal_chapter3_start',
    title: '第三章：名扬天玄',
    content: '你在天玄大陆崭露头角！',
    requiredRealm: 2,
    choices: [
      { text: '继续前行', nextNode: 'universal_fame', consequence: 'good' }
    ],
    rewards: { cultivation: 300 }
  },
  'universal_fame': {
    id: 'universal_fame',
    title: '名扬四海',
    content: '你的名字逐渐传开！',
    nextNode: 'universal_chapter3_end',
    rewards: { gold: 500, cultivation: 600, talentPoints: 1 }
  },
  'universal_chapter3_end': {
    id: 'universal_chapter3_end',
    title: '第三章完',
    content: '你的时代来临！',
    choices: [
      { text: '登峰造极', nextNode: 'universal_chapter4_start', consequence: 'good' }
    ]
  },
  'universal_chapter4_start': {
    id: 'universal_chapter4_start',
    title: '第四章：巅峰之路',
    content: '你走在巅峰的道路上！',
    requiredRealm: 3,
    choices: [
      { text: '追求极致', nextNode: 'universal_peak', consequence: 'good' }
    ],
    rewards: { cultivation: 400 }
  },
  'universal_peak': {
    id: 'universal_peak',
    title: '登峰造极',
    content: '你站在更高的层次！',
    nextNode: 'universal_chapter4_end',
    rewards: { gold: 800, cultivation: 800, talentPoints: 1 }
  },
  'universal_chapter4_end': {
    id: 'universal_chapter4_end',
    title: '第四章完',
    content: '你成为传说！',
    choices: [
      { text: '继续', nextNode: 'universal_chapter5_start', consequence: 'good' }
    ]
  },
  'universal_chapter5_start': {
    id: 'universal_chapter5_start',
    title: '第五章：传说诞生',
    content: '你成为天玄大陆的传说！',
    requiredRealm: 5,
    choices: [
      { text: '成为传说', nextNode: 'universal_legend', consequence: 'good' }
    ],
    rewards: { cultivation: 500 }
  },
  'universal_legend': {
    id: 'universal_legend',
    title: '传说诞生',
    content: '你的名字将永远铭刻在天玄大陆的历史上！',
    nextNode: 'universal_end',
    rewards: { gold: 1500, cultivation: 1500, talentPoints: 2 }
  },
  'universal_end': {
    id: 'universal_end',
    title: '第五章完',
    content: '恭喜你！你是天玄大陆的传说！',
    rewards: { gold: 3000, cultivation: 3000, talentPoints: 3 }
  }
};

// 宗门背景专属剧情
export const SECT_STORY: Record<string, StoryNode> = {
  'sect_start': {
    id: 'sect_start',
    title: '宗门之路',
    content: '你进入宗门，开始你的宗门生涯！',
    requiredBackground: 'sect',
    choices: [
      { text: '努力修炼', nextNode: 'sect_train', consequence: 'good' },
      { text: '拉拢关系', nextNode: 'sect_network', consequence: 'neutral' }
    ],
    rewards: { cultivation: 150 }
  },
  'sect_train': {
    id: 'sect_train',
    title: '宗门修炼',
    content: '你在宗门努力修炼，进展神速！',
    nextNode: 'sect_contribute',
    rewards: { gold: 100, cultivation: 200 }
  },
  'sect_network': {
    id: 'sect_network',
    title: '宗门交际',
    content: '你在宗门结交了不少人脉！',
    nextNode: 'sect_contribute',
    rewards: { gold: 150, cultivation: 100 }
  },
  'sect_contribute': {
    id: 'sect_contribute',
    title: '宗门贡献',
    content: '你为宗门做出了贡献，获得了丰厚奖励！',
    nextNode: 'sect_end',
    rewards: { gold: 200, cultivation: 300, talentPoints: 1 }
  },
  'sect_end': {
    id: 'sect_end',
    title: '宗门剧情完',
    content: '你在宗门地位日益重要！',
    choices: [
      { text: '继续宗门之路', nextNode: 'universal_chapter2_start', consequence: 'good' }
    ]
  }
};

// 师父背景专属剧情
export const MASTER_STORY: Record<string, StoryNode> = {
  'master_start': {
    id: 'master_start',
    title: '师徒之情',
    content: '师父对你倾囊相授！',
    requiredBackground: 'master',
    choices: [
      { text: '勤学苦练', nextNode: 'master_learn', consequence: 'good' },
      { text: '孝敬师父', nextNode: 'master_respect', consequence: 'good' }
    ],
    rewards: { cultivation: 150 }
  },
  'master_learn': {
    id: 'master_learn',
    title: '刻苦学习',
    content: '你从师父那里学到了真传！',
    nextNode: 'master_success',
    rewards: { cultivation: 300 }
  },
  'master_respect': {
    id: 'master_respect',
    title: '师徒情深',
    content: '师父被你的孝心打动！',
    nextNode: 'master_success',
    rewards: { gold: 200, cultivation: 200 }
  },
  'master_success': {
    id: 'master_success',
    title: '师父欣慰',
    content: '你没有让师父失望！',
    nextNode: 'master_end',
    rewards: { gold: 250, cultivation: 350, talentPoints: 1 }
  },
  'master_end': {
    id: 'master_end',
    title: '师父剧情完',
    content: '师徒情谊，感人肺腑！',
    choices: [
      { text: '继续变强', nextNode: 'universal_chapter2_start', consequence: 'good' }
    ]
  }
};

// 独行背景专属剧情
export const SOLO_STORY: Record<string, StoryNode> = {
  'solo_start': {
    id: 'solo_start',
    title: '独行江湖',
    content: '你一人一剑，独步天下！',
    requiredBackground: 'solo',
    choices: [
      { text: '探索秘境', nextNode: 'solo_explore', consequence: 'good' },
      { text: '挑战强者', nextNode: 'solo_challenge', consequence: 'good' }
    ],
    rewards: { cultivation: 150 }
  },
  'solo_explore': {
    id: 'solo_explore',
    title: '秘境奇遇',
    content: '你探索秘境，获得了意外的机缘！',
    nextNode: 'solo_treasure',
    rewards: { gold: 200, cultivation: 300 }
  },
  'solo_challenge': {
    id: 'solo_challenge',
    title: '挑战强者',
    content: '你挑战各路强者，实力大增！',
    nextNode: 'solo_treasure',
    rewards: { gold: 150, cultivation: 350 }
  },
  'solo_treasure': {
    id: 'solo_treasure',
    title: '得宝而归',
    content: '你收获满满！',
    nextNode: 'solo_end',
    rewards: { gold: 300, cultivation: 400, talentPoints: 1 }
  },
  'solo_end': {
    id: 'solo_end',
    title: '独行剧情完',
    content: '独来独往，快意恩仇！',
    choices: [
      { text: '继续独行', nextNode: 'universal_chapter2_start', consequence: 'good' }
    ]
  }
};

// 家族背景专属剧情
export const FAMILY_STORY: Record<string, StoryNode> = {
  'family_start': {
    id: 'family_start',
    title: '家族荣耀',
    content: '家族的希望寄托在你身上！',
    requiredBackground: 'family',
    choices: [
      { text: '光耀门楣', nextNode: 'family_glory', consequence: 'good' },
      { text: '守护家族', nextNode: 'family_protect', consequence: 'good' }
    ],
    rewards: { cultivation: 150 }
  },
  'family_glory': {
    id: 'family_glory',
    title: '光宗耀祖',
    content: '你为家族争光！',
    nextNode: 'family_reward',
    rewards: { gold: 300, cultivation: 200 }
  },
  'family_protect': {
    id: 'family_protect',
    title: '守护家族',
    content: '你守护了家族！',
    nextNode: 'family_reward',
    rewards: { gold: 200, cultivation: 300 }
  },
  'family_reward': {
    id: 'family_reward',
    title: '家族奖励',
    content: '家族给了你丰厚的奖励！',
    nextNode: 'family_end',
    rewards: { gold: 400, cultivation: 350, talentPoints: 1 }
  },
  'family_end': {
    id: 'family_end',
    title: '家族剧情完',
    content: '你是家族的骄傲！',
    choices: [
      { text: '继续前行', nextNode: 'universal_chapter2_start', consequence: 'good' }
    ]
  }
};

// 合并所有剧情
export const STORY_DATA: Record<string, StoryNode> = {
  ...UNIVERSAL_STORY,
  ...SECT_STORY,
  ...MASTER_STORY,
  ...SOLO_STORY,
  ...FAMILY_STORY
};
