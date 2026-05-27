import React, { useState, useCallback } from 'react';
import { useGameStore, PET_TEMPLATES, BATTLE_QUOTES } from '../../store/gameStore';
import { Modal } from '../common/UIComponents';
import { executeBattleRound, processDefeat } from '../../systems/battleSystem';

interface WildPet {
  id: string;
  name: string;
  icon: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  loyalty: number;
  type: 'mount' | 'combat' | 'support';
  realm: number;
}

const WILD_PETS: WildPet[] = [
  { id: 'wild_tiger', name: '烈焰虎', icon: '虎', hp: 80, maxHp: 80, attack: 15, defense: 8, loyalty: 50, type: 'mount', realm: 0 },
  { id: 'wild_phoenix', name: '火凤', icon: '凤', hp: 60, maxHp: 60, attack: 25, defense: 5, loyalty: 40, type: 'combat', realm: 2 },
  { id: 'wild_turtle', name: '玄灵龟', icon: '龟', hp: 120, maxHp: 120, attack: 8, defense: 18, loyalty: 60, type: 'support', realm: 1 },
];

export const PetPanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const game = useGameStore();
  const [feedingPet, setFeedingPet] = useState<string | null>(null);
  const [petBattleState, setPetBattleState] = useState<'none' | 'fighting' | 'victory' | 'defeat'>('none');
  const [currentWildPet, setCurrentWildPet] = useState<WildPet | null>(null);
  const [wildPetHp, setWildPetHp] = useState(0);
  const [battleLogs, setBattleLogs] = useState<string[]>([]);

  const addLog = useCallback((log: string) => {
    setBattleLogs(prev => [...prev.slice(-49), log]);
  }, []);

  const handleFeed = useCallback((petId: string) => {
    const result = game.feedPet(petId);
    if (result.success) {
      setFeedingPet(null);
    }
    return result;
  }, [game]);

  const handleActivate = useCallback((petId: string) => {
    game.activatePet(petId);
  }, [game]);

  const startPetBattle = useCallback((pet: WildPet) => {
    if (game.stats.hp < 50) {
      game.showToast('气血不足，无法挑战灵宠！', 'error');
      return;
    }
    if (!game.useStamina(5)) {
      game.showToast('体力不足！', 'error');
      return;
    }
    game.takeDamage(30);
    setCurrentWildPet(pet);
    setWildPetHp(pet.hp);
    setPetBattleState('fighting');
    setBattleLogs([`发现野生灵宠：${pet.name}！`, '准备收服！']);
  }, [game]);

  const petBasicAttack = useCallback(() => {
    if (!currentWildPet || petBattleState !== 'fighting') return;

    const result = executeBattleRound(
      game,
      {
        id: currentWildPet.id || currentWildPet.name,
        name: currentWildPet.name,
        hp: currentWildPet.maxHp,
        maxHp: currentWildPet.maxHp,
        attack: currentWildPet.attack,
        defense: currentWildPet.defense,
        expReward: 0,
        goldReward: 20,
        isBoss: false,
      },
      null,
      wildPetHp,
      game.stats.hp,
      0
    );

    setWildPetHp(result.newMonsterHp);
    const damage = game.stats.hp - result.newPlayerHp;
    if (damage > 0) {
      game.takeDamage(damage);
    }
    result.logs.forEach(log => addLog(log));

    if (result.result === 'victory') {
      setPetBattleState('victory');
      game.markWildPetDefeated(currentWildPet.id);
      addLog('━━━━━━━━━━━━━━━━');
      addLog(`成功击败 ${currentWildPet.name}！`);
      addLog('灵宠驯服意愿降低，可以尝试收服了！');
    } else if (result.result === 'defeat') {
      setPetBattleState('defeat');
      processDefeat(game);
      addLog('━━━━━━━━━━━━━━━━');
      addLog('气血耗尽，收服失败！');
    }
  }, [currentWildPet, petBattleState, wildPetHp, game, addLog]);

  const usePetBattleItem = useCallback(() => {
    const qiPill = game.inventory.find(i => (i.id.includes('qi') || i.id.includes('heal')) && i.quantity > 0);
    if (qiPill) {
      game.heal(50);
      game.removeItem('qiPill.id', 1);
      addLog('使用淬体丹，恢复 50 气血！');
    } else {
      addLog('没有可用的丹药！');
    }
  }, [game, addLog]);

  const endPetBattle = useCallback(() => {
    setPetBattleState('none');
    setCurrentWildPet(null);
    setBattleLogs([]);
    if (game.stats.hp <= 0) {
      game.heal(Math.floor(game.stats.hpMax * 0.3));
      addLog('休息后恢复30%最大气血');
    }
  }, [game, addLog]);

  const handleCapture = useCallback((petId: string) => {
    const result = game.acquirePet(petId);
    if (result.success) {
      game.updateQuestProgress('acquire_pet', 1);
      game.showToast(result.msg, 'success');
    } else {
      game.showToast(result.msg, 'error');
    }
  }, [game]);

  const wildPetsAvailable = WILD_PETS.filter(p => {
    const petId = p.id.replace('wild_', 'pet_');
    return !game.pets.find(gp => gp.id === petId) && !game.wildPetsDefeated[p.id];
  });

  const wildPetsDefeated = WILD_PETS.filter(p => {
    const petId = p.id.replace('wild_', 'pet_');
    return game.wildPetsDefeated[p.id] && !game.pets.find(gp => gp.id === petId);
  });

  if (petBattleState !== 'none' && currentWildPet) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
        <div className="bg-white text-black p-3 rounded w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-300">
          <div className="text-center text-black font-bold text-base mb-2">【灵宠收服战】</div>

          <div className="flex justify-between items-center mb-2 bg-gray-50 p-3 rounded border border-gray-200">
            <div className="text-center">
              <div className="text-black font-bold">你的状态</div>
              <div>气血: {game.stats.hp}/{game.stats.hpMax}</div>
              <div>灵力: {game.stats.spiritualPower}/{game.stats.spiritualPowerMax}</div>
            </div>
            <div className="text-center">
              <div className="text-black font-bold text-base">
                {currentWildPet.icon} {currentWildPet.name}
              </div>
              <div className="w-full bg-gray-200 h-4 mt-2 rounded overflow-hidden">
                <div 
                  className="h-full bg-black rounded transition-all"
                  style={{ width: `${(wildPetHp / currentWildPet.maxHp) * 100}%` }}
                />
              </div>
              <div className="text-xs mt-1">气血: {wildPetHp}/{currentWildPet.maxHp}</div>
            </div>
          </div>

          <div className="flex-1 bg-gray-50 p-3 rounded mb-2 overflow-y-auto max-h-40 border border-gray-200">
            {battleLogs.slice(-15).map((log, i) => (
              <div key={i} className="text-sm leading-relaxed">{log}</div>
            ))}
          </div>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-1.5">
              <button 
                className="bg-gray-100 hover:bg-gray-200 py-3 rounded font-bold border border-gray-300 min-h-[44px]"
                onClick={petBasicAttack}
                disabled={petBattleState !== 'fighting'}
              >
                普通攻击
              </button>
              <button 
                className="bg-gray-100 hover:bg-gray-200 py-3 rounded font-bold border border-gray-300 min-h-[44px]"
                onClick={usePetBattleItem}
              >
                使用丹药
              </button>
            </div>

            <button 
              className="w-full bg-gray-200 hover:bg-gray-300 py-3 rounded font-bold border border-gray-300 min-h-[44px]"
              onClick={endPetBattle}
            >
              {petBattleState === 'victory' ? '收服成功！' : petBattleState === 'defeat' ? '收服失败' : '放弃收服'}
            </button>
          </div>

          {petBattleState === 'victory' && (
            <div className="mt-2 p-3 bg-gray-100 rounded border border-gray-300 text-center">
              <div className="font-bold text-black mb-2">收服进度已开启！</div>
              <div className="text-sm text-gray-600">现在可以喂养这只灵宠进行收服了！</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded p-3 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-bold text-black py-2.5">灵宠</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center">&times;</button>
      </div>

      {game.pets.length > 0 && (
        <div className="mb-2">
          <div className="text-sm font-bold text-black mb-2">已收服 ({game.pets.length}/{PET_TEMPLATES.length})</div>
          <div className="space-y-2">
            {game.pets.map((pet, i) => (
              <div 
                key={i} 
                className={`p-3 rounded border ${
                  game.activePet === pet.id ? 'bg-gray-100 border-black' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold">{pet.icon}</span>
                    <div>
                      <div className="font-bold text-black">{pet.name}</div>
                      <div className="text-xs text-gray-600">
                        {pet.type === 'mount' ? '坐骑' : pet.type === 'combat' ? '战斗' : '辅助'} | Lv.{pet.level}
                      </div>
                    </div>
                  </div>
                  {game.activePet === pet.id && (
                    <span className="px-2 py-1 bg-black text-white rounded text-xs">出战</span>
                  )}
                </div>

                <div className="text-xs text-gray-600 mb-2">
                  忠诚度: {pet.loyalty}/100
                  <div className="w-full bg-gray-200 h-1 mt-1 rounded">
                    <div 
                      className="h-full bg-black rounded"
                      style={{ width: `${pet.loyalty}%` }}
                    />
                  </div>
                </div>

                <div className="text-xs text-gray-600 mb-2">
                  {pet.stats.attack && <span className="mr-2">攻击+{pet.stats.attack}</span>}
                  {pet.stats.defense && <span className="mr-2">防御+{pet.stats.defense}</span>}
                  {pet.stats.speed && <span className="mr-2">速度+{pet.stats.speed}</span>}
                  {pet.stats.hp && <span>气血+{pet.stats.hp}</span>}
                </div>

                <div className="flex gap-2">
                  {game.activePet !== pet.id ? (
                    <button
                      onClick={() => handleActivate(pet.id)}
                      className="flex-1 bg-black text-white py-1 rounded text-xs min-h-[44px]"
                    >
                      出战
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivate('')}
                      className="flex-1 bg-gray-500 text-white py-1 rounded text-xs min-h-[44px]"
                    >
                      休息
                    </button>
                  )}
                  <button
                    onClick={() => setFeedingPet(pet.id)}
                    className="flex-1 bg-gray-600 text-white py-1 rounded text-xs min-h-[44px]"
                  >
                    喂养 (30灵石)
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {wildPetsDefeated.length > 0 && game.pets.length < PET_TEMPLATES.length && (
        <div className="mb-2">
          <div className="text-sm font-bold text-black mb-2">可收服 (击败后可喂养)</div>
          <div className="space-y-2">
            {wildPetsDefeated.map((pet, i) => {
              const petId = pet.id.replace('wild_', 'pet_');
              if (game.pets.find(p => p.id === petId)) return null;
              
              return (
                <div key={i} className="p-3 bg-gray-50 rounded border border-gray-300">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-base font-bold">{pet.icon}</span>
                    <div>
                      <div className="font-bold text-black">{pet.name}</div>
                      <div className="text-xs text-gray-600">
                        {pet.type === 'mount' ? '坐骑' : pet.type === 'combat' ? '战斗' : '辅助'}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const result = handleFeed(petId);
                        if (!result.success) {
                          game.showToast(result.msg, 'error');
                        }
                      }}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded text-sm font-bold min-h-[44px]"
                    >
                      喂养 (30灵石)
                    </button>
                    <button
                      onClick={() => handleCapture(petId)}
                      className="flex-1 bg-black hover:bg-gray-800 text-white py-2 rounded text-sm font-bold min-h-[44px]"
                    >
                      收服
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {wildPetsAvailable.length > 0 && (
        <div>
          <div className="text-sm font-bold text-black mb-2">野外灵宠</div>
          <div className="space-y-2">
            {wildPetsAvailable.map((pet, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-base font-bold">{pet.icon}</span>
                    <div>
                      <div className="font-bold text-black">{pet.name}</div>
                      <div className="text-xs text-gray-600">
                        境界: {game.getRealmNameByIndex(pet.realm)} | 气血: {pet.hp} | 攻击: {pet.attack} | 防御: {pet.defense}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => startPetBattle(pet)}
                    className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded text-sm font-bold min-h-[44px]"
                  >
                    挑战收服 (消耗30气血+5体力)
                  </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {game.pets.length === 0 && wildPetsAvailable.length === 0 && wildPetsDefeated.length === 0 && (
        <div className="text-center text-gray-500 p-3">
          <div className="text-base mb-1 font-bold">宠</div>
          <div className="text-xs">还没有灵宠</div>
          <div className="text-xs text-gray-500">击败野外灵宠后可尝试收服</div>
        </div>
      )}

      {feedingPet && (
        <Modal title="喂养灵宠" onClose={() => setFeedingPet(null)}>
          <div className="text-center">
            <div className="text-sm text-gray-600 mb-2">消耗30灵石，忠诚度+5~8</div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setFeedingPet(null)} 
              className="flex-1 bg-gray-200 py-2 rounded min-h-[44px]"
            >
              取消
            </button>
            <button 
              onClick={() => {
                const result = handleFeed(feedingPet);
                if (!result.success) {
                  game.showToast(result.msg, 'error');
                }
              }} 
              className="flex-1 bg-black text-white py-2 rounded min-h-[44px]"
            >
              喂养
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
