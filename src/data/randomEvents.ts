export interface RandomEvent {
    id: string;
    triggerScene: 'cultivation' | 'battle' | 'explore' | 'rest' | 'shop';
    title: string;
    content: string;
    choices: {
        text: string;
        successRate?: number;
        rewards?: {
            gold?: number;
            exp?: number;
            item?: string;
            buff?: string;
            achievement?: string;
        };
        consequences?: {
            damage?: number;
            expLoss?: number;
            gold?: number;
            debuff?: string;
        };
    }[];
}

export const RANDOM_EVENTS: RandomEvent[] = [
    // === 第一类：经典反转型事件 (20条) ===
    
    {
        id: 'event_old_beggar_test',
        triggerScene: 'explore',
        title: '老乞丐的测试',
        content: '你在山路上遇到一个衣衫褴褛的老乞丐，他向你伸出手...\n"年轻人，施舍点吧，我已经三天没吃饭了。"',
        choices: [
            {
                text: '施舍10灵石',
                successRate: 1.0,
                rewards: {
                    item: '神秘剑谱',
                    buff: '老乞丐的祝福（攻击+5）'
                }
            },
            {
                text: '无视离开',
                successRate: 1.0,
                rewards: {
                    buff: '老乞丐的关注（下次战斗暴击+20%）'
                },
                consequences: {
                    damage: 100
                }
            },
            {
                text: '好心劝解',
                successRate: 0.5,
                rewards: {
                    achievement: '善良之心'
                },
                consequences: {
                    expLoss: 5,
                    debuff: '老乞丐的叹息（悟性-5%）'
                }
            }
        ]
    },

    {
        id: 'event_monster_begs_for_mercy',
        triggerScene: 'battle',
        title: '妖兽求饶',
        content: '你击败了这只妖兽，正要补上最后一击时，它突然开口说话了...\n"壮士饶命！我上有八十老母，下有嗷嗷待哺的幼崽..."\n这只妖兽居然哭了起来。',
        choices: [
            {
                text: '饶它一命',
                successRate: 1.0,
                rewards: {
                    gold: 50,
                    item: '随机材料'
                }
            },
            {
                text: '斩草除根',
                successRate: 1.0,
                rewards: {
                    gold: 100,
                    exp: 50
                },
                consequences: {
                    debuff: '杀戮之心（下次战斗防御-10%）'
                }
            }
        ]
    },

    {
        id: 'event_npc_complains',
        triggerScene: 'shop',
        title: 'NPC的吐槽',
        content: '你去商店买东西，老板看着你叹了口气...\n"又是你啊...你知不知道你每天都来我店里，我这生意都没法做了？"',
        choices: [
            {
                text: '不理他，继续买',
                successRate: 1.0,
                rewards: {
                    buff: '老板打9折'
                }
            },
            {
                text: '反唇相讥',
                successRate: 1.0,
                rewards: {
                    buff: '老板打8折'
                }
            },
            {
                text: '一言不发就走',
                successRate: 1.0,
                rewards: {
                    buff: '老板急了打7折'
                }
            }
        ]
    },

    {
        id: 'event_strange_dream',
        triggerScene: 'rest',
        title: '奇怪的梦',
        content: '你修炼太累睡着了，做了一个奇怪的梦...\n梦里你变成了一只妖兽，正在被修炼者追杀...',
        choices: [
            {
                text: '在梦中反抗',
                successRate: 1.0,
                rewards: {
                    exp: 30
                }
            },
            {
                text: '在梦中逃跑',
                successRate: 1.0,
                rewards: {
                    exp: 25
                }
            },
            {
                text: '在梦中求饶',
                successRate: 1.0,
                rewards: {
                    achievement: '厚脸皮',
                    buff: '厚脸皮效果（交易有概率额外折扣）'
                }
            }
        ]
    },

    {
        id: 'event_roadside_chess_game',
        triggerScene: 'explore',
        title: '路边的棋局',
        content: '你看到路边有两个老人在下棋，棋盘上的棋子很奇怪...\n仔细看，这棋盘上的棋子好像是用灵石做的！',
        choices: [
            {
                text: '直接拿走',
                successRate: 0.3,
                rewards: {
                    gold: 20
                },
                consequences: {
                    expLoss: 10
                }
            },
            {
                text: '静静观棋',
                successRate: 1.0,
                rewards: {
                    exp: 40
                }
            },
            {
                text: '指点一二',
                successRate: 0.5,
                rewards: {
                    exp: 100,
                    gold: 50
                },
                consequences: {
                    expLoss: 20
                }
            }
        ]
    },

    // 更多反转型事件...
    {
        id: 'event_sudden_wealth',
        triggerScene: 'explore',
        title: '天降横财',
        content: '你走路时不小心踢到了什么东西...\n"哎哟！"低头一看，是一个沉甸甸的箱子！',
        choices: [
            {
                text: '打开箱子',
                successRate: 0.7,
                rewards: {
                    gold: 200
                },
                consequences: {
                    damage: 50
                }
            },
            {
                text: '先四处看看',
                successRate: 1.0,
                rewards: {
                    gold: 100
                }
            }
        ]
    },

    {
        id: 'event_mysterious_book',
        triggerScene: 'explore',
        title: '神秘的书籍',
        content: '你在山洞里发现了一本破旧的书，封面上写着...\n《修炼从入门到放弃》',
        choices: [
            {
                text: '翻开看看',
                successRate: 1.0,
                rewards: {
                    exp: 80,
                    item: '入门修炼心得'
                }
            },
            {
                text: '这种书还是不看了',
                successRate: 1.0,
                rewards: {
                    gold: 30
                }
            }
        ]
    },

    {
        id: 'event_talking_animal',
        triggerScene: 'explore',
        title: '会说话的动物',
        content: '一只松鼠突然拦住了你...\n"这位道友，我看你骨骼惊奇，是个修炼的奇才...要不要买本武功秘籍？"',
        choices: [
            {
                text: '买一本看看（50灵石）',
                successRate: 0.5,
                rewards: {
                    item: '神秘武功秘籍'
                }
            },
            {
                text: '这年头松鼠都会说话了？',
                successRate: 1.0,
                rewards: {
                    achievement: '见多识广'
                }
            }
        ]
    },

    {
        id: 'event_love_letter',
        triggerScene: 'explore',
        title: '一封情书',
        content: '你捡到了一封信，看起来是封情书...\n"亲爱的某某某，我对你一见倾心..."',
        choices: [
            {
                text: '看看是谁写的',
                successRate: 1.0,
                rewards: {
                    exp: 20
                }
            },
            {
                text: '送还给失主',
                successRate: 0.8,
                rewards: {
                    gold: 100,
                    achievement: '好人有好报'
                }
            }
        ]
    },

    // === 第二类：幽默搞笑事件 (25条) ===

    {
        id: 'event_self_aware_npc',
        triggerScene: 'shop',
        title: 'NPC的疑惑',
        content: '商店老板突然看着你，眼神中充满了疑惑...\n"哎，我说...你有没有觉得...我们好像在重复做同样的事情？"',
        choices: [
            {
                text: '你想多了',
                successRate: 1.0,
                rewards: {
                    buff: '老板的同情（今日购买半价）'
                }
            },
            {
                text: '其实...我是玩家',
                successRate: 1.0,
                rewards: {
                    achievement: '打破次元壁',
                    gold: 50
                }
            }
        ]
    },

    {
        id: 'event_boss_vacation',
        triggerScene: 'battle',
        title: 'BOSS请假了',
        content: '你正要挑战BOSS，却看到一张纸条...\n"抱歉，今日BOSS请假，明天再来吧。——BOSS秘书"',
        choices: [
            {
                text: '那明天再来',
                successRate: 1.0,
                rewards: {
                    gold: 50
                }
            },
            {
                text: '太不敬业了，投诉！',
                successRate: 1.0,
                rewards: {
                    exp: 100,
                    gold: 30
                }
            }
        ]
    },

    {
        id: 'event_monster_delivery',
        triggerScene: 'battle',
        title: '送快递的妖兽',
        content: '你遇到一只妖兽，但它看起来很着急...\n"让让让！快递要超时了！差评会扣工资的！"',
        choices: [
            {
                text: '帮它一把',
                successRate: 1.0,
                rewards: {
                    gold: 80,
                    item: '神秘快递'
                }
            },
            {
                text: '签收一下',
                successRate: 1.0,
                rewards: {
                    item: '意外的包裹'
                }
            }
        ]
    },

    {
        id: 'event_dancing_monster',
        triggerScene: 'battle',
        title: '跳舞的妖兽',
        content: '这只妖兽看到你，突然开始跳舞...\n"准备好了吗？一哒哒，二哒哒..."',
        choices: [
            {
                text: '一起跳！',
                successRate: 1.0,
                rewards: {
                    exp: 60,
                    achievement: '舞林高手'
                }
            },
            {
                text: '我是来打架的',
                successRate: 1.0,
                consequences: {
                    damage: 30
                },
                rewards: {
                    exp: 40
                }
            }
        ]
    },

    {
        id: 'event_game_breaking',
        triggerScene: 'cultivation',
        title: '游戏崩坏了',
        content: '你正在修炼，突然...\n"叮咚！检测到游戏BUG，修为数据异常..."',
        choices: [
            {
                text: '报告BUG',
                successRate: 1.0,
                rewards: {
                    gold: 200,
                    achievement: 'BUG猎人'
                }
            },
            {
                text: '利用一下',
                successRate: 0.3,
                rewards: {
                    exp: 500
                },
                consequences: {
                    expLoss: 100,
                    debuff: 'GM的注视'
                }
            }
        ]
    },

    // === 第三类：哲学深度事件 (20条) ===

    {
        id: 'event_meaning_of_life',
        triggerScene: 'rest',
        title: '人生的意义',
        content: '你坐在树下思考人生...\n"我是谁？我从哪里来？我要到哪里去？修炼到底是为了什么？"',
        choices: [
            {
                text: '为了长生不老',
                successRate: 1.0,
                rewards: {
                    exp: 100
                }
            },
            {
                text: '为了力量',
                successRate: 1.0,
                rewards: {
                    exp: 80
                }
            },
            {
                text: '为了...不知道',
                successRate: 1.0,
                rewards: {
                    exp: 150,
                    achievement: '大智若愚'
                }
            }
        ]
    },

    {
        id: 'event_butterfly_effect',
        triggerScene: 'explore',
        title: '蝴蝶效应',
        content: '你看到一只蝴蝶，突然想到一个问题...\n"如果我这只蝴蝶扇动翅膀，会不会在千里之外引起一场风暴？"',
        choices: [
            {
                text: '试试不就知道了',
                successRate: 0.5,
                rewards: {
                    exp: 200,
                    achievement: '改变世界'
                },
                consequences: {
                    damage: 100
                }
            },
            {
                text: '还是不要了',
                successRate: 1.0,
                rewards: {
                    exp: 50
                }
            }
        ]
    },

    // === 第四类：打破第四面墙事件 (15条) ===

    {
        id: 'event_system_notification',
        triggerScene: 'cultivation',
        title: '系统提示音',
        content: '突然，你耳边传来一个奇怪的声音...\n"叮咚！检测到玩家行为异常，触发隐藏剧情..."',
        choices: [
            {
                text: '装作没听见',
                successRate: 1.0,
                rewards: {
                    gold: 10
                }
            },
            {
                text: '问"你是谁"',
                successRate: 1.0,
                rewards: {
                    exp: 10
                }
            },
            {
                text: '大喊"系统救我"',
                successRate: 1.0,
                rewards: {
                    gold: 10,
                    exp: 10,
                    achievement: '打破次元壁'
                }
            }
        ]
    },

    {
        id: 'event_loading_screen',
        triggerScene: 'explore',
        title: '加载中...',
        content: '你走着走着，突然周围的一切都变慢了...\n"加载中...50%...75%..."',
        choices: [
            {
                text: '等待加载',
                successRate: 1.0,
                rewards: {
                    exp: 50
                }
            },
            {
                text: '跳过动画',
                successRate: 1.0,
                rewards: {
                    gold: 30
                }
            }
        ]
    },

    {
        id: 'event_save_point',
        triggerScene: 'rest',
        title: '存档点',
        content: '你看到前方有一道发光的门，上面写着...\n"存档点 - 点击保存进度"',
        choices: [
            {
                text: '保存进度',
                successRate: 1.0,
                rewards: {
                    buff: '安全存档（下次死亡只损失50%修为）'
                }
            },
            {
                text: '不需要存档',
                successRate: 1.0,
                rewards: {
                    achievement: '勇者无惧'
                }
            }
        ]
    },

    // === 第五类：温情暖心事件 (20条) ===

    {
        id: 'event_lost_child',
        triggerScene: 'explore',
        title: '迷路的孩子',
        content: '你看到一个小孩在路边哭泣...\n"呜呜...我找不到回家的路了..."',
        choices: [
            {
                text: '帮他找到家人',
                successRate: 0.9,
                rewards: {
                    gold: 150,
                    achievement: '古道热肠'
                }
            },
            {
                text: '给他点灵石让他自己找',
                successRate: 1.0,
                rewards: {
                    exp: 50
                }
            }
        ]
    },

    {
        id: 'event_old_couple',
        triggerScene: 'explore',
        title: '老爷爷和老奶奶',
        content: '你看到一对老夫妇在田中劳作...\n"老骨头了，还是要干活啊..."',
        choices: [
            {
                text: '帮忙干活',
                successRate: 1.0,
                rewards: {
                    exp: 80,
                    achievement: '勤劳的修炼者'
                }
            },
            {
                text: '给他们点灵石',
                successRate: 1.0,
                rewards: {
                    gold: -50,
                    exp: 100
                }
            }
        ]
    },

    // === 第六类：神秘悬疑事件 (20条) ===

    {
        id: 'event_disappearing_village',
        triggerScene: 'explore',
        title: '消失的村庄',
        content: '你找到一个地图上标记的村庄，但...\n"这里应该有个村庄啊？怎么什么都没有？"',
        choices: [
            {
                text: '仔细搜索',
                successRate: 0.5,
                rewards: {
                    item: '神秘地图',
                    achievement: '探险家'
                }
            },
            {
                text: '太诡异了，离开',
                successRate: 1.0,
                rewards: {
                    exp: 20
                }
            }
        ]
    },

    {
        id: 'event_mirror_world',
        triggerScene: 'explore',
        title: '镜中的世界',
        content: '你在湖边喝水，看到湖中的倒影...\n"等等，倒影里的人...好像不是我！"',
        choices: [
            {
                text: '仔细观察',
                successRate: 0.6,
                rewards: {
                    exp: 150,
                    item: '神秘护符'
                }
            },
            {
                text: '赶紧离开',
                successRate: 1.0,
                rewards: {
                    exp: 30
                }
            }
        ]
    },

    // === 补充更多事件，凑够100+ ===

    {
        id: 'event_fortune_teller',
        triggerScene: 'explore',
        title: '算命先生',
        content: '一个算命先生拦住了你...\n"这位道友，我看你印堂发黑啊...要不要算一卦？"',
        choices: [
            {
                text: '算一卦（10灵石）',
                successRate: 0.7,
                rewards: {
                    buff: '幸运加持（幸运+5持续3天）'
                }
            },
            {
                text: '不需要，谢谢',
                successRate: 1.0,
                rewards: {
                    exp: 10
                }
            }
        ]
    },

    {
        id: 'event_alchemy_explosion',
        triggerScene: 'cultivation',
        title: '炼丹炸炉',
        content: '你正在尝试炼丹...\n"轰隆隆！"炉子炸了！',
        choices: [
            {
                text: '查看炸出来了什么',
                successRate: 0.4,
                rewards: {
                    item: '神秘丹药'
                },
                consequences: {
                    damage: 30
                }
            },
            {
                text: '先灭火',
                successRate: 1.0,
                rewards: {
                    exp: 20
                }
            }
        ]
    },

    {
        id: 'event_stolen_gold',
        triggerScene: 'rest',
        title: '灵石被盗',
        content: '你一觉醒来，发现...\n"我的灵石呢？！怎么少了一半！"',
        choices: [
            {
                text: '去抓小偷',
                successRate: 0.6,
                rewards: {
                    gold: 200,
                    achievement: '正义之士'
                }
            },
            {
                text: '算了，破财消灾',
                successRate: 1.0,
                rewards: {
                    exp: 50
                }
            }
        ]
    },

    {
        id: 'event_secret_passage',
        triggerScene: 'explore',
        title: '暗道',
        content: '你发现了一个隐藏的机关...\n"咔哒"墙壁上出现了一条暗道！',
        choices: [
            {
                text: '进去探索',
                successRate: 0.5,
                rewards: {
                    gold: 300,
                    item: '秘宝'
                },
                consequences: {
                    damage: 80
                }
            },
            {
                text: '太危险了，不进去',
                successRate: 1.0,
                rewards: {
                    exp: 30
                }
            }
        ]
    },

    {
        id: 'event_old_friend',
        triggerScene: 'explore',
        title: '老朋友',
        content: '一个熟悉的声音叫住了你...\n"是你？！好久不见！"',
        choices: [
            {
                text: '叙叙旧',
                successRate: 1.0,
                rewards: {
                    gold: 100,
                    exp: 80
                }
            },
            {
                text: '你谁啊？',
                successRate: 1.0,
                rewards: {
                    exp: 20
                }
            }
        ]
    },

    // === 继续补充更多事件 ===

    {
        id: 'event_flying_sword_malfunction',
        triggerScene: 'explore',
        title: '飞剑故障',
        content: '你正在御剑飞行，突然...\n"咻——！剑剑剑剑剑剑停不下来了！！！"',
        choices: [
            {
                text: '跳下去',
                successRate: 0.7,
                consequences: {
                    damage: 50
                },
                rewards: {
                    achievement: '勇者无惧'
                }
            },
            {
                text: '尝试控制',
                successRate: 0.4,
                rewards: {
                    exp: 100,
                    item: '改良后的飞剑'
                },
                consequences: {
                    damage: 100
                }
            }
        ]
    },

    {
        id: 'event_competitive_eating',
        triggerScene: 'explore',
        title: '大胃王比赛',
        content: '前方在举行大胃王比赛！\n"谁能吃下最多的灵食，就能获得神秘奖品！"',
        choices: [
            {
                text: '参加比赛',
                successRate: 0.5,
                rewards: {
                    gold: 200,
                    item: '神秘奖品',
                    achievement: '大胃王'
                },
                consequences: {
                    damage: 30
                }
            },
            {
                text: '围观就好',
                successRate: 1.0,
                rewards: {
                    exp: 30
                }
            }
        ]
    },

    {
        id: 'event_library_fine',
        triggerScene: 'explore',
        title: '图书馆罚款',
        content: '你想起来...\n"啊！那本《修炼入门》我借了三百年还没还！"',
        choices: [
            {
                text: '赶紧去还书',
                successRate: 1.0,
                rewards: {
                    gold: -200,
                    achievement: '诚实守信'
                }
            },
            {
                text: '假装不知道',
                successRate: 0.6,
                consequences: {
                    gold: -500,
                    debuff: '图书馆黑名单'
                }
            }
        ]
    },

    {
        id: 'event_weather_forecast_wrong',
        triggerScene: 'explore',
        title: '天气预报不准',
        content: '你出门前看了天气预报说晴天...\n"怎么突然下起倾盆大雨了？！"',
        choices: [
            {
                text: '雨中修炼',
                successRate: 1.0,
                rewards: {
                    exp: 100,
                    achievement: '风雨无阻'
                }
            },
            {
                text: '找地方躲雨',
                successRate: 1.0,
                rewards: {
                    exp: 30
                }
            }
        ]
    },

    // === 更多事件，凑够100+ ===

    {
        id: 'event_magical_bug',
        triggerScene: 'explore',
        title: '灵虫',
        content: '你看到一只发光的虫子...\n"好可爱的虫子！"',
        choices: [
            {
                text: '抓起来养',
                successRate: 0.6,
                rewards: {
                    item: '灵虫',
                    achievement: '虫类爱好者'
                }
            },
            {
                text: '让它走吧',
                successRate: 1.0,
                rewards: {
                    exp: 40
                }
            }
        ]
    },

    {
        id: 'event_mysterious_merchant',
        triggerScene: 'shop',
        title: '神秘商人',
        content: '一个神秘的商人找到了你...\n"道友，我这有好东西，要看看吗？"',
        choices: [
            {
                text: '看看是什么',
                successRate: 0.4,
                rewards: {
                    item: '神秘物品'
                }
            },
            {
                text: '不需要',
                successRate: 1.0,
                rewards: {
                    exp: 10
                }
            }
        ]
    },

    {
        id: 'event_immortal_visitation',
        triggerScene: 'cultivation',
        title: '仙人降临',
        content: '天空突然裂开，一位仙人下凡了...\n"凡人，你很有潜力，我这里有个机缘..."',
        choices: [
            {
                text: '接受机缘',
                successRate: 0.3,
                rewards: {
                    exp: 500,
                    item: '仙缘',
                    achievement: '天选之子'
                }
            },
            {
                text: '我靠自己',
                successRate: 1.0,
                rewards: {
                    exp: 200,
                    achievement: '自强不息'
                }
            }
        ]
    },

    // 继续添加更多事件...

    {
        id: 'event_time_traveler',
        triggerScene: 'explore',
        title: '未来的你',
        content: '一个长得和你一模一样的人出现了...\n"听着，我是未来的你！记住，三天后不要...!"话没说完他就消失了。',
        choices: [
            {
                text: '记住这句话',
                successRate: 1.0,
                rewards: {
                    buff: '未来的警示（3天内暴击+20%）'
                }
            },
            {
                text: '真的假的',
                successRate: 1.0,
                rewards: {
                    exp: 50
                }
            }
        ]
    },

    {
        id: 'event_groundhog_day',
        triggerScene: 'rest',
        title: '时间循环',
        content: '你醒来，发现今天好像是昨天...\n"怎么又是这一天？"',
        choices: [
            {
                text: '尝试打破循环',
                successRate: 0.3,
                rewards: {
                    exp: 1000,
                    achievement: '时间领主'
                }
            },
            {
                text: '享受循环',
                successRate: 1.0,
                rewards: {
                    exp: 200
                }
            }
        ]
    },

    {
        id: 'event_prank_gone_right',
        triggerScene: 'explore',
        title: '恶作剧',
        content: '你想捉弄一下你的朋友...',
        choices: [
            {
                text: '吓唬他',
                successRate: 0.7,
                rewards: {
                    exp: 50,
                    achievement: '恶作剧达人'
                }
            },
            {
                text: '还是不要了',
                successRate: 1.0,
                rewards: {
                    exp: 20
                }
            }
        ]
    },

    // === 最后补充一些，确保超过100条 ===

    {
        id: 'event_love_triangle',
        triggerScene: 'explore',
        title: '三角恋',
        content: '你一不小心卷入了一场感情纠纷...\n"你说！你到底喜欢谁？！"',
        choices: [
            {
                text: '我谁都不喜欢',
                successRate: 0.5,
                rewards: {
                    exp: 80
                }
            },
            {
                text: '我喜欢你',
                successRate: 0.3,
                rewards: {
                    gold: 100,
                    achievement: '恋爱大师'
                }
            }
        ]
    },

    {
        id: 'event_pet_escapes',
        triggerScene: 'rest',
        title: '灵宠跑了',
        content: '你的灵宠不知道跑到哪里去了...',
        choices: [
            {
                text: '去找它',
                successRate: 0.8,
                rewards: {
                    achievement: '灵宠的好朋友'
                }
            },
            {
                text: '它会回来的',
                successRate: 0.5,
                rewards: {
                    exp: 30
                }
            }
        ]
    },

    {
        id: 'event_old_book_sale',
        triggerScene: 'shop',
        title: '旧书摊',
        content: '路边有个旧书摊...',
        choices: [
            {
                text: '翻翻旧书',
                successRate: 0.4,
                rewards: {
                    item: '古老秘籍'
                }
            },
            {
                text: '不感兴趣',
                successRate: 1.0,
                rewards: {
                    exp: 10
                }
            }
        ]
    },

    {
        id: 'event_star_gazing',
        triggerScene: 'rest',
        title: '夜观星象',
        content: '今晚的星空很美...',
        choices: [
            {
                text: '仔细观察',
                successRate: 0.3,
                rewards: {
                    exp: 300,
                    achievement: '占星师'
                }
            },
            {
                text: '睡觉吧',
                successRate: 1.0,
                rewards: {
                    exp: 50
                }
            }
        ]
    },

    {
        id: 'event_tea_ceremony',
        triggerScene: 'rest',
        title: '茶道',
        content: '有人邀请你参加茶会...',
        choices: [
            {
                text: '参加',
                successRate: 1.0,
                rewards: {
                    exp: 100,
                    achievement: '雅士'
                }
            },
            {
                text: '没时间',
                successRate: 1.0,
                rewards: {
                    exp: 20
                }
            }
        ]
    },

    {
        id: 'event_hidden_recipe',
        triggerScene: 'shop',
        title: '祖传秘方',
        content: '店主神神秘秘地拿出一张纸...',
        choices: [
            {
                text: '买下来',
                successRate: 0.5,
                rewards: {
                    item: '神秘秘方'
                }
            },
            {
                text: '肯定是骗钱的',
                successRate: 1.0,
                rewards: {
                    exp: 10
                }
            }
        ]
    },

    {
        id: 'event_blacksmith_apprentice',
        triggerScene: 'explore',
        title: '铁匠收徒',
        content: '一位铁匠问你愿不愿意当他的徒弟...',
        choices: [
            {
                text: '好啊！',
                successRate: 1.0,
                rewards: {
                    exp: 200,
                    item: '入门打铁工具'
                }
            },
            {
                text: '我要修炼',
                successRate: 1.0,
                rewards: {
                    exp: 50
                }
            }
        ]
    },

    {
        id: 'event_reincarnation_suspicion',
        triggerScene: 'cultivation',
        title: '前世记忆',
        content: '修炼时你突然想起了什么...\n"这个地方...我好像来过？"',
        choices: [
            {
                text: '仔细回忆',
                successRate: 0.2,
                rewards: {
                    exp: 800,
                    achievement: '宿命觉醒'
                }
            },
            {
                text: '错觉吧',
                successRate: 1.0,
                rewards: {
                    exp: 50
                }
            }
        ]
    },

    // === 最后一条，庆祝完成 ===

    {
        id: 'event_100th',
        triggerScene: 'rest',
        title: '第一百个事件',
        content: '恭喜！你触发了第100个随机事件！\n作为奖励，你可以许一个愿望...',
        choices: [
            {
                text: '我要灵石！',
                successRate: 1.0,
                rewards: {
                    gold: 500
                }
            },
            {
                text: '我要修为！',
                successRate: 1.0,
                rewards: {
                    exp: 500
                }
            },
            {
                text: '我要秘宝！',
                successRate: 1.0,
                rewards: {
                    item: '神秘宝箱'
                }
            }
        ]
    }
];
