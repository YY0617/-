import React from 'react';
import { useGameStore, SHOP_ITEMS, SKILL_PRICES, deleteSave } from '../../store/gameStore';
import { SKILLS, getGradePrefix } from '../../data/itemData';
import { TapTapStorage } from '../../utils/tapTapAdapter';

export const CharacterPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const game = useGameStore();
  const stats = game.stats;

  const statList = [
    { label: '境界', value: game.getRealmName() },
    { label: '修为', value: `${stats.cultivation}/${stats.cultivationNext}` },
    { label: '生命', value: `${stats.hp}/${stats.hpMax}` },
    { label: '灵力', value: `${stats.spiritualPower}/${stats.spiritualPowerMax}` },
    { label: '体力', value: `${stats.stamina}/${stats.staminaMax}` },
    { label: '攻击', value: stats.attack },
    { label: '防御', value: stats.defense },
    { label: '敏捷', value: stats.agility },
    { label: '悟性', value: stats.intelligence },
    { label: '运气', value: stats.luck },
    { label: '灵根', value: stats.spiritualRoot },
    { label: '暴击率', value: `${(stats.critRate * 100).toFixed(0)}%` },
    { label: '闪避率', value: `${(stats.evasionRate * 100).toFixed(0)}%` },
    { label: '吸血', value: `${(stats.lifesteal * 100).toFixed(0)}%` },
  ];

  return (
    <div className="bg-white rounded p-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-bold text-black py-2.5">角色信息</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center">&times;</button>
      </div>

      <div className="mb-2">
        <div className="text-base font-bold text-black">{game.playerName}</div>
        <div className="text-sm text-gray-600">{game.getRealmName()}</div>
        <div className="text-xs text-gray-500 mt-1">
          {game.physique.name} · {game.lingen.name}
        </div>
        {game.background && (
          <div className="text-xs text-gray-500">
            {game.background.icon} {game.background.name}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {statList.map((stat, i) => (
          <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded border border-gray-200 min-h-[44px]">
            <span className="text-gray-600 text-sm">{stat.label}</span>
            <span className="font-bold text-sm text-black">{stat.value}</span>
          </div>
        ))}
      </div>

      {game.unlockedTalents.length > 0 && (
        <div className="mt-2">
          <div className="text-sm font-bold text-black mb-2">天赋 ({game.unlockedTalents.length})</div>
          <div className="flex flex-wrap gap-1">
            {game.unlockedTalents.map((tid, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 text-black rounded text-xs border border-gray-300 min-h-[44px] flex items-center">
                {tid}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const InventoryPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const game = useGameStore();
  const [activeTab, setActiveTab] = React.useState<'all' | 'equip' | 'consumable'>('all');

  const filteredItems = game.inventory.filter(item => {
    if (activeTab === 'all') return true;
    if (activeTab === 'equip') return ['weapon', 'armor', 'accessory', 'boots', 'bracelet', 'waist'].includes(item.type);
    return item.type === 'consumable';
  });

  const equipSlots = [
    { key: 'weapon' as const, label: '武器', item: game.equipment.weapon },
    { key: 'armor' as const, label: '护甲', item: game.equipment.armor },
    { key: 'accessory' as const, label: '饰品', item: game.equipment.accessory },
    { key: 'boots' as const, label: '靴子', item: game.equipment.boots },
    { key: 'bracelet' as const, label: '护腕', item: game.equipment.bracelet },
    { key: 'waist' as const, label: '腰带', item: game.equipment.waist },
  ];

  const handleEquip = (item: typeof game.inventory[0]) => {
    if (item.type === 'consumable') {
      if (item.id.includes('qi')) game.heal(50);
      else if (item.id.includes('spirit')) game.restoreSpiritualPower(30);
      else if (item.id.includes('big_qi')) game.heal(120);
      else if (item.id.includes('big_spirit')) game.restoreSpiritualPower(70);
      else if (item.id.includes('stamina')) game.recoverStamina(20);
      game.removeItem(item.id, 1);
    } else {
      game.equipItem(item);
    }
  };

  const handleUnequip = (slot: 'weapon' | 'armor' | 'accessory' | 'boots' | 'bracelet' | 'waist') => {
    game.unequipItem(slot);
  };

  return (
    <div className="bg-white rounded p-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-bold text-black py-2.5">背包</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center">&times;</button>
      </div>

      <div className="mb-2">
        <div className="grid grid-cols-6 gap-1">
          {equipSlots.map((slot) => (
            <button
              key={slot.key}
              onClick={() => slot.item && handleUnequip(slot.key)}
              className={`p-2 rounded text-center border min-h-[44px] ${
                slot.item 
                  ? 'bg-gray-100 border-gray-400 hover:bg-gray-200' 
                  : 'bg-gray-50 border-gray-200'
              }`}
            >
              <div className="text-xs text-gray-600">{slot.label}</div>
              <div className="text-base mt-1 font-bold">
                {slot.item ? '装' : '—'}
              </div>
              {slot.item && (
                <div className="text-xs text-gray-500 truncate">{slot.item.name}</div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-1.5 mb-2">
        {(['all', 'equip', 'consumable'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded text-sm border min-h-[44px] ${
              activeTab === tab 
                ? 'bg-black text-white border-black' 
                : 'bg-white text-black border-gray-300'
            }`}
          >
            {tab === 'all' ? '全部' : tab === 'equip' ? '装备' : '丹药'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1.5 max-h-64 overflow-y-auto">
        {filteredItems.map((item, i) => (
          <button
            key={i}
            onClick={() => handleEquip(item)}
            className="p-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 text-left min-h-[44px]"
          >
            <div className="text-sm font-bold text-black truncate">{item.name}</div>
            <div className="text-xs text-gray-600">x{item.quantity}</div>
            <div className="text-xs text-gray-500 truncate">{item.description}</div>
          </button>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center text-gray-500 p-3">背包空空如也</div>
      )}
    </div>
  );
};

export const SkillPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const game = useGameStore();
  const [buyingSkill, setBuyingSkill] = React.useState<string | null>(null);

  const handleBuySkill = (skillId: string) => {
    const price = SKILL_PRICES?.[skillId] || 200;
    if (game.gold < price) return;
    
    const skill = SKILLS.find(s => s.id === skillId);
    if (!skill || game.skills.find(s => s.id === skillId) || skill.id === 'basic_fist') return;
    
    game.gainGold(-price);
    game.addSkill({ ...skill });
    game.updateQuestProgress('learn_skill', 1);
    setBuyingSkill(null);
  };

  const handleUpgradeSkill = (skillId: string) => {
    const skill = game.skills.find(s => s.id === skillId);
    if (!skill || skill.level >= skill.maxLevel) return;
    
    const cost = skill.level * 80;
    if (game.gold < cost) return;
    
    game.gainGold(-cost);
    game.levelUpSkill(skillId);
  };

  return (
    <div className="bg-white rounded p-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-bold text-black py-2.5">功法</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center">&times;</button>
      </div>

      <div className="mb-2">
        <div className="text-sm font-bold text-black mb-2">已学会 ({game.skills.length}/8)</div>
        <div className="space-y-2">
          {game.skills.map((skill, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded border border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-black">
                    {skill.name} <span className="text-xs text-gray-500">Lv.{skill.level}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    消耗{skill.spiritualPowerCost}灵力 | 伤害{skill.damage}
                  </div>
                </div>
                {skill.level < skill.maxLevel && (
                  <button
                    onClick={() => handleUpgradeSkill(skill.id)}
                    className="px-2 py-1 bg-black text-white rounded text-xs min-h-[44px]"
                  >
                    升级 {skill.level * 80}灵石
                  </button>
                )}
              </div>
              {skill.level >= skill.maxLevel && (
                <div className="text-xs text-gray-600 mt-1">已满级</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {game.skills.length < 8 && (
        <div>
          <div className="text-sm font-bold text-black mb-2">可学习功法</div>
          <div className="space-y-2">
            {SKILLS.filter(s => s.id !== 'basic_fist' && !game.skills.find(sk => sk.id === s.id)).map((skill) => {
              const cost = SKILL_PRICES?.[skill.id] || 200;
              const elementNames: Record<string, string> = { fire: '火属性', ice: '冰属性', thunder: '雷属性', shadow: '暗属性', neutral: '无属性' };
              return (
                <button
                  key={skill.id}
                  onClick={() => setBuyingSkill(skill.id)}
                  className="w-full p-3 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 text-left min-h-[44px]"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-black">{skill.name}</div>
                      <div className="text-xs text-gray-600">{elementNames[skill.element] || '无属性'}</div>
                    </div>
                    <div className="text-black font-bold">{cost}灵石</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {buyingSkill && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-3 max-w-sm mx-4 border border-gray-300">
            <div className="text-center">
              <div className="text-base font-bold mb-2 text-black">确认购买？</div>
              <div className="text-sm text-gray-600 mb-2">购买后将扣除灵石</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setBuyingSkill(null)} className="flex-1 bg-gray-200 py-2 rounded min-h-[44px]">取消</button>
              <button onClick={() => handleBuySkill(buyingSkill)} className="flex-1 bg-black text-white py-2 rounded min-h-[44px]">购买</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const ShopPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const game = useGameStore();
  const [buyingItem, setBuyingItem] = React.useState<(typeof SHOP_ITEMS)[number] | null>(null);

  const handleBuy = (item: (typeof SHOP_ITEMS)[number]) => {
    if (game.gold < item.price) return;
    const result = game.addItem({ ...item, description: item.description });
    if (result.success) {
      game.gainGold(-item.price);
      if (['weapon', 'armor', 'accessory', 'boots', 'bracelet', 'waist'].includes(item.type)) {
        game.updateQuestProgress('buy_equipment', 1);
      }
      setBuyingItem(null);
    } else {
      game.showToast(result.msg, 'error');
    }
  };

  const consumables = SHOP_ITEMS.filter(i => i.type === 'consumable');
  const weapons = SHOP_ITEMS.filter(i => i.type === 'weapon');
  const armors = SHOP_ITEMS.filter(i => i.type === 'armor');
  const accessories = SHOP_ITEMS.filter(i => i.type === 'accessory');
  const boots = SHOP_ITEMS.filter(i => i.type === 'boots');
  const bracelets = SHOP_ITEMS.filter(i => i.type === 'bracelet');
  const waists = SHOP_ITEMS.filter(i => i.type === 'waist');

  const renderItems = (items: typeof SHOP_ITEMS, title: string) => {
    if (items.length === 0) return null;
    return (
      <div className="mb-2">
        <div className="text-sm font-bold text-black mb-2">{title}</div>
        <div className="grid grid-cols-2 gap-1.5">
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => setBuyingItem(item)}
              className="p-2 bg-gray-50 rounded border border-gray-200 hover:bg-gray-100 text-left min-h-[44px]"
            >
              <div className="font-bold text-black text-sm">{item.name}</div>
              <div className="text-xs text-gray-600">{item.description}</div>
              <div className="text-black font-bold text-sm">{item.price}灵石</div>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded p-3 max-h-[70vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-bold text-black py-2.5">商店</h2>
        <div className="text-black font-bold">{game.gold}灵石</div>
      </div>

      {renderItems(consumables, '丹药')}
      {renderItems(weapons, '武器')}
      {renderItems(armors, '护甲')}
      {renderItems(accessories, '饰品')}
      {renderItems(boots, '靴子')}
      {renderItems(bracelets, '护腕')}
      {renderItems(waists, '腰带')}

      {buyingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-3 max-w-sm mx-4 border border-gray-300">
            <div className="text-center">
              <div className="text-base font-bold mb-2 text-black">{buyingItem.name}</div>
              <div className="text-sm text-gray-600 mb-2">{buyingItem.description}</div>
              <div className="text-black font-bold text-base mb-2">{buyingItem.price}灵石</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setBuyingItem(null)} className="flex-1 bg-gray-200 py-2 rounded min-h-[44px]">取消</button>
              <button onClick={() => handleBuy(buyingItem)} className="flex-1 bg-black text-white py-2 rounded min-h-[44px]">购买</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface SettingsPanelProps {
  onClose: () => void;
  onSave: (slot: number) => void;
  onDeleteSave: (slot: number) => void;
  currentSaveSlot: number | null;
  onReturnToLaunch: () => void;
  saves: any[];
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
  onClose, 
  onSave, 
  onDeleteSave, 
  currentSaveSlot, 
  onReturnToLaunch,
  saves 
}) => {
  const game = useGameStore();

  const handleReset = () => {
    if (confirm('确定要重置游戏吗？所有进度将丢失！')) {
      TapTapStorage.removeItem('xianxia-save');
      for (let i = 1; i <= 3; i++) {
        deleteSave(i);
      }
      window.location.reload();
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  return (
    <div className="bg-white rounded p-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-bold text-black py-2.5">设置</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center">&times;</button>
      </div>

      <div className="space-y-2">
        <div className="p-3 bg-gray-50 rounded border border-gray-200">
          <div className="text-sm font-bold text-black mb-2">存档管理</div>
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3].map((slot) => {
              const save = saves.find((s) => s.slot === slot);
              const isActive = currentSaveSlot === slot;
              return (
                <div 
                  key={slot} 
                  className={`p-2 rounded border ${
                    isActive ? 'bg-gray-200 border-gray-400' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="text-xs font-bold text-center mb-1">
                    {isActive && '✨ '}存档{slot}
                  </div>
                  {save ? (
                    <div className="space-y-1">
                      <div className="text-xs text-gray-600 truncate">
                        {save.summary}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {formatDate(save.savedAt)}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onSave(slot)}
                          className="flex-1 text-[10px] bg-gray-800 text-white py-1 rounded min-h-[28px]"
                        >
                          保存
                        </button>
                        <button
                          onClick={() => onDeleteSave(slot)}
                          className="flex-1 text-[10px] bg-red-500 text-white py-1 rounded min-h-[28px]"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <div className="text-xs text-gray-400 text-center">空</div>
                      <button
                        onClick={() => onSave(slot)}
                        className="w-full text-[10px] bg-green-600 text-white py-1 rounded min-h-[28px]"
                      >
                        保存
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onReturnToLaunch}
          className="w-full bg-gray-200 hover:bg-gray-300 text-black py-3 rounded font-bold min-h-[44px]"
        >
          返回启动页
        </button>

        <button
          onClick={handleReset}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded font-bold min-h-[44px]"
        >
          重置游戏
        </button>

        <div className="p-3 bg-gray-50 rounded border border-gray-200">
          <div className="text-sm font-bold text-black mb-2">游戏信息</div>
          <div className="text-xs text-gray-600 space-y-1">
            <div>存档版本: 11</div>
            <div>游戏时长: {Math.floor(game.playTime / 60)}分钟</div>
            <div>总击杀: {Object.values(game.totalKills).reduce((a, b) => a + b, 0)}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
