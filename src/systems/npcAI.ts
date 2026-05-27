import { NPC } from '../data/npcTemplates';

export interface PlayerNPCInteraction {
  npcId: string;
  type: 'chat' | 'gift' | 'ask_for_help' | 'duel' | 'trade' | 'team_up';
  title: string;
  content: string;
  choices: {
    text: string;
    successRate: number;
    rewards?: {
      gold?: number;
      exp?: number;
      item?: string;
      trustChange?: number;
    };
    consequences?: {
      damage?: number;
      expLoss?: number;
      gold?: number;
      trustChange?: number;
    };
  }[];
}

export function generateChatInteraction(npc: NPC): PlayerNPCInteraction {
  const greetings = [
    `"道友，又见面了！今日收获如何？"`,
    `"啊，是你啊，最近过得怎么样？"`,
    `"哦？稀客稀客！找我有什么事吗？"`,
    `"嗯？有什么我可以帮你的？"`
  ];
  
  const greeting = greetings[Math.floor(Math.random() * greetings.length)];
  
  return {
    npcId: npc.id,
    type: 'chat',
    title: `与${npc.name}对话`,
    content: `${npc.appearance}的${npc.name}看到你，露出微笑：\n${greeting}`,
    choices: [
      {
        text: "收获颇丰，多谢关心",
        successRate: 1.0,
        rewards: { trustChange: 5 }
      },
      {
        text: "一般般，还需努力",
        successRate: 1.0,
        rewards: { trustChange: 3 }
      },
      {
        text: "我有一件事想请教...",
        successRate: 0.8,
        rewards: { trustChange: 10, exp: 20 }
      }
    ]
  };
}

export function generateGiftInteraction(npc: NPC): PlayerNPCInteraction {
  return {
    npcId: npc.id,
    type: 'gift',
    title: `送礼物给${npc.name}`,
    content: `${npc.name}看着你手中的礼物，眼中闪过一丝好奇...`,
    choices: [
      {
        text: "送上50灵石",
        successRate: 1.0,
        rewards: { trustChange: 15 },
        consequences: { gold: -50 }
      },
      {
        text: "送上一枚丹药",
        successRate: 0.9,
        rewards: { trustChange: 25 }
      },
      {
        text: "算了，下次再说",
        successRate: 1.0,
        rewards: { trustChange: -2 }
      }
    ]
  };
}

export function generateDuelInteraction(npc: NPC): PlayerNPCInteraction {
  return {
    npcId: npc.id,
    type: 'duel',
    title: `挑战${npc.name}`,
    content: `${npc.name}看着你，眼中闪过一丝战意：\n"切磋一下？"`,
    choices: [
      {
        text: "好！来一场！",
        successRate: npc.traits.brave > 50 ? 0.9 : 0.6,
        rewards: { trustChange: 10, exp: 50 }
      },
      {
        text: "还是下次吧",
        successRate: 1.0,
        rewards: { trustChange: -5 }
      }
    ]
  };
}

export function updateNPCPlayerMemory(npc: NPC, trustChange: number, moment: string): NPC {
  const updatedNPC = { ...npc };
  const playerId = 'player';
  
  if (!updatedNPC.memories[playerId]) {
    updatedNPC.memories[playerId] = {
      interactions: 0,
      trust: 50,
      lastMeeting: Date.now(),
      importantMoments: []
    };
  }
  
  const memory = updatedNPC.memories[playerId];
  memory.interactions++;
  memory.trust = Math.max(0, Math.min(100, memory.trust + trustChange));
  memory.lastMeeting = Date.now();
  if (moment) {
    memory.importantMoments.push(moment);
  }
  
  return updatedNPC;
}
