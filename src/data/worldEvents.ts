import { NPC } from './npcTemplates';

export interface WorldEvent {
  id: string;
  name: string;
  description: string;
  type: 'competition' | 'disaster' | 'celebration' | 'mystery' | 'market';
  location: string;
  requiredRealm?: number;
  duration: number; // 持续时间（游戏时间秒）
  startDate: number;
  rewards?: {
    gold?: number;
    exp?: number;
    item?: string;
    reputation?: Record<string, number>;
  };
  consequences?: {
    damage?: number;
    expLoss?: number;
  };
  participants: string[]; // 参与的NPC ID
  active: boolean;
}

export const WORLD_EVENT_TEMPLATES: Omit<WorldEvent, 'startDate' | 'active'>[] = [
  {
    id: 'event_small_competition',
    name: '宗门小比',
    description: '落叶城举办小比，年轻弟子们可以切磋武艺，获胜者将获得丰厚奖励',
    type: 'competition',
    location: '落叶城',
    requiredRealm: 0,
    duration: 3600, // 1小时游戏时间
    participants: [],
  },
  {
    id: 'event_rare_beast',
    name: '异兽出没',
    description: '传闻有一只罕见的妖兽出现在落叶山脉，很多修士都前去寻找',
    type: 'mystery',
    location: '落叶山脉',
    requiredRealm: 1,
    duration: 7200,
    participants: [],
    rewards: { gold: 200, exp: 150 },
  },
  {
    id: 'event_market_day',
    name: '集市日',
    description: '每月一次的集市，各种奇珍异宝都可能出现',
    type: 'market',
    location: '落叶城',
    requiredRealm: 0,
    duration: 5400,
    participants: [],
  },
  {
    id: 'event_fire_peak',
    name: '黑炎山暴动',
    description: '黑炎山的妖兽突然变得异常凶猛，需要修士们联手镇压',
    type: 'disaster',
    location: '黑炎岭',
    requiredRealm: 2,
    duration: 4800,
    participants: [],
    rewards: { gold: 300, exp: 250 },
  },
  {
    id: 'event_ice_festival',
    name: '碧波庆典',
    description: '一年一度的碧波湖庆典，据说能遇到很多同道中人',
    type: 'celebration',
    location: '碧波湖',
    requiredRealm: 1,
    duration: 7200,
    participants: [],
  },
  {
    id: 'event_ancient_treasure',
    name: '青云秘宝',
    description: '有传闻青云峰上发现了一处古代遗迹，可能藏有宝物',
    type: 'mystery',
    location: '青云峰',
    requiredRealm: 3,
    duration: 9000,
    participants: [],
    rewards: { gold: 500, exp: 400 },
  },
];

export function generateRandomWorldEvent(): Omit<WorldEvent, 'startDate' | 'active'> {
  return WORLD_EVENT_TEMPLATES[Math.floor(Math.random() * WORLD_EVENT_TEMPLATES.length)];
}

export function createWorldEvent(template: Omit<WorldEvent, 'startDate' | 'active'>, gameTime?: number): WorldEvent {
  return {
    ...template,
    startDate: gameTime ?? Math.floor(Date.now() / 1000),
    active: true,
  };
}

export function isEventActive(event: WorldEvent, currentTime: number): boolean {
  return event.active && (currentTime - event.startDate < event.duration);
}

export function getNPCsForEvent(event: WorldEvent, allNPCs: NPC[]): NPC[] {
  return allNPCs.filter(npc => {
    if (event.requiredRealm !== undefined && npc.currentRealm < event.requiredRealm) return false;
    if (npc.location === event.location) return true;
    if (npc.traits.social > 40 && Math.random() < 0.5) return true;
    return false;
  });
}
