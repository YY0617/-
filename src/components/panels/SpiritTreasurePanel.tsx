import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useSpiritTreasureSystem } from '../../hooks/newGameHooks';
import { SPIRIT_TREASURES } from '../../data/spiritTreasures';

function getSpiritTreasure(id: string) {
  return SPIRIT_TREASURES.find(t => t.id === id) || null;
}

interface SpiritTreasurePanelProps {
  onClose?: () => void;
}

const SpiritTreasurePanel: React.FC<SpiritTreasurePanelProps> = ({ onClose }) => {
  const { spiritTreasures, treasureFragments, stats, realmStones, showToast } = useGameStore();
  const { 
    getInventoryTreasures, 
    getEquippedTreasures, 
    equipTreasure, 
    unequipTreasure,
    combineFragments 
  } = useSpiritTreasureSystem();

  const [activeTab, setActiveTab] = useState<'inventory' | 'all' | 'fragments'>('inventory');

  const getRarityLabel = (rarity: 'common' | 'rare' | 'epic' | 'legendary') => {
    switch (rarity) {
      case 'common': return '普通';
      case 'rare': return '稀有';
      case 'epic': return '史诗';
      case 'legendary': return '传说';
      default: return '未知';
    }
  };

  const renderTreasureCard = (treasure: any, owned: boolean = false, equipped: boolean = false) => {
    return (
      <div 
        key={treasure.id} 
        className={`p-3 rounded border bg-gray-50 ${equipped ? 'border-black' : 'border-gray-200'}`}
      >
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-black">{treasure.name}</h3>
          <div className="text-xs text-gray-600">
            {treasure.type === 'active' ? '主动' : '被动'}
          </div>
        </div>

        <p className="text-xs text-gray-600 mb-2">{treasure.lore}</p>

        <div className="text-xs space-y-1 mb-2 text-black">
          {treasure.effect.attack && <div>攻击: +{treasure.effect.attack}</div>}
          {treasure.effect.defense && <div>防御: +{treasure.effect.defense}</div>}
          {treasure.effect.hp && <div>气血: +{treasure.effect.hp}</div>}
          {treasure.effect.spiritualPower && <div>灵力: +{treasure.effect.spiritualPower}</div>}
          {treasure.effect.agility && <div>敏捷: +{treasure.effect.agility}</div>}
          {treasure.effect.intelligence && <div>悟性: +{treasure.effect.intelligence}</div>}
          {treasure.effect.luck && <div>福缘: +{treasure.effect.luck}</div>}
          {treasure.effect.critRate && <div>暴击: +{Math.round(treasure.effect.critRate * 100)}%</div>}
          {treasure.effect.special && <div>特效: {treasure.effect.special}</div>}
        </div>

        <div className="text-xs text-gray-600 mb-2">
          需求: 第 {treasure.requiredRealm + 1} 境界
        </div>

        {owned && !equipped && stats.realm >= treasure.requiredRealm && (
          <div className="flex gap-1.5">
            {treasure.type === 'active' && (
              <button 
                onClick={() => equipTreasure(treasure.id, 'active')} 
                className="flex-1 py-1 bg-black text-white text-xs rounded hover:bg-gray-800 min-h-[44px]"
              >
                装备(主动)
              </button>
            )}
            <button 
              onClick={() => equipTreasure(treasure.id, 'passive')} 
              className="flex-1 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 min-h-[44px]"
            >
              装备(被动)
            </button>
          </div>
        )}

        {equipped && (
          <button 
            onClick={() => unequipTreasure(treasure.id)} 
            className="w-full py-1 bg-gray-400 text-white text-xs rounded hover:bg-gray-500 min-h-[44px]"
          >
            卸下
          </button>
        )}

        {!owned && stats.realm >= treasure.requiredRealm && (
          <div className="text-center text-xs text-gray-500">
            尚未获得
          </div>
        )}
      </div>
    );
  };

  const inventoryTreasures = getInventoryTreasures();
  const equippedTreasures = getEquippedTreasures();

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-bold text-black py-2.5">灵宝系统</h2>
        {onClose && (
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            &times;
          </button>
        )}
      </div>

      <div className="flex gap-1.5 mb-2">
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`px-3 py-2 rounded border min-h-[44px] ${activeTab === 'inventory' ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300'}`}
        >
          我的灵宝
        </button>
        <button 
          onClick={() => setActiveTab('all')}
          className={`px-3 py-2 rounded border min-h-[44px] ${activeTab === 'all' ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300'}`}
        >
          灵宝图鉴
        </button>
        <button 
          onClick={() => setActiveTab('fragments')}
          className={`px-3 py-2 rounded border min-h-[44px] ${activeTab === 'fragments' ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300'}`}
        >
          碎片合成
        </button>
      </div>

      {activeTab === 'inventory' && (
        <div>
          <h3 className="font-bold mb-2 text-black">已装备</h3>
          <div className="grid grid-cols-1 gap-1.5 mb-2">
            {equippedTreasures.length === 0 ? (
              <div className="p-3 bg-gray-50 rounded border border-gray-200 text-center text-gray-500">
                暂无装备的灵宝
              </div>
            ) : (
              equippedTreasures.map((st) => {
                const treasure = getSpiritTreasure(st.treasureId);
                return treasure ? renderTreasureCard({ ...treasure, ...st }, true, true) : null;
              })
            )}
          </div>

          <h3 className="font-bold mb-2 text-black">背包</h3>
          <div className="grid grid-cols-1 gap-1.5">
            {inventoryTreasures.filter(st => !st.equipped).length === 0 ? (
              <div className="p-3 bg-gray-50 rounded border border-gray-200 text-center text-gray-500">
                背包空空如也，去秘境探索吧！
              </div>
            ) : (
              inventoryTreasures.filter(st => !st.equipped).map((st) => {
                const treasure = getSpiritTreasure(st.treasureId);
                return treasure ? renderTreasureCard({ ...treasure, ...st }, true, false) : null;
              })
            )}
          </div>
        </div>
      )}

      {activeTab === 'all' && (
        <div className="grid grid-cols-1 gap-1.5">
          {SPIRIT_TREASURES.map((treasure) => {
            const owned = spiritTreasures.some(st => st.treasureId === treasure.id);
            const equipped = spiritTreasures.some(st => st.treasureId === treasure.id && st.equipped);
            return renderTreasureCard(treasure, owned, equipped);
          })}
        </div>
      )}

      {activeTab === 'fragments' && (
        <div>
          <div className="mb-2 p-3 bg-gray-50 rounded border border-gray-200">
            <div className="text-black">
              当前秘境石: <span className="font-bold">{realmStones}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-1.5">
            {Object.entries(treasureFragments).map(([fragmentId, count]) => {
              const required = 10;
              const canCombine = count >= required;
              
              return (
                <div key={fragmentId} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <h3 className="font-bold text-black mb-2">传说灵宝碎片</h3>
                  <div className="text-black mb-2">
                    碎片: {count}/{required}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-black h-2 rounded-full" 
                      style={{ width: `${Math.min(100, (count / required) * 100)}%` }}
                    />
                  </div>
                  {canCombine && (
                    <button 
                      onClick={() => {
                        const result = combineFragments(fragmentId);
                        showToast(result.msg, 'info');
                      }} 
                      className="w-full py-2 bg-black text-white rounded hover:bg-gray-800 min-h-[44px]"
                    >
                      合成灵宝
                    </button>
                  )}
                </div>
              );
            })}
            {Object.keys(treasureFragments).length === 0 && (
              <div className="p-3 bg-gray-50 rounded border border-gray-200 text-center text-gray-500">
                  暂无碎片，去稀有秘境探索吧！
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SpiritTreasurePanel;
