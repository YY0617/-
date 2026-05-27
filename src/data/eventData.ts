/**
 * Event Data - 事件数据
 * 包含：随机事件、故事节点
 * 注意：WorldEvent数据在worldEvents.ts中定义
 */
import type { RandomEvent, StoryNode } from './types';

// ============================================================
// 故事节点
// ============================================================
export const STORY_NODES: StoryNode[] = [
  { id: 'story_prologue', title: '序章：天降异象', content: '你出生的那天，天空出现异象，紫气东来三千里，霞光万丈照山河。村里的老人都说，这是天降祥瑞，此子将来必定不凡。你从小就对修炼有着浓厚的兴趣，渴望有一天能踏上武道巅峰。', choices: [{ text: '开始修炼', nextNode: 'story_chapter1', rewards: { attack: 5, cultivation: 50 }, consequence: '你开始刻苦修炼' }], isCompleted: false },
  { id: 'story_chapter1', title: '第一章：踏上征途', content: '你告别家人，背着简单的行囊，踏上了修炼之路。前方是未知的世界，充满了机遇与挑战。你来到了落叶城，这里是方圆百里最繁华的修炼之城。', choices: [{ text: '前往山脉历练', nextNode: 'story_chapter2', rewards: { cultivation: 30, attack: 3 }, consequence: '你踏上了前往落叶山脉的旅途，开始真正的修炼生涯' }, { text: '留在城中打探', rewards: { gold: 20, intelligence: 2 }, consequence: '你在城中打探消息，了解修炼界的情况' }], isCompleted: false },
  { id: 'story_chapter2', title: '第二章：初遇妖兽', content: '在落叶山脉深处，你遭遇了人生中的第一只妖兽——一只烈焰虎。它咆哮着向你扑来，战斗一触即发！', choices: [{ text: '奋勇战斗', nextNode: 'story_chapter3', rewards: { attack: 5, defense: 2 }, consequence: '你战胜了烈焰虎，获得了宝贵的战斗经验' }, { text: '巧妙周旋', rewards: { agility: 3, gold: 15 }, consequence: '你凭借灵活的身法避开了妖兽，找到了一处安全的洞穴' }], isCompleted: false },
  { id: 'story_chapter3', title: '第三章：神秘传承', content: '在洞穴深处，你发现了一座古老的祭坛，上面放着一本泛黄的古籍。书页上记载着一门失传已久的功法。', choices: [{ text: '潜心研读', nextNode: 'story_chapter4', rewards: { intelligence: 5, cultivation: 100 }, consequence: '你获得了上古传承，修为大增' }, { text: '谨慎离开', rewards: { luck: 5, gold: 50 }, consequence: '你带着古籍离开，决定日后再研究' }], isCompleted: false },
  { id: 'story_chapter4', title: '第四章：宗门选择', content: '你的名声渐渐传开，三大宗门都向你抛出了橄榄枝：玄剑派擅长剑道、丹鼎宗精于炼丹、隐世阁神秘莫测。', choices: [{ text: '加入玄剑派', rewards: { attack: 10 }, consequence: '你拜入玄剑派，开始学习精妙的剑法' }, { text: '加入丹鼎宗', rewards: { gold: 100, intelligence: 5 }, consequence: '你成为丹鼎宗弟子，学习炼丹之道' }, { text: '加入隐世阁', rewards: { defense: 10, agility: 5 }, consequence: '你进入隐世阁，学习神秘的传承' }], isCompleted: false },
];

