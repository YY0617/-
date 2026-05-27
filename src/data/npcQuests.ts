import { NPC } from './npcTemplates';

export interface NPCQuest {
  id: string;
  npcId: string;
  title: string;
  description: string;
  type: 'fetch' | 'kill' | 'escort' | 'talk' | 'explore';
  objectives: {
    type: string;
    target: string;
    count: number;
    current: number;
  }[];
  rewards: {
    gold?: number;
    exp?: number;
    item?: string;
    reputation?: number;
  };
  requirements: {
    realm?: number;
    npcTrust?: number;
    completedQuests?: string[];
  };
  repeatable: boolean;
  active: boolean;
  isChain: boolean;
  nextQuest?: string;
}

export const NPC_QUEST_TEMPLATES: NPCQuest[] = [
  {
    id: 'npc_quest_yeqing_1',
    npcId: 'npc_ye_qing',
    title: '采药求助',
    description: '叶清需要一些草药来炼制丹药，需要你帮忙寻找',
    type: 'fetch',
    objectives: [
      { type: 'collect', target: '草药', count: 5, current: 0 }
    ],
    rewards: { gold: 50, exp: 100 },
    requirements: {},
    repeatable: false,
    active: true,
    isChain: true,
    nextQuest: 'npc_quest_yeqing_2',
  },
  {
    id: 'npc_quest_yeqing_2',
    npcId: 'npc_ye_qing',
    title: '妖兽之祸',
    description: '最近有妖兽在落叶山脉作乱，需要有人去教训一下',
    type: 'kill',
    objectives: [
      { type: 'kill', target: '妖兽', count: 3, current: 0 }
    ],
    rewards: { gold: 100, exp: 200 },
    requirements: { realm: 1 },
    repeatable: false,
    active: false,
    isChain: true,
    nextQuest: 'npc_quest_yeqing_3',
  },
  {
    id: 'npc_quest_yeqing_3',
    npcId: 'npc_ye_qing',
    title: '传承之道',
    description: '叶清发现了一处遗迹，想让你帮忙一起探索',
    type: 'explore',
    objectives: [
      { type: 'explore', target: '神秘遗迹', count: 1, current: 0 }
    ],
    rewards: { gold: 300, exp: 400, item: '叶清的传承' },
    requirements: { realm: 2 },
    repeatable: false,
    active: false,
    isChain: true,
    nextQuest: undefined,
  },

  {
    id: 'npc_quest_chenhao_1',
    npcId: 'npc_chen_hao',
    title: '切磋',
    description: '陈浩想和你切磋一下，看看你的实力',
    type: 'talk',
    objectives: [
      { type: 'talk', target: '与陈浩切磋', count: 1, current: 0 }
    ],
    rewards: { gold: 80, exp: 150 },
    requirements: {},
    repeatable: true,
    active: true,
    isChain: false,
    nextQuest: undefined,
  },

  {
    id: 'npc_quest_liwaner_1',
    npcId: 'npc_li_waner',
    title: '医术传承',
    description: '李婉儿想教你一些基础医术',
    type: 'talk',
    objectives: [
      { type: 'talk', target: '学习医术', count: 1, current: 0 }
    ],
    rewards: { gold: 60, exp: 120, item: '基础丹方' },
    requirements: {},
    repeatable: false,
    active: true,
    isChain: true,
    nextQuest: 'npc_quest_liwaner_2',
  },
  {
    id: 'npc_quest_liwaner_2',
    npcId: 'npc_li_waner',
    title: '药铺帮忙',
    description: '药铺需要人帮忙照看一下',
    type: 'talk',
    objectives: [
      { type: 'talk', target: '帮忙10次', count: 10, current: 0 }
    ],
    rewards: { gold: 200, exp: 350 },
    requirements: { realm: 1 },
    repeatable: false,
    active: false,
    isChain: true,
    nextQuest: undefined,
  },

  {
    id: 'npc_quest_zhaoming_1',
    npcId: 'npc_zhao_ming',
    title: '生意委托',
    description: '赵明有些货物需要你帮忙运送',
    type: 'escort',
    objectives: [
      { type: 'escort', target: '货物', count: 1, current: 0 }
    ],
    rewards: { gold: 150, exp: 180 },
    requirements: {},
    repeatable: true,
    active: true,
    isChain: false,
    nextQuest: undefined,
  },
];

export function getAvailableQuestsForNPC(npc: NPC, playerStats: any, completedQuests: string[]): NPCQuest[] {
  return NPC_QUEST_TEMPLATES.filter(quest => {
    if (quest.npcId !== npc.id) return false;
    if (!quest.active) return false;
    
    // 检查境界要求
    if (quest.requirements.realm && playerStats.realm < quest.requirements.realm) return false;
    
    // 检查前置任务
    if (quest.requirements.completedQuests) {
      const hasAll = quest.requirements.completedQuests.every(q => completedQuests.includes(q));
      if (!hasAll) return false;
    }
    
    // 检查信任度要求
    const trust = npc.relationships['player']?.trust ?? 50;
    if (quest.requirements.npcTrust && trust < quest.requirements.npcTrust) return false;
    
    return true;
  });
}

export function activateNextQuestInChain(completedQuest: NPCQuest): NPCQuest | undefined {
  if (!completedQuest.isChain || !completedQuest.nextQuest) return undefined;
  return NPC_QUEST_TEMPLATES.find(q => q.id === completedQuest.nextQuest);
}

export function updateQuestProgress(quest: NPCQuest, action: string, target: string, count: number): NPCQuest {
  const updatedObjectives = quest.objectives.map(obj => {
    if (obj.type === action && obj.target === target) {
      return { ...obj, current: Math.min(obj.current + count, obj.count) };
    }
    return obj;
  });
  
  return { ...quest, objectives: updatedObjectives };
}

export function isQuestComplete(quest: NPCQuest): boolean {
  return quest.objectives.every(obj => obj.current >= obj.count);
}
