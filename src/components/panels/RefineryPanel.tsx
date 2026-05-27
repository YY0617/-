import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { 
  REFINERY_MATERIALS, 
  REFINERY_RECIPES, 
  REFINERY_ITEMS,
  type RefineryState,
  type RefineryRecipe
} from '../../data/refineryData';

export const RefineryPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const game = useGameStore();
  const [activeTab, setActiveTab] = useState<'refine' | 'materials' | 'history'>('refine');

  useEffect(() => {
    if (!game.refinery) {
      const initial: RefineryState = {
        level: 1,
        experience: 0,
        maxExperience: 100,
        successBonus: 0,
        qualityBonus: 0,
        bonusStats: {},
        unlockedRecipes: ['iron_sword'],
        recentCreations: [],
        totalItemsCreated: 0,
        totalLegendaryItems: 0
      };
      game.setRefinery(initial);
    }
  }, [game.refinery]);

  const getMaterialCount = (materialId: string): number => {
    const item = game.inventory.find(i => i.id === materialId);
    return item ? item.quantity : 0;
  };

  const refineItem = (recipe: RefineryRecipe) => {
    if (!game.refinery) return;
    if (recipe.requiredLevel > game.refinery.level) {
      game.showToast('炼器等级不足！', 'error');
      return;
    }

    // 检查材料是否足够
    for (const material of recipe.materials) {
      const count = getMaterialCount(material.materialId);
      if (count < material.quantity) {
        const mat = REFINERY_MATERIALS.find(m => m.id === material.materialId);
        game.showToast(`材料不足: ${mat?.name || material.materialId} x${material.quantity}`, 'error');
        return;
      }
    }

    // 消耗材料
    for (const material of recipe.materials) {
      game.removeItem(material.materialId, material.quantity);
    }

    const successRate = recipe.successRate + game.refinery.successBonus;
    const success = Math.random() < successRate;

    if (success) {
      const itemData = REFINERY_ITEMS[recipe.resultItemId];
      if (itemData) {
        // 添加物品到背包
        game.addItem(
          { id: recipe.resultItemId, name: itemData.name, type: 'consumable', description: itemData.description || '', price: 0 },
          1
        );
        game.showToast(`炼器成功！获得${itemData.name}！`, 'success');
      }

      let newExp = game.refinery.experience + recipe.experienceReward;
      let newLevel = game.refinery.level;
      let newMaxExp = game.refinery.maxExperience;
      
      while (newExp >= newMaxExp) {
        newExp -= newMaxExp;
        newLevel++;
        newMaxExp = 100 + (newLevel - 1) * 50;
      }

      const newRefinery: RefineryState = {
        ...game.refinery,
        level: newLevel,
        experience: newExp,
        maxExperience: newMaxExp,
        successBonus: Math.min(0.3, newLevel * 0.02),
        totalItemsCreated: game.refinery.totalItemsCreated + 1,
        recentCreations: [
          { 
            itemId: recipe.resultItemId, 
            success: true, 
            timestamp: Date.now(), 
            grade: recipe.baseGrade 
          },
          ...game.refinery.recentCreations.slice(0, 9)
        ]
      };
      
      if (recipe.baseGrade === 'tian' || recipe.baseGrade === 'dao' || recipe.baseGrade === 'hun') {
        newRefinery.totalLegendaryItems++;
      }

      game.setRefinery(newRefinery);
      game.recordItemRefined();
    } else {
      game.showToast('炼器失败...材料损失了...', 'error');
      game.setRefinery({
        ...game.refinery,
        recentCreations: [
          { 
            itemId: recipe.resultItemId, 
            success: false, 
            timestamp: Date.now(), 
            grade: recipe.baseGrade 
          },
          ...game.refinery.recentCreations.slice(0, 9)
        ]
      });
    }
  };

  const ref = game.refinery;
  if (!ref) return null;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">炼器系统</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center">×</button>
      </div>
      
      <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-yellow-50 rounded border border-orange-200">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold">炼器等级 {ref.level}</span>
          <span className="text-sm text-gray-600">{ref.experience}/{ref.maxExperience} EXP</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-orange-500 h-2 rounded-full transition-all" 
            style={{ width: `${(ref.experience / ref.maxExperience) * 100}%` }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">成功率加成: +{(ref.successBonus * 100).toFixed(0)}%</div>
      </div>

      <div className="flex gap-2 mb-4 border-b pb-2">
        {(['refine', 'materials', 'history'] as const).map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-lg font-bold text-sm min-h-[44px] ${activeTab === tab ? 'bg-orange-100 text-orange-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {{ refine: '炼器', materials: '材料', history: '记录' }[tab]}
          </button>
        ))}
      </div>

      {activeTab === 'refine' && (
        <div className="space-y-3">
          {REFINERY_RECIPES.map(recipe => {
            const itemData = REFINERY_ITEMS[recipe.resultItemId];
            const canRefine = recipe.requiredLevel <= ref.level;
            const hasMaterials = recipe.materials.every(m => getMaterialCount(m.materialId) >= m.quantity);
            
            const successRate = recipe.successRate + ref.successBonus;

            return (
              <div key={recipe.id} className={`p-3 rounded-lg border ${canRefine ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-300 opacity-60'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{itemData?.name || recipe.name}</h3>
                    <p className="text-sm text-gray-600">{recipe.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium">成功率: {Math.floor(successRate * 100)}%</span>
                    <span className={`ml-2 text-xs px-2 py-1 rounded-full ${
                      recipe.baseGrade === 'huang' ? 'bg-gray-100 text-gray-700' :
                      recipe.baseGrade === 'xuan' ? 'bg-blue-100 text-blue-700' :
                      recipe.baseGrade === 'di' ? 'bg-green-100 text-green-700' :
                      recipe.baseGrade === 'tian' ? 'bg-purple-100 text-purple-700' :
                      recipe.baseGrade === 'dao' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {recipe.baseGrade === 'huang' ? '黄品' :
                       recipe.baseGrade === 'xuan' ? '玄品' :
                       recipe.baseGrade === 'di' ? '地品' :
                       recipe.baseGrade === 'tian' ? '天品' :
                       recipe.baseGrade === 'dao' ? '道品' : '混品'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2 text-xs text-gray-500 mb-3">
                  <div className="font-bold mb-1">材料:</div>
                  <div className="flex flex-wrap gap-2">
                    {recipe.materials.map(m => {
                      const mat = REFINERY_MATERIALS.find(mt => mt.id === m.materialId);
                      const hasEnough = getMaterialCount(m.materialId) >= m.quantity;
                      return (
                        <span 
                          key={m.materialId}
                          className={`inline-block px-2 py-1 rounded-full text-xs ${hasEnough ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                        >
                          {mat?.name} x{getMaterialCount(m.materialId)}/{m.quantity}
                        </span>
                      );
                    })}
                  </div>
                </div>
                
                <div className="text-xs text-orange-600 mb-2">
                  需要炼器等级: {recipe.requiredLevel} | 经验: +{recipe.experienceReward}
                </div>
                
                <button 
                  onClick={() => refineItem(recipe)}
                  disabled={!canRefine || !hasMaterials}
                  className={`w-full px-4 py-2 rounded-lg font-bold text-sm min-h-[44px] ${
                    (canRefine && hasMaterials) ? 
                      'bg-orange-600 hover:bg-orange-700 text-white' : 
                      'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {!canRefine ? '等级不足' : !hasMaterials ? '材料不足' : '开始炼器'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'materials' && (
        <div className="space-y-3">
          {REFINERY_MATERIALS.map(mat => {
            const count = getMaterialCount(mat.id);
            const gradeNames: Record<string, string> = {
              common: '普通',
              rare: '稀有',
              epic: '史诗',
              legendary: '传说'
            };
            return (
              <div key={mat.id} className="p-3 bg-white rounded-lg border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{mat.name}</h3>
                    <p className="text-sm text-gray-600">{mat.description}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    mat.grade === 'common' ? 'bg-gray-100 text-gray-700' :
                    mat.grade === 'rare' ? 'bg-blue-100 text-blue-700' :
                    mat.grade === 'epic' ? 'bg-purple-100 text-purple-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {gradeNames[mat.grade]}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  类型: {mat.type === 'metal' ? '金属' :
                         mat.type === 'stone' ? '石材' :
                         mat.type === 'herb' ? '草药' :
                         mat.type === 'essence' ? '精华' : '灵魂'}
                </div>
                <div className="text-sm font-bold mt-1 text-gray-700">
                  背包: {count} 个
                </div>
                <div className="text-xs text-gray-500">
                  获取: 战斗/秘境/商店
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-2">
          <div className="text-center text-sm text-gray-500 mb-4">
            <div>总炼器次数: {ref.totalItemsCreated}</div>
            <div>传说物品: {ref.totalLegendaryItems}</div>
          </div>
          {ref.recentCreations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">暂无记录</div>
          ) : (
            ref.recentCreations.map((creation, i) => {
              const item = REFINERY_ITEMS[creation.itemId];
              return (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between">
                    <span className="font-medium">{item?.name || creation.itemId}</span>
                    <span className={creation.success ? 'text-green-600' : 'text-red-600'}>
                      {creation.success ? '成功' : '失败'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(creation.timestamp).toLocaleString()}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
