export interface SpiritTreasure {
    id: string;
    name: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    color: string; // Tailwind color class
    type: 'active' | 'passive';
    slot: 'weapon' | 'armor' | 'accessory' | 'special';
    requiredRealm: number;
    effect: {
        attack?: number;
        defense?: number;
        hp?: number;
        spiritualPower?: number;
        agility?: number;
        intelligence?: number;
        luck?: number;
        critRate?: number;
        breakthroughBonusRate?: number;
        special?: string;
    };
    setBonus?: {
        setName: string;
        requiredTreasures: string[];
        effect: string;
        breakthroughBonusRate?: number;
    };
    lore: string;
}

export const SPIRIT_TREASURES: SpiritTreasure[] = [
    // 普通灵宝（2-3字，绿色）
    {
        id: 'iron_sword',
        name: '铁剑',
        rarity: 'common',
        color: 'text-green-600',
        type: 'active',
        slot: 'weapon',
        requiredRealm: 0,
        effect: { attack: 5 },
        lore: '一把普通的铁剑，寻常铁匠就能打造。'
    },
    {
        id: 'jade_pendant',
        name: '青冥佩',
        rarity: 'common',
        color: 'text-green-600',
        type: 'passive',
        slot: 'accessory',
        requiredRealm: 0,
        effect: { intelligence: 3, spiritualPower: 10 },
        lore: '一块普通的玉佩，能稍微增强感悟能力。'
    },
    {
        id: 'iron_bracers',
        name: '玄铁护腕',
        rarity: 'common',
        color: 'text-green-600',
        type: 'passive',
        slot: 'special',
        requiredRealm: 0,
        effect: { defense: 4, attack: 3 },
        lore: '玄铁打造的护腕，能提供基本的防护。'
    },
    {
        id: 'spirit_pearl',
        name: '养神珠',
        rarity: 'common',
        color: 'text-green-600',
        type: 'passive',
        slot: 'accessory',
        requiredRealm: 0,
        effect: { spiritualPower: 20 },
        lore: '能滋养神魂的宝珠。'
    },

    // 稀有灵宝（4-6字，蓝色）
    {
        id: 'qingming_sword',
        name: '青冥剑',
        rarity: 'rare',
        color: 'text-blue-600',
        type: 'active',
        slot: 'weapon',
        requiredRealm: 2,
        effect: { attack: 18, agility: 5 },
        lore: '据说曾是某位剑修的佩剑，剑身上刻有「青冥」二字。'
    },
    {
        id: 'spring_dragon_bracelet',
        name: '灵泉龙女镯',
        rarity: 'rare',
        color: 'text-blue-600',
        type: 'passive',
        slot: 'accessory',
        requiredRealm: 2,
        effect: { spiritualPower: 35, intelligence: 8 },
        lore: '灵泉秘境中产出的宝物，据说有龙女祝福。'
    },
    {
        id: 'blackiron_guard',
        name: '玄铁守护腕',
        rarity: 'rare',
        color: 'text-blue-600',
        type: 'passive',
        slot: 'special',
        requiredRealm: 2,
        effect: { defense: 15, hp: 30 },
        lore: '厚重的玄铁护腕，能提供可靠的防护。'
    },
    {
        id: 'soul_calming_pearl',
        name: '养神镇魂珠',
        rarity: 'rare',
        color: 'text-blue-600',
        type: 'passive',
        slot: 'accessory',
        requiredRealm: 2,
        effect: { spiritualPower: 50, intelligence: 10, luck: 3 },
        lore: '能安抚神魂的宝珠，据说在关键时刻能保命。'
    },

    // 史诗灵宝（6-10字，紫色）
    {
        id: 'qingming_zhuxian_sword',
        name: '青冥诛仙剑',
        rarity: 'epic',
        color: 'text-purple-600',
        type: 'active',
        slot: 'weapon',
        requiredRealm: 4,
        effect: { attack: 45, agility: 15, critRate: 0.08 },
        lore: '传说中能诛仙的神剑，青冥色的剑身上刻满了神秘符文。',
        setBonus: {
            setName: '青冥套装',
            requiredTreasures: ['qingming_zhuxian_sword', 'qingming_sword'],
            effect: '青冥之力觉醒！攻击+50%'
        }
    },
    {
        id: 'spring_dragon_essence_bracelet',
        name: '灵泉龙女精华镯',
        rarity: 'epic',
        color: 'text-purple-600',
        type: 'passive',
        slot: 'accessory',
        requiredRealm: 4,
        effect: { spiritualPower: 80, intelligence: 20, luck: 8 },
        lore: '灵泉秘境的至宝，龙女的精华凝结其中。',
        setBonus: {
            setName: '灵泉套装',
            requiredTreasures: ['spring_dragon_essence_bracelet', 'spring_dragon_bracelet'],
            effect: '灵泉之力！灵力恢复+100%'
        }
    },
    {
        id: 'blackiron_heaven_guard',
        name: '玄铁守护天之腕',
        rarity: 'epic',
        color: 'text-purple-600',
        type: 'passive',
        slot: 'special',
        requiredRealm: 4,
        effect: { defense: 40, hp: 100, attack: 10 },
        lore: '蕴含天地之力的玄铁护腕，防御之强几乎无物可破。'
    },
    {
        id: 'soul_calming_god_pearl',
        name: '养神镇魂之珠',
        rarity: 'epic',
        color: 'text-purple-600',
        type: 'passive',
        slot: 'accessory',
        requiredRealm: 4,
        effect: { spiritualPower: 120, intelligence: 25, luck: 12, hp: 80 },
        lore: '神珠一出，万法不侵！能镇魂定魄的神器。'
    },

    // 传说灵宝（10+字，金色/红色）
    {
        id: 'qingming_zhuxian_dadao_guiyi',
        name: '青冥诛仙，大道归一',
        rarity: 'legendary',
        color: 'text-yellow-500',
        type: 'active',
        slot: 'weapon',
        requiredRealm: 7,
        effect: { attack: 120, agility: 40, critRate: 0.15, breakthroughBonusRate: 0.10, special: '每三次攻击触发「大道一击」，伤害*3' },
        lore: '传说中的无上神器，由青冥诛仙剑进化而来，剑身上的「大道归一」四个字蕴含无穷奥妙。',
        setBonus: {
            setName: '大道套装',
            requiredTreasures: ['qingming_zhuxian_dadao_guiyi', 'qingming_zhuxian_sword', 'spring_dragon_essence_bracelet', 'soul_calming_god_pearl'],
            effect: '大道之力觉醒！全属性+100%，攻击附带「大道审判」效果',
            breakthroughBonusRate: 0.15
        }
    },
    {
        id: 'spring_dragon_wanwu_fusu',
        name: '灵泉龙女，万物复苏',
        rarity: 'legendary',
        color: 'text-yellow-500',
        type: 'passive',
        slot: 'accessory',
        requiredRealm: 7,
        effect: { spiritualPower: 250, intelligence: 50, luck: 25, hp: 200, breakthroughBonusRate: 0.08, special: '战斗后自动恢复30%气血' },
        lore: '灵泉龙女的本命法宝，蕴含生命的奥秘，能让万物复苏！'
    },
    {
        id: 'blackiron_guard_tianditongshou',
        name: '玄铁守护，天地同寿',
        rarity: 'legendary',
        color: 'text-yellow-500',
        type: 'passive',
        slot: 'special',
        requiredRealm: 7,
        effect: { defense: 100, hp: 400, attack: 30, breakthroughBonusRate: 0.12, special: '受到致命伤害时有30%概率触发「天地同寿」，免疫此次伤害并恢复50%气血' },
        lore: '与天地同寿的至宝，能提供难以想象的防护！'
    },
    {
        id: 'soul_calming_wanfa_buqin',
        name: '养神镇魂，万法不侵',
        rarity: 'legendary',
        color: 'text-yellow-500',
        type: 'passive',
        slot: 'accessory',
        requiredRealm: 7,
        effect: { spiritualPower: 300, intelligence: 60, luck: 30, hp: 300, breakthroughBonusRate: 0.15, special: '所有负面效果免疫，灵力消耗减少50%' },
        lore: '镇魂之珠，万法不侵！这是修炼者梦寐以求的终极宝物！'
    }
];

export interface TreasureFragment {
    id: string;
    name: string;
    treasureId: string;
    amountRequired: number;
}

export const TREASURE_FRAGMENTS: TreasureFragment[] = [
    {
        id: 'fragment_qingming_zhuxian_dadao_guiyi',
        name: '青冥诛仙大道碎片',
        treasureId: 'qingming_zhuxian_dadao_guiyi',
        amountRequired: 10
    },
    {
        id: 'fragment_spring_dragon_wanwu_fusu',
        name: '灵泉龙女复苏碎片',
        treasureId: 'spring_dragon_wanwu_fusu',
        amountRequired: 8
    },
    {
        id: 'fragment_blackiron_guard_tianditongshou',
        name: '玄铁守护同寿碎片',
        treasureId: 'blackiron_guard_tianditongshou',
        amountRequired: 12
    },
    {
        id: 'fragment_soul_calming_wanfa_buqin',
        name: '养神镇魂不侵碎片',
        treasureId: 'soul_calming_wanfa_buqin',
        amountRequired: 15
    }
];