// ============================================================
// 随机事件
// ============================================================
export const RANDOM_EVENTS: RandomEvent[] = [
  { id: 'adventure_cave', type: 'adventure', title: '奇遇：神秘山洞', description: '你在山林中发现一个被藤蔓掩盖的山洞入口，隐隐有灵光从洞内透出...', choices: [{ text: '进入探索', effects: { cultivation: 50, gold: 30 }, successRate: 0.7, successMsg: '发现失传功法残篇！获得大量修为和灵石！', failMsg: '山洞深处有妖兽守护，你狼狈逃出，损失了一些气血' }] },
  { id: 'adventure_herb', type: 'adventure', title: '奇遇：千年灵草', description: '你发现一株散发着奇异光芒的灵草，似乎是难得一见的千年灵药！', choices: [{ text: '小心采摘', effects: { gold: 100, cultivation: 30 }, successRate: 0.85, successMsg: '成功采摘到千年灵草，卖出了高价！', failMsg: '灵草周围有毒蛇守护，你被咬伤，损失了不少气血' }] },
  { id: 'adventure_merchant', type: 'trade', title: '偶遇神秘商人', description: '一位神秘的商人出现在你面前，他的摊位上摆满了各种珍稀物品。', choices: [{ text: '购买丹药', effects: { gold: -50, cultivation: 40 }, successRate: 1.0, successMsg: '你购买了一颗聚气丹，修为有所增长' }, { text: '购买秘籍', effects: { gold: -80, attack: 5 }, successRate: 1.0, successMsg: '你购买了一本基础拳法秘籍，攻击力提升' }, { text: '谢绝离开', effects: {}, successRate: 1.0, successMsg: '你婉言谢绝，继续你的旅程' }] },
  { id: 'adventure_npc', type: 'social', title: '偶遇落魄修士', description: '一位受伤的修士倒在路边，看起来急需帮助。', choices: [{ text: '出手相助', effects: { gold: -20, intelligence: 3 }, successRate: 0.9, successMsg: '你救助了这位修士，他感激地传授了你一些修炼心得' }, { text: '视而不见', effects: { luck: -3 }, successRate: 1.0, successMsg: '你选择无视，继续赶路，但心中有些不安' }] },
  { id: 'adventure_treasure', type: 'adventure', title: '奇遇：藏宝图', description: '你在一处废墟中发现了一张残破的藏宝图...', choices: [{ text: '按图寻找', effects: { gold: 200, luck: 5 }, successRate: 0.6, successMsg: '你找到了宝藏！获得了大量灵石！', failMsg: '藏宝图指向的地方早已被人发掘，一无所获' }] },
  { id: 'adventure_weather', type: 'environment', title: '突发天气变化', description: '天空突然乌云密布，一场暴风雨即将来临！', choices: [{ text: '寻找避雨处', effects: { agility: 2 }, successRate: 0.95, successMsg: '你找到了一处山洞躲避，等待雨停' }, { text: '冒雨赶路', effects: { hp: -20, cultivation: 10 }, successRate: 0.7, successMsg: '你冒雨前行，虽然淋得浑身湿透，但也锻炼了意志' }] },
  { id: 'adventure_pet', type: 'pet', title: '发现灵宠幼崽', description: '你发现一只受伤的灵宠幼崽，它看起来很虚弱。', choices: [{ text: '悉心照料', effects: { gold: -30 }, successRate: 0.8, successMsg: '灵宠幼崽痊愈后，决定跟随你！', failMsg: '灵宠幼崽伤势过重，不幸夭折了' }, { text: '带走贩卖', effects: { gold: 80, luck: -5 }, successRate: 1.0, successMsg: '你将幼崽卖给了商人，获得了不少灵石' }] },
  { id: 'adventure_rival', type: 'combat', title: '遭遇挑战者', description: '一位年轻修士拦住了你，想要与你切磋一番。', choices: [{ text: '接受挑战', effects: { attack: 3, defense: 2 }, successRate: 0.75, successMsg: '你战胜了挑战者，战斗经验有所提升！', failMsg: '你输给了挑战者，需要更加努力修炼了' }, { text: '委婉拒绝', effects: { intelligence: 1 }, successRate: 1.0, successMsg: '你礼貌地拒绝了挑战，避免了不必要的冲突' }] },
  { id: 'adventure_blessing', type: 'blessing', title: '奇遇：福地加持', description: '你误入一处灵气浓郁的福地，天地灵气不由自主地涌入体内！', choices: [{ text: '静心修炼', effects: { cultivation: 80, spiritualRoot: 2 }, successRate: 1.0, successMsg: '在福地中修炼，你的修为大幅增长！' }] },
  { id: 'adventure_riddle', type: 'puzzle', title: '神秘老者的考验', description: '一位白胡子老者拦住了你，提出了一个谜题...', choices: [{ text: '思考解答', effects: { intelligence: 5, gold: 50 }, successRate: 0.5, successMsg: '你解开了谜题，老者赞赏地给了你奖励！', failMsg: '你没能解开谜题，老者摇摇头离开了' }, { text: '直接请教', effects: { intelligence: 2 }, successRate: 1.0, successMsg: '老者欣赏你的诚实，指点了你几句' }] },
  { id: 'adventure_pill_discovery', type: 'adventure', title: '奇遇：丹道遗迹', description: '你在一处上古遗迹中发现了一枚散发金色光芒的丹药！', choices: [{ text: '服用丹药', effects: { breakthroughBonusRate: 0.15 }, successRate: 1.0, successMsg: '服用后发现是破境丹！突破成功率永久提升！', failMsg: '' }] },
  { id: 'adventure_dao_enhancement', type: 'blessing', title: '奇遇：道基升华', description: '你在一处神秘的洞天福地中感到道基在缓缓升华，天地法则与你的联系更加紧密...', choices: [{ text: '接受升华', effects: { daoFoundationBonus: 0.03 }, successRate: 1.0, successMsg: '道基得到升华！突破成功率永久提升！', failMsg: '' }] },
  { id: 'adventure_golden_pill', type: 'treasure', title: '奇遇：九转金丹', description: '天空突然金光大作，一枚散发着九色光芒的丹药从天而降！这是传说中的九转金丹！', choices: [{ text: '虔诚接受', effects: { breakthroughBonusRate: 0.50 }, successRate: 1.0, successMsg: '服下九转金丹！突破成功率大幅提升！', failMsg: '' }] },
  { id: 'adventure_immortal_herb', type: 'treasure', title: '奇遇：万年灵芝', description: '你在悬崖边发现一株散发着七彩光芒的灵芝，至少有万年年份！', choices: [{ text: '小心采摘', effects: { gold: 500, cultivation: 200 }, successRate: 0.9, successMsg: '成功采下万年灵芝，药效惊人！', failMsg: '灵芝突然消失在眼前，只留下淡淡的清香' }] },
  { id: 'adventure_ancient_book', type: 'treasure', title: '奇遇：上古秘籍', description: '你在一座废弃的道观中发现了一本布满灰尘的古籍，上面记载着失传的修炼法门！', choices: [{ text: '仔细研读', effects: { attack: 10, intelligence: 5 }, successRate: 0.8, successMsg: '领悟了上古秘籍中的精妙招式！', failMsg: '古籍太过晦涩，没能理解其中奥妙' }] },
  { id: 'adventure_spiritual_beast', type: 'combat', title: '遭遇：灵兽', description: '一只通体雪白的狐狸挡住了你的去路，它的眼中闪烁着智慧的光芒！', choices: [{ text: '友善交流', effects: { luck: 10, intelligence: 3 }, successRate: 0.6, successMsg: '灵兽被你的诚意打动，传授了你一些修炼心得！', failMsg: '灵兽对你不理不睬，转身消失在山林中' }, { text: '强行捕获', effects: { gold: 100 }, successRate: 0.4, successMsg: '你成功捕获了灵兽，卖出了高价！', failMsg: '灵兽反击，你受了些轻伤' }] },
  { id: 'adventure_dan_party', type: 'social', title: '参加：丹道大会', description: '城中正在举办丹道大会，各路炼丹师齐聚一堂！', choices: [{ text: '虚心学习', effects: { intelligence: 5, gold: 50 }, successRate: 1.0, successMsg: '观摩了炼丹师的表演，受益匪浅！' }, { text: '尝试炼丹', effects: { gold: -50, cultivation: 100 }, successRate: 0.5, successMsg: '你成功炼出了一炉丹药，修为大增！', failMsg: '炼丹失败，材料浪费了' }] },
  { id: 'adventure_artifact_forge', type: 'treasure', title: '奇遇：上古炼器炉', description: '你在山洞深处发现了一座散发着古朴气息的炼器炉！', choices: [{ text: '尝试炼器', effects: { gold: 200, attack: 5 }, successRate: 0.7, successMsg: '你用炼器炉炼出了一件不错的法器！', failMsg: '炼器失败，材料全部损毁' }] },
  { id: 'adventure_rainbow_bridge', type: 'blessing', title: '奇遇：彩虹桥', description: '雨后，天空出现了一道彩虹桥，桥的尽头似乎有什么在闪烁！', choices: [{ text: '踏上彩虹桥', effects: { luck: 15, cultivation: 150 }, successRate: 0.5, successMsg: '彩虹桥尽头是一处仙境，你获得了巨大的机缘！', failMsg: '彩虹桥突然消失，你从空中坠落' }] },
  { id: 'adventure_old_friend', type: 'social', title: '偶遇：旧识', description: '你在城中遇到了一位多年未见的旧友，他如今已是小有名气的修士！', choices: [{ text: '把酒言欢', effects: { intelligence: 3, luck: 5 }, successRate: 1.0, successMsg: '与旧友相谈甚欢，他分享了一些修炼心得！' }, { text: '请教修炼', effects: { attack: 3, defense: 3 }, successRate: 0.9, successMsg: '旧友倾囊相授，你的实力有所提升！', failMsg: '旧友忙于修炼，没有太多时间交流' }] },
  { id: 'adventure_monster_swarm', type: 'combat', title: '遭遇：妖兽潮', description: '山中突然涌出大量妖兽，它们似乎在逃避什么！', choices: [{ text: '奋勇战斗', effects: { cultivation: 100, gold: 80 }, successRate: 0.6, successMsg: '你斩杀了大量妖兽，收获颇丰！', failMsg: '妖兽太多，你只能且战且退' }, { text: '暂避锋芒', effects: { agility: 3 }, successRate: 1.0, successMsg: '你明智地选择了撤退，保存了实力' }] },
  { id: 'adventure_spiritual_spring', type: 'blessing', title: '奇遇：灵泉', description: '你发现了一处清澈见底的灵泉，泉水散发着浓郁的灵气！', choices: [{ text: '饮用泉水', effects: { cultivation: 60, hp: 30 }, successRate: 1.0, successMsg: '灵泉入口甘甜，修为和气血都有所恢复！' }, { text: '收集泉水', effects: { gold: 100 }, successRate: 0.8, successMsg: '你收集了一些泉水，卖出了好价钱！', failMsg: '泉水离开泉眼后很快就失去了灵气' }] },
  { id: 'adventure_hermit', type: 'social', title: '偶遇：隐世高人', description: '一位白发苍苍的老者在溪边垂钓，他的气息深不可测！', choices: [{ text: '虚心请教', effects: { intelligence: 10, cultivation: 150 }, successRate: 0.7, successMsg: '高人指点了你几句，你茅塞顿开！', failMsg: '高人只是笑了笑，什么也没说' }, { text: '静静陪伴', effects: { luck: 8 }, successRate: 1.0, successMsg: '你静静地陪伴老者钓鱼，心境得到了提升！' }] },
  { id: 'adventure_tomb', type: 'adventure', title: '探索：古墓', description: '你发现了一座隐蔽的古墓，墓碑上刻着神秘的符文！', choices: [{ text: '进入探索', effects: { gold: 300, cultivation: 100 }, successRate: 0.6, successMsg: '古墓中有不少陪葬品，你收获满满！', failMsg: '古墓中有机关陷阱，你受了些轻伤' }, { text: '谨慎离开', effects: { luck: 3 }, successRate: 1.0, successMsg: '你明智地选择了离开，安全第一' }] },
];

// ============================================================
// 获取事件帮助函数
// ============================================================
export function getRandomEventById(id: string): RandomEvent | undefined {
  return RANDOM_EVENTS.find(e => e.id === id);
}

export function getStoryNodeById(id: string): StoryNode | undefined {
  return STORY_NODES.find(n => n.id === id);
}

export function getRandomEventByType(type: string): RandomEvent | undefined {
  const events = RANDOM_EVENTS.filter(e => e.type === type);
  return events[Math.floor(Math.random() * events.length)];
}