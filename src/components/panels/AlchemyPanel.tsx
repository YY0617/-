import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { ALCHEMY_RECIPES, ALCHEMY_MATERIALS as ALCHEMY_MATERIALS_DATA } from '../../data/alchemySystem';
import { getRealmName } from '../../data/realmConfig';
import { SHOP_ITEMS } from '../../data/itemData';

export const AlchemyPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const game = useGameStore();
  const [activeTab, setActiveTab] = useState<'craft' | 'materials'>('craft');

  const handleCraft = (recipeId: string) => {
    const recipe = ALCHEMY_RECIPES.find(r => r.id === recipeId);
    if (!recipe) return;

    if (game.stats.realm < recipe.requiredRealm) {
      game.showToast(`需要${getRealmName(recipe.requiredRealm, 0)}才能炼制`, 'error');
      return;
    }

    for (const material of recipe.materials) {
      const item = game.inventory.find(i => i.id === material.id);
      if (!item || item.quantity < material.count) {
        const matData = ALCHEMY_MATERIALS_DATA.find(m => m.id === material.id);
        game.showToast(`材料不足: ${matData?.name || material.id}`, 'error');
        return;
      }
    }

    for (const material of recipe.materials) {
      game.removeItem(material.id, material.count);
    }

    const success = Math.random() < recipe.successRate;
    
    // 记录炼丹次数
    game.recordAlchemy(success);
    
    if (success) {
      game.addItem(
        { id: recipe.result.id, name: recipe.result.name || '', type: 'consumable', description: '', price: 0 },
        recipe.result.count
      );
      const resultItem = SHOP_ITEMS.find(i => i.id === recipe.result.id);
      game.showToast(`炼丹成功！获得 ${resultItem?.name || recipe.result.name || recipe.result.id} x${recipe.result.count}`, 'success');
    } else {
      game.showToast('炼丹失败...材料损失了...', 'error');
    }
    
    game.updateQuestProgress('alchemy', 1);
  };

  const getMaterialCount = (materialId: string) => {
    const item = game.inventory.find(i => i.id === materialId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="bg-white rounded-xl p-4 max-h-[70vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-bold text-black py-2.5">炼丹阁</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center">&times;</button>
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab('craft')}
          className={`flex-1 py-2 rounded-lg font-bold text-sm min-h-[44px] ${
            activeTab === 'craft' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          丹方
        </button>
        <button
          onClick={() => setActiveTab('materials')}
          className={`flex-1 py-2 rounded-lg font-bold text-sm min-h-[44px] ${
            activeTab === 'materials' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-700'
          }`}
        >
          材料
        </button>
      </div>

      {activeTab === 'craft' && (
        <div className="space-y-3">
          {ALCHEMY_RECIPES.map((recipe) => {
            const canCraft = game.stats.realm >= recipe.requiredRealm && 
              recipe.materials.every(m => getMaterialCount(m.id) >= m.count);
            const hasRealm = game.stats.realm >= recipe.requiredRealm;

            return (
              <div key={recipe.id} className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-bold text-black">{recipe.name}</div>
                    <div className="text-xs text-gray-600">{recipe.description}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    hasRealm ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    成功率: {(recipe.successRate * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="text-xs text-gray-600 mb-2">
                  需要境界: {getRealmName(recipe.requiredRealm, 0)}
                </div>

                <div className="mb-3">
                  <div className="text-xs font-bold text-gray-700 mb-1">材料:</div>
                  <div className="flex flex-wrap gap-2">
                    {recipe.materials.map((material) => {
                      const matData = ALCHEMY_MATERIALS_DATA.find(m => m.id === material.id);
                      const hasEnough = getMaterialCount(material.id) >= material.count;
                      return (
                        <div 
                          key={material.id} 
                          className={`text-xs px-2 py-1 rounded-full ${
                            hasEnough ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {matData?.name || material.id}: {getMaterialCount(material.id)}/{material.count}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="text-xs font-bold text-gray-700 mb-1">产出:</div>
                  <div className="text-xs text-gray-600">
                    {(() => {
                      const resultItem = SHOP_ITEMS.find(i => i.id === recipe.result.id);
                      return resultItem?.name || recipe.result.name || recipe.result.id;
                    })()} x{recipe.result.count}
                  </div>
                </div>

                <div className="text-xs text-gray-500 mb-3">
                  炼制时间: {recipe.craftTime}秒
                </div>

                <div className="text-xs text-gray-600 mb-3">
                  获取方式: 战斗掉落、秘境探索、商店购买
                </div>

                <button
                  onClick={() => handleCraft(recipe.id)}
                  disabled={!canCraft}
                  className={`w-full py-2 rounded-lg font-bold text-sm min-h-[44px] ${
                    canCraft 
                      ? 'bg-gray-800 text-white hover:bg-gray-700' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {!hasRealm ? '境界不足' : !canCraft ? '材料不足' : '开始炼制'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'materials' && (
        <div className="space-y-2">
          {ALCHEMY_MATERIALS_DATA.map((material) => {
            const count = getMaterialCount(material.id);
            const rarityColors: Record<string, string> = {
              common: 'bg-gray-100 text-gray-700 border-gray-300',
              uncommon: 'bg-green-100 text-green-700 border-green-300',
              rare: 'bg-blue-100 text-blue-700 border-blue-300',
              epic: 'bg-purple-100 text-purple-700 border-purple-300',
              legendary: 'bg-yellow-100 text-yellow-700 border-yellow-300'
            };

            const rarityNames: Record<string, string> = {
              common: '普通',
              uncommon: '优秀',
              rare: '稀有',
              epic: '史诗',
              legendary: '传说'
            };

            return (
              <div 
                key={material.id} 
                className={`p-3 rounded-xl border ${rarityColors[material.rarity] || rarityColors.common}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold">{material.name}</div>
                    <div className="text-xs opacity-80">{material.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">x{count}</div>
                    <div className="text-xs opacity-80">{rarityNames[material.rarity]}</div>
                  </div>
                </div>
                <div className="text-xs mt-2 opacity-80">
                  商店价格: {material.price}灵石
                </div>
                <div className="text-xs mt-1 opacity-80">
                  获取方式: 战斗、秘境、商店
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
