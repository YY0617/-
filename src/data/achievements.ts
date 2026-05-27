/**
 * Achievement definitions — all achievement templates with condition functions.
 * Note: Achievement.condition takes GameState which is defined in types.ts
 */
import type { Achievement, GameState } from './types';

// Helper: total kills across all monsters
function totalKills(state: GameState): number {
  return Object.values(state.totalKills).reduce((a, b) => a + b, 0);
}

export const ACHIEVEMENTS: Achievement[] = [
  // 战斗类成就
  { id: 'first_kill', name: '初出茅庐', description: '击杀第一只妖兽', icon: '⚔️', reward: { gold: 50 }, condition: (state) => totalKills(state) >= 1 },
  { id: 'kill_10', name: '小有名气', description: '累计击杀10只妖兽', icon: '🎯', reward: { gold: 200, cultivation: 100 }, condition: (state) => totalKills(state) >= 10 },
  { id: 'kill_100', name: '声名远扬', description: '累计击杀100只妖兽', icon: '🏆', reward: { gold: 1000, cultivation: 500, talentPoint: 1 }, condition: (state) => totalKills(state) >= 100 },
  { id: 'kill_1000', name: '杀神降世', description: '累计击杀1000只妖兽', icon: '💀', reward: { gold: 5000, cultivation: 2000, talentPoint: 3 }, condition: (state) => totalKills(state) >= 1000 },

  // 境界突破成就
  { id: 'first_breakthrough', name: '突破初境', description: '完成第一次境界突破', icon: '🌟', reward: { cultivation: 200 }, condition: (state) => state.stats.realm >= 1 },
  { id: 'reach_lingxian', name: '踏入灵现', description: '突破至灵现境界', icon: '✨', reward: { gold: 500, talentPoint: 2 }, condition: (state) => state.stats.realm >= 3 },
  { id: 'reach_lingxu', name: '凌虚大能', description: '突破至凌虚境界', icon: '🌙', reward: { gold: 2000, cultivation: 1000, talentPoint: 3 }, condition: (state) => state.stats.realm >= 4 },
  { id: 'reach_wudao', name: '悟道真君', description: '突破至悟道境界', icon: '🌺', reward: { gold: 5000, cultivation: 3000, talentPoint: 5 }, condition: (state) => state.stats.realm >= 5 },
  { id: 'reach_guanjue', name: '冠绝圣者', description: '突破至冠绝境界', icon: '🌅', reward: { gold: 10000, cultivation: 5000, talentPoint: 10 }, condition: (state) => state.stats.realm >= 6 },

  // 财富成就
  { id: 'rich_man', name: '腰缠万贯', description: '拥有超过1000灵石', icon: '💰', reward: { cultivation: 300 }, condition: (state) => state.gold >= 1000 },
  { id: 'millionaire', name: '富甲一方', description: '拥有超过10000灵石', icon: '👑', reward: { gold: 2000, cultivation: 500 }, condition: (state) => state.gold >= 10000 },
  { id: 'billionaire', name: '富可敌国', description: '拥有超过100000灵石', icon: '💎', reward: { gold: 10000, cultivation: 2000 }, condition: (state) => state.gold >= 100000 },

  // 灵宠成就
  { id: 'first_pet', name: '灵宠相伴', description: '获得第一只灵宠', icon: '🐾', reward: { gold: 100 }, condition: (state) => state.pets.length >= 1 },
  { id: 'all_pets', name: '灵宠满堂', description: '收服所有灵宠', icon: '🦊', reward: { gold: 500, cultivation: 300, talentPoint: 1 }, condition: (state) => state.pets.length >= 3 },
  { id: 'pet_love', name: '心有灵犀', description: '某只灵宠好感度达到100', icon: '💕', reward: { gold: 300, cultivation: 200 }, condition: (state) => Object.values(state.petFavorability).some(v => v >= 100) },

  // 技能功法成就
  { id: 'skill_master', name: '功法小成', description: '学会4种功法', icon: '📜', reward: { cultivation: 200 }, condition: (state) => state.skills.length >= 4 },
  { id: 'skill_grandmaster', name: '功法大成', description: '学会8种功法', icon: '📚', reward: { gold: 800, cultivation: 500 }, condition: (state) => state.skills.length >= 8 },

  // 天赋成就
  { id: 'talent_tree', name: '天赋初成', description: '解锁5个天赋', icon: '🌳', reward: { talentPoint: 2 }, condition: (state) => state.unlockedTalents.length >= 5 },
  { id: 'talent_master', name: '天赋精通', description: '解锁10个天赋', icon: '🌲', reward: { talentPoint: 3, gold: 500 }, condition: (state) => state.unlockedTalents.length >= 10 },

  // 阵法成就
  { id: 'formation_master', name: '阵法宗师', description: '成功激活一次阵法', icon: '🔮', reward: { gold: 300, cultivation: 200 }, condition: (state) => state.hasActivatedFormation },

  // 社交NPC成就
  { id: 'npc_friend_5', name: '交友广泛', description: '与5个NPC好感度达到友好', icon: '👥', reward: { gold: 400, cultivation: 300 }, condition: (state) => Object.values(state.npcFavorability).filter(v => v >= 60).length >= 5 },
  { id: 'npc_friend_10', name: '桃李天下', description: '与10个NPC好感度达到友好', icon: '🎓', reward: { gold: 1000, cultivation: 800 }, condition: (state) => Object.values(state.npcFavorability).filter(v => v >= 60).length >= 10 },
  { id: 'npc_bestie', name: '莫逆之交', description: '与某个NPC好感度达到100', icon: '💎', reward: { gold: 500, cultivation: 400 }, condition: (state) => Object.values(state.npcFavorability).some(v => v >= 100) },

  // 任务成就
  { id: 'quest_complete_10', name: '任务达人', description: '完成10个任务', icon: '📋', reward: { gold: 300, cultivation: 200 }, condition: (state) => state.quests.filter(q => q.isClaimed).length >= 10 },
  { id: 'quest_complete_50', name: '任务狂人', description: '完成50个任务', icon: '📝', reward: { gold: 800, cultivation: 500 }, condition: (state) => state.quests.filter(q => q.isClaimed).length >= 50 },

  // 世界事件成就
  { id: 'world_event_5', name: '时势英雄', description: '参与5次世界事件', icon: '🌍', reward: { gold: 400, cultivation: 300 }, condition: (state) => state.totalEventsTriggered >= 5 },
  { id: 'world_event_20', name: '风云人物', description: '参与20次世界事件', icon: '⭐', reward: { gold: 1000, cultivation: 800 }, condition: (state) => state.totalEventsTriggered >= 20 },

  // 探索成就
  { id: 'secret_realm_10', name: '秘境探险家', description: '通关秘境10次', icon: '🗝️', reward: { gold: 600, cultivation: 400 }, condition: (state) => state.secretRealms.filter(r => r.timesCompleted >= 1).length >= 3 },
  { id: 'treasure_hunter', name: '寻宝猎人', description: '收集10个灵宝碎片', icon: '💎', reward: { gold: 500, cultivation: 300 }, condition: (state) => Object.values(state.treasureFragments).reduce((a, b) => a + b, 0) >= 10 },
  { id: 'treasure_master', name: '灵宝收藏家', description: '拥有5件灵宝', icon: '👑', reward: { gold: 2000, cultivation: 1000 }, condition: (state) => state.spiritTreasures.length >= 5 },

  // 社交成就
  { id: 'chat_50', name: '闲聊家常', description: '与NPC交谈50次', icon: '💬', reward: { gold: 300, cultivation: 200 }, condition: (state) => state.npcEvents && Object.values(state.npcEvents).flat().length >= 50 },

  // 特殊成就
  { id: 'play_time_1h', name: '初入修炼', description: '累计游戏时长达到1小时', icon: '⏰', reward: { cultivation: 100 }, condition: (state) => state.playTime >= 3600 },
  { id: 'play_time_10h', name: '沉浸其中', description: '累计游戏时长达到10小时', icon: '⏳', reward: { gold: 1000, cultivation: 500 }, condition: (state) => state.playTime >= 36000 },
  { id: 'play_time_100h', name: '废寝忘食', description: '累计游戏时长达到100小时', icon: '🌟', reward: { gold: 5000, cultivation: 3000, talentPoint: 2 }, condition: (state) => state.playTime >= 360000 },
];
