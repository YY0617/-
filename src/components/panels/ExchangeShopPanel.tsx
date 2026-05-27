import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';

interface ExchangeItem {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: 'potion' | 'item' | 'skill' | 'buff';
}

const EXCHANGE_ITEMS: ExchangeItem[] = [
  {
    id: 'health_potion_x10',
    name: '淬体丹 x10',
    description: '恢复气血的丹药',
    cost: 10,
    type: 'potion'
  },
  {
    id: 'spirit_potion_x10',
    name: '通脉丹 x10',
    description: '恢复灵力的丹药',
    cost: 10,
    type: 'potion'
  },
  {
    id: 'strength_buff',
    name: '狂暴丹',
    description: '30分钟内攻击力+20%',
    cost: 20,
    type: 'buff'
  },
  {
    id: 'defense_buff',
    name: '金刚丹',
    description: '30分钟内防御力+20%',
    cost: 20,
    type: 'buff'
  },
  {
    id: 'exp_boost',
    name: '聚灵丹',
    description: '修炼速度翻倍30分钟',
    cost: 30,
    type: 'buff'
  },
  {
    id: 'luck_talisman',
    name: '幸运符',
    description: '30分钟内幸运+5',
    cost: 15,
    type: 'buff'
  }
];

const ExchangeShopPanel: React.FC = () => {
  const game = useGameStore();
  const [message, setMessage] = useState<string | null>(null);

  const handleExchange = (item: ExchangeItem) => {
    if (game.realmStones < item.cost) {
      setMessage('秘境石不足！');
      setTimeout(() => setMessage(null), 2000);
      return;
    }

    switch (item.id) {
      case 'health_potion_x10':
        game.addItem({
          id: 'qi_pill',
          name: '淬体丹',
          type: 'consumable',
          description: '恢复50气血',
          price: 30,
        }, 10);
        break;
      case 'spirit_potion_x10':
        game.addItem({
          id: 'spirit_pill',
          name: '通脉丹',
          type: 'consumable',
          description: '恢复30灵力',
          price: 25,
        }, 10);
        break;
      case 'strength_buff':
        game.addBuff({
          id: 'strength_buff',
          name: '狂暴丹',
          description: '攻击力+20%',
          type: 'buff',
          effect: { attack: 20 },
          duration: 1800,
          icon: '攻'
        });
        break;
      case 'defense_buff':
        game.addBuff({
          id: 'defense_buff',
          name: '金刚丹',
          description: '防御力+20%',
          type: 'buff',
          effect: { defense: 20 },
          duration: 1800,
          icon: '防'
        });
        break;
      case 'exp_boost':
        game.addBuff({
          id: 'exp_boost',
          name: '聚灵丹',
          description: '修炼速度翻倍',
          type: 'buff',
          effect: {},
          duration: 1800,
          icon: '灵'
        });
        break;
      case 'luck_talisman':
        game.addBuff({
          id: 'luck_talisman',
          name: '幸运符',
          description: '幸运+5',
          type: 'buff',
          effect: { luck: 5 },
          duration: 1800,
          icon: '运'
        });
        break;
    }

    game.updateRealmStones(-item.cost);
    setMessage(`成功兑换 ${item.name}！`);
    setTimeout(() => setMessage(null), 2000);
  };

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-bold text-black py-2.5">秘境兑换</h2>
        <div className="text-black">
          秘境石: <span className="font-bold">{game.realmStones}</span>
        </div>
      </div>

      {message && (
        <div className="mb-2 p-3 bg-gray-100 text-black rounded border border-gray-300">
          {message}
        </div>
      )}

      <div className="space-y-2">
        {EXCHANGE_ITEMS.map((item) => (
          <div
            key={item.id}
            className="bg-white p-3 rounded border border-gray-200"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-bold text-black">{item.name}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
              <div className="text-right">
                <span className="text-black font-bold">{item.cost} 秘境石</span>
              </div>
            </div>

            <button
              onClick={() => handleExchange(item)}
              disabled={game.realmStones < item.cost}
              className={`w-full py-2 rounded min-h-[44px] ${
                game.realmStones >= item.cost
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {game.realmStones >= item.cost ? '兑换' : '秘境石不足'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExchangeShopPanel;
