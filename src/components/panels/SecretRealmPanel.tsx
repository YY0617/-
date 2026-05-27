import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { useSecretRealmSystem } from '../../hooks/newGameHooks';
import { SECRET_REALMS } from '../../data/secretRealms';

function getSecretRealm(realmId: string) {
  return SECRET_REALMS.find(r => r.id === realmId) || null;
}

function canAccessRealm(realm: { reqRealm: number }, playerRealm: number) {
  return realm.reqRealm <= playerRealm;
}

const REALM_NAMES = ['煅体境', '玄脉境', '武心境', '灵现境', '凌虚境', '悟道境', '冠绝境', '绝圣境', '圣君境', '君帝境'];

const SecretRealmPanel: React.FC = () => {
  const game = useGameStore();
  const { getAvailableRealms, getRealmProgress, enterRealm, exitRealm } = useSecretRealmSystem();
  const [selectedRealm, setSelectedRealm] = useState<string | null>(null);
  const [isExploring, setIsExploring] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [inBattle, setInBattle] = useState(false);
  const [currentMonster, setCurrentMonster] = useState<string | null>(null);

  const getRealmTypeLabel = (type: 'daily' | 'weekly' | 'special') => {
    switch (type) {
      case 'daily': return '日常';
      case 'weekly': return '周常';
      case 'special': return '特殊';
      default: return '未知';
    }
  };

  const handleEnterRealm = (realmId: string) => {
    const result = enterRealm(realmId);
    if (result.success) {
      setSelectedRealm(realmId);
      setIsExploring(true);
      setCurrentLevel(0);
    } else {
      game.showToast(result.msg, 'error');
    }
  };

  const startBattle = (monsterId: string) => {
    setCurrentMonster(monsterId);
    setInBattle(true);
  };

  const handleBattleComplete = (won: boolean) => {
    setInBattle(false);
    if (won) {
      handleLevelComplete(true);
    } else {
      const result = exitRealm(false, currentLevel);
      setIsExploring(false);
      setSelectedRealm(null);
      game.showToast('战斗失败！', 'error');
      if (result) {
        game.showToast(`获得 ${result.gold} 灵石，${result.exp} 修为！`, 'success');
      }
    }
  };

  const handleLevelComplete = (complete: boolean) => {
    const realm = getSecretRealm(selectedRealm!);
    if (!realm) return;

    if (complete && currentLevel < realm.levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
    } else {
      const rewards = exitRealm(complete, currentLevel);
      setIsExploring(false);
      setSelectedRealm(null);
      if (rewards) {
        game.showToast(`探索完成！获得 ${rewards.gold} 灵石，${rewards.exp} 修为，${rewards.realmStones} 秘境石！`, 'success');
      }
    }
  };

  const handleChoice = (choiceIndex: number) => {
    const realm = getSecretRealm(selectedRealm!);
    if (!realm) return;

    const level = realm.levels[currentLevel];
    const choice = level.choices?.[choiceIndex];
    
    if (choice) {
      if (choice.damage && choice.damage > 0) {
        game.takeDamage(choice.damage);
      }
      
      handleLevelComplete(true);
    }
  };

  if (inBattle && currentMonster) {
    return (
      <div className="p-3 text-center">
        <h2 className="text-base font-bold mb-2 text-black">战斗中</h2>
        <p className="mb-2 text-black">怪物ID: {currentMonster}</p>
        <button
          onClick={() => handleBattleComplete(true)}
          className="p-3 bg-black text-white rounded hover:bg-gray-800 mr-2 min-h-[44px]"
        >
          胜利
        </button>
        <button
          onClick={() => handleBattleComplete(false)}
          className="p-3 bg-gray-500 text-white rounded hover:bg-gray-600 min-h-[44px]"
        >
          失败
        </button>
      </div>
    );
  }

  if (isExploring && selectedRealm) {
    const realm = getSecretRealm(selectedRealm);
    if (!realm) return null;

    const level = realm.levels[currentLevel];

    return (
      <div className="p-3">
        <h2 className="text-base font-bold mb-2 text-black">
          {realm.name} - 第 {currentLevel + 1} 层
        </h2>

        <div className="bg-gray-50 p-3 rounded mb-2 border border-gray-200">
          <h3 className="font-bold mb-2 text-black">{level.name}</h3>
          <p className="text-gray-700 mb-2">{level.description}</p>

          {level.choices && level.choices.length > 0 && (
            <div className="space-y-2 mb-2">
              {level.choices.map((choice: any, index: number) => (
                <button
                  key={index}
                  onClick={() => handleChoice(index)}
                  className="w-full p-3 bg-white border border-gray-300 text-black rounded hover:bg-gray-100 text-left min-h-[44px]"
                >
                  {choice.text}
                  {choice.damage && (
                    <span className="text-gray-600 ml-2">(可能受到 {choice.damage} 点伤害)</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {(!level.choices || level.choices.length === 0) && level.monsters.length > 0 && (
            <div className="text-center">
              <p className="text-black mb-2">此层有强大的怪物守护！</p>
              <div className="mb-2">
                <span className="font-bold text-black">
                  怪物: {level.monsters.map((id: string) => {
                    const monster = game.monsters.find(m => m.id === id);
                    return monster ? monster.name : id;
                  }).join(', ')}
                </span>
              </div>
              <button
                onClick={() => startBattle(level.monsters[0])}
                className="p-3 bg-black text-white rounded hover:bg-gray-800 min-h-[44px]"
              >
                挑战怪物
              </button>
            </div>
          )}

          <div className="mt-2">
            <button
              onClick={() => {
                const rewards = exitRealm(false, currentLevel);
                setIsExploring(false);
                setSelectedRealm(null);
                if (rewards) {
                  game.showToast(`撤退成功！获得 ${rewards.gold} 灵石，${rewards.exp} 修为！`, 'success');
                }
              }}
              className="p-3 bg-gray-200 text-black rounded hover:bg-gray-300 min-h-[44px]"
            >
              撤退 (获得部分奖励)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-bold text-black py-2.5">秘境探索</h2>
        <div className="text-black">
          秘境石: <span className="font-bold">{game.realmStones}</span>
        </div>
      </div>

      <div className="space-y-2">
        {SECRET_REALMS.map((realm) => {
          const canAccess = canAccessRealm(realm, game.stats.realm);
          const progress = getRealmProgress(realm.id);
          
          return (
            <div
              key={realm.id}
              className={`p-3 rounded border ${
                canAccess ? 'bg-white border-gray-300' : 'bg-gray-100 border-gray-200 opacity-60'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-black">
                    {realm.name}
                  </h3>
                  <p className="text-sm text-gray-600">{realm.lore.substring(0, 50)}...</p>
                </div>
              </div>
              
              {canAccess && (
                <div className="mt-2">
                  <div className="text-sm text-gray-600 mb-2">
                    需求: {REALM_NAMES[realm.reqRealm]} | 体力: {realm.staminaCost}
                  </div>
                  <div className="text-sm text-gray-600 mb-2">
                    奖励: 灵石 {realm.rewards.gold[0]}-{realm.rewards.gold[1]}, 
                    秘境石 {realm.rewards.realmStones[0]}-{realm.rewards.realmStones[1]}
                    {realm.rewards.treasureFragments && (
                      <>, 灵宝碎片 {realm.rewards.treasureFragments[0]}-{realm.rewards.treasureFragments[1]}</>
                    )}
                  </div>

                  {progress && (
                    <div className="text-xs text-gray-500 mb-2">
                      已通关 {progress.timesCompleted} 次, 最高层 {progress.highestLevelReached + 1}
                    </div>
                  )}

                  <button
                    onClick={() => handleEnterRealm(realm.id)}
                    className="w-full py-2 bg-black text-white rounded hover:bg-gray-800 min-h-[44px]"
                  >
                    进入秘境
                  </button>
                </div>
              )}

              {!canAccess && (
                <div className="text-sm text-gray-500 mt-2">
                  境界不足，无法进入
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SecretRealmPanel;
