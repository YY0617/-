import { Monster } from '../store/gameStore';

export interface SecretRealm {
    id: string;
    name: string;
    lore: string;
    type: 'daily' | 'weekly' | 'special';
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    reqRealm: number;
    staminaCost: number;
    levels: SecretRealmLevel[];
    rewards: {
        gold: [number, number];
        exp: [number, number];
        realmStones: [number, number];
        treasureFragments?: [number, number];
    };
    availableMonsters: string[];
}

export interface SecretRealmLevel {
    id: number;
    name: string;
    description: string;
    monsters: string[]; // 怪物ID列表
    choices?: {
        text: string;
        result: 'safe' | 'risky';
        goldBonus?: number;
        expBonus?: number;
        damage?: number;
    }[];
}

export const SECRET_REALMS: SecretRealm[] = [
    {
        id: 'abandoned_mine',
        name: '废弃矿洞',
        lore: '三万年前，这里是万灵宗的开采之地，日产灵石百万。后来矿脉深处传来诡异嘶吼，矿工接连失踪...如今这里成为妖兽巢穴，但据说矿脉深处仍藏有上古矿灵的遗产。',
        type: 'daily',
        rarity: 'common',
        reqRealm: 0,
        staminaCost: 30,
        levels: [
            {
                id: 1,
                name: '矿洞入口',
                description: '你踏入废弃矿洞，黑暗中隐约有两条岔路——左侧传来滴水声，右侧有火光闪烁。',
                monsters: ['stone_beetle'],
                choices: [
                    { text: '走左侧水路', result: 'safe', goldBonus: 60, expBonus: 80 },
                    { text: '走右侧火道', result: 'risky', goldBonus: 80, expBonus: 90, damage: 15 }
                ]
            },
            {
                id: 2,
                name: '矿脉深处',
                description: '深入后发现一个古老的宝箱！',
                monsters: ['spirit_snake'],
                choices: [
                    { text: '打开宝箱', result: 'safe', goldBonus: 100, expBonus: 100 },
                    { text: '谨慎观察', result: 'safe', goldBonus: 50, expBonus: 70 }
                ]
            }
        ],
        rewards: {
            gold: [60, 120],
            exp: [80, 160],
            realmStones: [2, 5]
        },
        availableMonsters: ['stone_beetle', 'spirit_snake']
    },
    {
        id: 'fallen_mountains',
        name: '落叶山脉',
        lore: '曾经是修炼者最爱的隐居之地，后来妖兽出没，人迹罕至...但传说山中仍有古人遗宝。',
        type: 'daily',
        rarity: 'common',
        reqRealm: 0,
        staminaCost: 25,
        levels: [
            {
                id: 1,
                name: '山脚小径',
                description: '你沿着小径上山，路边有奇怪的脚印。',
                monsters: ['stone_beetle'],
                choices: [
                    { text: '顺着脚印走', result: 'safe', goldBonus: 40, expBonus: 60 },
                    { text: '自己开路', result: 'risky', goldBonus: 50, expBonus: 80, damage: 10 }
                ]
            },
            {
                id: 2,
                name: '山顶平台',
                description: '山顶有一块平整的石头，似乎是古人打坐之处。',
                monsters: ['spirit_snake'],
                choices: [
                    { text: '查看石头', result: 'safe', goldBonus: 70, expBonus: 90 },
                    { text: '打坐感悟', result: 'safe', goldBonus: 30, expBonus: 110 }
                ]
            }
        ],
        rewards: {
            gold: [50, 100],
            exp: [60, 140],
            realmStones: [1, 3]
        },
        availableMonsters: ['stone_beetle', 'spirit_snake']
    },
    {
        id: 'ancient_temple',
        name: '古刹遗址',
        lore: '百年前的宗门遗址，香火鼎盛时曾有千名弟子在此修行，后来一夜之间满门消失...',
        type: 'daily',
        rarity: 'common',
        reqRealm: 1,
        staminaCost: 40,
        levels: [
            {
                id: 1,
                name: '山门广场',
                description: '古刹大门前，你看到两尊金刚像，左侧的金刚手持降魔杵，右侧的托着宝塔。',
                monsters: ['fire_wolf'],
                choices: [
                    { text: '参拜降魔金刚', result: 'safe', goldBonus: 120, expBonus: 150 },
                    { text: '参拜宝塔金刚', result: 'risky', goldBonus: 150, expBonus: 130, damage: 10 }
                ]
            },
            {
                id: 2,
                name: '大雄宝殿',
                description: '大雄宝殿内，佛像背后似乎藏有什么东西。',
                monsters: ['shadow_tiger'],
                choices: [
                    { text: '搜索佛像背后', result: 'safe', goldBonus: 200, expBonus: 200 },
                    { text: '瞻仰佛像', result: 'safe', goldBonus: 80, expBonus: 120 }
                ]
            }
        ],
        rewards: {
            gold: [100, 200],
            exp: [150, 280],
            realmStones: [3, 6]
        },
        availableMonsters: ['fire_wolf', 'shadow_tiger']
    },
    {
        id: 'black_flame_ridge',
        name: '黑炎岭',
        lore: '传说中火龙栖息的地方，常年火焰不熄，山石都被烧得焦黑...',
        type: 'weekly',
        rarity: 'rare',
        reqRealm: 1,
        staminaCost: 50,
        levels: [
            {
                id: 1,
                name: '火山脚下',
                description: '热浪扑面而来，你感觉自己快被烤熟了。',
                monsters: ['fire_wolf'],
                choices: [
                    { text: '硬冲过去', result: 'risky', goldBonus: 180, expBonus: 200, damage: 25 },
                    { text: '绕路而行', result: 'safe', goldBonus: 120, expBonus: 150 }
                ]
            },
            {
                id: 2,
                name: '火焰洞穴',
                description: '洞穴深处传来低沉的咆哮声...',
                monsters: ['shadow_tiger'],
                choices: [
                    { text: '直接进入', result: 'risky', goldBonus: 220, expBonus: 250, damage: 20 },
                    { text: '在外围等待', result: 'safe', goldBonus: 150, expBonus: 180 }
                ]
            },
            {
                id: 3,
                name: '炎龙巢穴',
                description: '你看到了传说中的炎龙正在沉睡！',
                monsters: ['boss_flame_dragon'],
                choices: []
            }
        ],
        rewards: {
            gold: [180, 300],
            exp: [250, 400],
            realmStones: [5, 10],
            treasureFragments: [0, 1]
        },
        availableMonsters: ['fire_wolf', 'shadow_tiger', 'boss_flame_dragon']
    },
    {
        id: 'ice_pond',
        name: '冰魄潭',
        lore: '万年寒冰凝结的深潭，据说潭底藏有上古冰龙的遗骸...',
        type: 'daily',
        rarity: 'common',
        reqRealm: 2,
        staminaCost: 50,
        levels: [
            {
                id: 1,
                name: '冰潭岸边',
                description: '寒气逼人，你呼出的气息瞬间变成白色的雾气。',
                monsters: ['ice_toad'],
                choices: [
                    { text: '沿着岸边走', result: 'safe', goldBonus: 180, expBonus: 220 },
                    { text: '直接跳下去', result: 'risky', goldBonus: 250, expBonus: 280, damage: 30 }
                ]
            },
            {
                id: 2,
                name: '冰洞入口',
                description: '你发现了一个隐藏在冰层下的洞口！',
                monsters: ['ice_toad'],
                choices: [
                    { text: '进入冰洞', result: 'risky', goldBonus: 300, expBonus: 350, damage: 25 },
                    { text: '在洞口观望', result: 'safe', goldBonus: 180, expBonus: 200 }
                ]
            }
        ],
        rewards: {
            gold: [180, 350],
            exp: [250, 400],
            realmStones: [4, 8]
        },
        availableMonsters: ['ice_toad']
    },
    {
        id: 'flame_mountain',
        name: '火焰山',
        lore: '传说中火神祝融曾在此修炼，山中火焰永不熄灭，连石头都能燃烧...',
        type: 'weekly',
        rarity: 'rare',
        reqRealm: 2,
        staminaCost: 55,
        levels: [
            {
                id: 1,
                name: '山脚驿站',
                description: '一个荒废的驿站，墙上写着"前方危险，回头是岸"。',
                monsters: ['fire_wolf'],
                choices: [
                    { text: '继续前进', result: 'risky', goldBonus: 250, expBonus: 280, damage: 30 },
                    { text: '休息片刻', result: 'safe', goldBonus: 150, expBonus: 180 }
                ]
            },
            {
                id: 2,
                name: '山腰火道',
                description: '道路两旁都是燃烧的火焰，你必须小心通过。',
                monsters: ['shadow_tiger'],
                choices: [
                    { text: '快速冲过', result: 'risky', goldBonus: 300, expBonus: 320, damage: 25 },
                    { text: '小心翼翼走', result: 'safe', goldBonus: 200, expBonus: 250 }
                ]
            },
            {
                id: 3,
                name: '山顶神殿',
                description: '一座古老的神殿，里面有一尊火神像！',
                monsters: ['boss_flame_dragon'],
                choices: []
            }
        ],
        rewards: {
            gold: [250, 400],
            exp: [350, 500],
            realmStones: [6, 12],
            treasureFragments: [0, 2]
        },
        availableMonsters: ['fire_wolf', 'shadow_tiger', 'boss_flame_dragon']
    },
    {
        id: 'mist_forest',
        name: '迷雾森林',
        lore: '常年被迷雾笼罩的森林，进去的人往往会迷失方向...但传说森林深处住着一位古老的树灵。',
        type: 'daily',
        rarity: 'common',
        reqRealm: 3,
        staminaCost: 60,
        levels: [
            {
                id: 1,
                name: '林中小路',
                description: '迷雾越来越浓，你几乎看不到前方的路。',
                monsters: ['shadow_tiger'],
                choices: [
                    { text: '凭感觉走', result: 'risky', goldBonus: 280, expBonus: 320, damage: 30 },
                    { text: '做标记前进', result: 'safe', goldBonus: 200, expBonus: 250 }
                ]
            },
            {
                id: 2,
                name: '森林深处',
                description: '你看到一棵巨大的古树，树上似乎有什么东西在发光...',
                monsters: ['ice_toad'],
                choices: [
                    { text: '爬上树查看', result: 'risky', goldBonus: 350, expBonus: 400, damage: 20 },
                    { text: '在树下祈祷', result: 'safe', goldBonus: 180, expBonus: 300 }
                ]
            }
        ],
        rewards: {
            gold: [250, 450],
            exp: [350, 550],
            realmStones: [5, 10]
        },
        availableMonsters: ['shadow_tiger', 'ice_toad']
    },
    {
        id: 'spirit_spring',
        name: '灵泉秘境',
        lore: '蕴含浓郁灵气的天然秘境，据说灵泉水可以洗髓伐脉，改善资质...',
        type: 'special',
        rarity: 'epic',
        reqRealm: 4,
        staminaCost: 80,
        levels: [
            {
                id: 1,
                name: '灵泉入口',
                description: '灵泉分为冷热两池，热池冒着热气，冷池寒气逼人。',
                monsters: ['boss_shadow_lord'],
                choices: [
                    { text: '进入热池', result: 'risky', goldBonus: 400, expBonus: 600, damage: 30 },
                    { text: '进入冷池', result: 'risky', goldBonus: 380, expBonus: 550, damage: 25 }
                ]
            },
            {
                id: 2,
                name: '泉眼所在',
                description: '泉眼处漂浮着一颗发光的晶石！',
                monsters: ['boss_ice_giant'],
                choices: [
                    { text: '摘取晶石', result: 'risky', goldBonus: 600, expBonus: 700, damage: 15 },
                    { text: '汲取灵气', result: 'safe', goldBonus: 200, expBonus: 400 }
                ]
            },
            {
                id: 3,
                name: '灵泉深处',
                description: '你看到了灵泉龙女正在水中嬉戏！',
                monsters: ['boss_shadow_lord'],
                choices: []
            }
        ],
        rewards: {
            gold: [500, 800],
            exp: [700, 1000],
            realmStones: [10, 20],
            treasureFragments: [2, 5]
        },
        availableMonsters: ['boss_shadow_lord', 'boss_ice_giant']
    },
    {
        id: 'heaven_palace',
        name: '天宫遗迹',
        lore: '传说中仙人居住的宫殿遗迹，据说这里藏有成仙的秘密...',
        type: 'special',
        rarity: 'epic',
        reqRealm: 5,
        staminaCost: 90,
        levels: [
            {
                id: 1,
                name: '天门',
                description: '天宫入口有两座门神雕像，手持不同的法器。',
                monsters: ['boss_ice_giant'],
                choices: [
                    { text: '选择青龙门神', result: 'risky', goldBonus: 600, expBonus: 900, damage: 35 },
                    { text: '选择白虎门神', result: 'risky', goldBonus: 550, expBonus: 850, damage: 40 }
                ]
            },
            {
                id: 2,
                name: '瑶池',
                description: '传说中西王母沐浴的地方，池水仍在闪闪发光。',
                monsters: ['boss_shadow_lord'],
                choices: [
                    { text: '跳入瑶池', result: 'risky', goldBonus: 800, expBonus: 1000, damage: 50 },
                    { text: '在岸边观望', result: 'safe', goldBonus: 400, expBonus: 600 }
                ]
            },
            {
                id: 3,
                name: '凌霄宝殿',
                description: '宫殿深处发现一座宝库，门口有天兵神将守护！',
                monsters: ['boss_ice_giant'],
                choices: [
                    { text: '强行破禁', result: 'risky', goldBonus: 900, expBonus: 1100, damage: 50 },
                    { text: '寻找阵眼', result: 'safe', goldBonus: 700, expBonus: 950, damage: 20 }
                ]
            }
        ],
        rewards: {
            gold: [600, 1000],
            exp: [900, 1300],
            realmStones: [12, 25],
            treasureFragments: [3, 7]
        },
        availableMonsters: ['boss_ice_giant', 'boss_shadow_lord']
    },
    {
        id: 'chaos_void',
        name: '混沌虚空',
        lore: '传说中宇宙诞生之处，时间与空间在此扭曲...只有真正的强者才能在此存活。',
        type: 'special',
        rarity: 'legendary',
        reqRealm: 6,
        staminaCost: 100,
        levels: [
            {
                id: 1,
                name: '虚空边缘',
                description: '空间扭曲得厉害，你感觉自己随时会被撕成碎片。',
                monsters: ['boss_shadow_lord'],
                choices: [
                    { text: '稳住心神', result: 'safe', goldBonus: 700, expBonus: 900 },
                    { text: '强行突破', result: 'risky', goldBonus: 1000, expBonus: 1200, damage: 60 }
                ]
            },
            {
                id: 2,
                name: '混沌深处',
                description: '你看到了一颗混沌之珠在虚空中漂浮！',
                monsters: ['boss_ice_giant'],
                choices: [
                    { text: '尝试抓取', result: 'risky', goldBonus: 1200, expBonus: 1500, damage: 50 },
                    { text: '在远处吸收', result: 'safe', goldBonus: 500, expBonus: 800 }
                ]
            },
            {
                id: 3,
                name: '虚空魔神领域',
                description: '虚空魔神现身了！这是你此生最大的挑战！',
                monsters: ['boss_shadow_lord'],
                choices: []
            }
        ],
        rewards: {
            gold: [800, 1400],
            exp: [1200, 1800],
            realmStones: [15, 30],
            treasureFragments: [5, 10]
        },
        availableMonsters: ['boss_shadow_lord', 'boss_ice_giant']
    }
];
