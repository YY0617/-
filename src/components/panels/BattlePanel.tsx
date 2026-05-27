import React, { useState } from 'react';
import { useGameStore, Monster, MonsterMechanism } from '../../store/gameStore';
import { useBattle } from '../../hooks/useBattle';
import { canSkipBattle } from '../../systems/battleSystem';

function getMechanismName(mechanism: MonsterMechanism): string {
  switch (mechanism.type) {
    case 'berserk': return '狂暴';
    case 'regeneration': return '再生(' + mechanism.hpPerTurn + '/回合)';
    case 'armorBreak': return '破甲(-' + mechanism.ignoreDefensePercent + '%)';
    case 'poison': return '毒素(' + mechanism.poisonPerTurn + '伤害)';
    case 'doubleStrike': return '连击(' + Math.floor(mechanism.chance * 100) + '%)';
    case 'reflect': return '反射(' + mechanism.percent + '%)';
    case 'dodge': return '闪避(+' + mechanism.bonus + '%)';
    default: return '未知';
  }
}

function getMechanismClass(mech: MonsterMechanism): string {
  return 'px-2 py-1 rounded text-xs border border-gray-300 bg-gray-100 text-black';
}

export const BattlePanel: React.FC = () => {
  const game = useGameStore();
  const {
    battleState,
    setBattleState,
    currentMonster,
    setCurrentMonster,
    monsterHp,
    setMonsterHp,
    playerHp,
    bossPhase,
    setBossPhase,
    showBattleConfirm,
    setShowBattleConfirm,
    confirmBattle,
    basicAttack,
    useSkill,
    useBattleItem,
    endBattle,
    logs,
    isAutoBattle,
    toggleAutoBattle,
    skipBattle,
    damageNumbers,
    showBreakthroughEffect,
  } = useBattle();

  const consumables = game.inventory.filter(item => item.type === 'consumable');
  const isBoss = currentMonster?.isBoss ?? false;
  const canSkip = currentMonster && canSkipBattle(game.stats, currentMonster);
  
  // 检查每日广告解锁
  const hasAdUnlocked = game.adWatch && game.adWatch.records.length > 0;
  const lastAdTime = hasAdUnlocked ? game.adWatch.records[game.adWatch.records.length - 1].timestamp : 0;
  const isToday = new Date(lastAdTime).toDateString() === new Date().toDateString();
  const hasDailyUnlock = hasAdUnlocked && isToday;

  if (battleState !== 'none' && currentMonster) {
    return (
      <div className="bg-white text-black rounded border border-gray-300 min-h-[75vh] flex flex-col relative">
        {showBreakthroughEffect && (
          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 pointer-events-none">
            <div className="text-center animate-pulse">
              <div className="text-4xl font-bold text-yellow-400 mb-2">✨ 突破成功 ✨</div>
              <div className="text-white text-lg">恭喜突破境界！</div>
            </div>
          </div>
        )}
        
        <div className="text-center text-black font-bold text-base py-3 border-b border-gray-200">【战斗】</div>
        
        <div className="flex justify-between items-center p-3 bg-gray-50 border-b border-gray-200 relative">
          <div className="text-center text-xs">
            <div className="text-black font-bold text-sm mb-1">你的状态</div>
            <div>气血: {playerHp}/{game.stats.hpMax}</div>
            <div>灵力: {game.stats.spiritualPower}/{game.stats.spiritualPowerMax}</div>
            {damageNumbers.filter(d => d.target === 'player').map(dmg => (
              <div key={dmg.id} className={`absolute left-4 top-0 text-lg font-bold animate-bounce ${
                dmg.type === 'crit' ? 'text-orange-500' : 
                dmg.type === 'heal' ? 'text-green-500' : 'text-red-500'
              }`}>
                {dmg.type === 'heal' ? '+' : '-'}{dmg.value}
                {dmg.type === 'crit' && '💥'}
              </div>
            ))}
          </div>
          <div className="text-center flex-1 ml-3 relative">
            <div className="text-black font-bold text-base">{currentMonster.name}</div>
            {isBoss && (
              <div className="text-[10px] text-black mt-0.5">
                阶段{bossPhase} {(bossPhase > 1) && `(攻+${(bossPhase-1)*20}%)`}
              </div>
            )}
            <div className="w-full bg-gray-200 h-3 mt-1.5 rounded overflow-hidden">
              <div 
                className="h-full rounded transition-all bg-black" 
                style={{width: ((monsterHp / currentMonster.hp) * 100) + '%'}}
              />
            </div>
            <div className="text-[10px] mt-0.5">{monsterHp}/{currentMonster.hp}</div>
            {damageNumbers.filter(d => d.target === 'monster').map(dmg => (
              <div key={dmg.id} className={`absolute right-4 top-0 text-lg font-bold animate-bounce ${
                dmg.type === 'crit' ? 'text-orange-500' : 'text-red-500'
              }`}>
                -{dmg.value}
                {dmg.type === 'crit' && '💥'}
              </div>
            ))}
          </div>
        </div>

        {currentMonster.mechanisms && currentMonster.mechanisms.length > 0 && (
          <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
            <div className="text-xs text-black mb-1">【怪物机制】</div>
            <div className="flex flex-wrap gap-1">
              {currentMonster.mechanisms.map((mech, i) => (
                <div key={i} className={getMechanismClass(mech)}>
                  {getMechanismName(mech)}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex-1 bg-gray-50 p-3 overflow-y-auto border-b border-gray-200" style={{maxHeight: '25vh'}}>
          {logs.slice(-15).map((log, i) => (
            <div key={i} className="text-xs leading-relaxed">{log}</div>
          ))}
        </div>

        <div className="p-3 space-y-2">
          <div className="grid grid-cols-2 gap-1.5">
            <button 
              className="bg-gray-100 hover:bg-gray-200 py-3 rounded font-bold text-sm border border-gray-300 min-h-[44px]" 
              onClick={basicAttack}
              disabled={battleState !== 'fighting'}
            >
              普通攻击
            </button>
            {game.skills.slice(0, 3).map((sk, i) => (
              <button 
                key={i} 
                className="bg-gray-100 hover:bg-gray-200 py-3 rounded font-bold text-xs border border-gray-300 min-h-[44px]"
                onClick={() => useSkill(i)}
                disabled={battleState !== 'fighting'}
              >
                {sk.name} ({sk.spiritualPowerCost}灵力)
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            <button 
              className={`py-2.5 rounded text-xs font-bold min-h-[40px] transition-all ${
                game.battleStrategy === 'aggressive'
                  ? 'bg-red-600 text-white ring-2 ring-red-400'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
              onClick={() => {
                game.selectBattleStrategy('aggressive');
                game.showToast('激进：攻击+12%，暴击+4%，防御-8%', 'info');
              }}
            >
              激进
            </button>
            <button 
              className={`py-2.5 rounded text-xs font-bold min-h-[40px] transition-all ${
                game.battleStrategy === 'balanced'
                  ? 'bg-blue-600 text-white ring-2 ring-blue-400'
                  : 'bg-gray-600 text-white hover:bg-gray-500'
              }`}
              onClick={() => {
                game.selectBattleStrategy('balanced');
                game.showToast('平衡：攻击+3%，防御+3%，暴击+2%', 'info');
              }}
            >
              平衡
            </button>
            <button 
              className={`py-2.5 rounded text-xs font-bold min-h-[40px] transition-all ${
                game.battleStrategy === 'defensive'
                  ? 'bg-green-600 text-white ring-2 ring-green-400'
                  : 'bg-gray-500 text-white hover:bg-gray-400'
              }`}
              onClick={() => {
                game.selectBattleStrategy('defensive');
                game.showToast('保守：防御+18%，闪避+10%，攻击-6%', 'info');
              }}
            >
              保守
            </button>
          </div>

          <div className="flex gap-1.5">
            {hasDailyUnlock ? (
              <button 
                className="flex-1 bg-orange-500 hover:bg-orange-600 py-2.5 rounded font-bold text-xs text-white min-h-[40px]"
                onClick={skipBattle}
                disabled={battleState !== 'fighting'}
              >
                一键跳过
              </button>
            ) : (
              <button 
                className="flex-1 bg-gray-300 py-2.5 rounded font-bold text-xs text-gray-500 cursor-not-allowed min-h-[40px]"
                disabled
              >
                一键跳过（看广告解锁）
              </button>
            )}
            <button 
              className={'flex-1 py-2.5 rounded font-bold text-xs text-white min-h-[40px] ' + (isAutoBattle ? 'bg-black' : 'bg-gray-600')}
              onClick={toggleAutoBattle}
              disabled={battleState !== 'fighting'}
            >
              {isAutoBattle ? '停止自动' : '自动战斗'}
            </button>
          </div>

          {consumables.length > 0 && (
            <div className="grid grid-cols-2 gap-1.5">
              {consumables.slice(0, 4).map((item, i) => (
                <button 
                  key={i} 
                  className="bg-gray-100 hover:bg-gray-200 py-2.5 rounded text-xs border border-gray-300 min-h-[40px]"
                  onClick={() => useBattleItem(i)}
                >
                  {item.name} x{item.quantity}
                </button>
              ))}
            </div>
          )}

          <button 
            className="w-full bg-gray-200 hover:bg-gray-300 py-3 rounded font-bold text-sm border border-gray-300 min-h-[44px]"
            onClick={endBattle}
          >
            {battleState === 'victory' ? '胜利！继续' : battleState === 'defeat' ? '复活继续' : '逃跑'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-gray-300 rounded">
        <h2 className="text-center font-bold text-base py-3 border-b border-gray-200 text-black">挑战妖兽</h2>
        <div className="p-3 space-y-2">
          {game.monsters
            .filter(m => m.realm <= game.stats.realm)
            .map((m, i) => (
            <button 
              key={i} 
              className={'w-full bg-white border p-3 rounded text-left hover:bg-gray-50 ' + (m.isBoss ? 'border-black' : 'border-gray-200')} 
              onClick={() => setShowBattleConfirm(m)}
            >
              <div className="flex justify-between items-center">
                <div className="font-bold text-sm text-black">
                  {m.name}
                  {(m.isBoss || m.id.toLowerCase().includes('boss')) && (
                    <span className="ml-1.5 text-black text-[10px]">【妖王】</span>
                  )}
                </div>
                <div className="text-[10px] text-gray-600">{game.getRealmNameByIndex(m.realm)}</div>
              </div>
              <div className="text-[10px] text-gray-600 mt-1">
                气血:{m.hp} 攻击:{m.attack} 奖励:{m.expReward}修为 {m.goldReward}灵石
              </div>
              {m.mechanisms && m.mechanisms.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {m.mechanisms.map((mech, j) => (
                    <span key={j} className={getMechanismClass(mech)}>
                      {getMechanismName(mech)}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
          
          <div className="pt-2 border-t border-gray-200 space-y-2">
            {hasDailyUnlock ? (
              <button 
                className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded font-bold text-sm text-white min-h-[44px]"
                onClick={() => {
                  const firstMonster = game.monsters.find(m => m.realm <= game.stats.realm);
                  if (firstMonster) {
                    setShowBattleConfirm(firstMonster);
                  }
                }}
              >
                一键挑战（已解锁）
              </button>
            ) : (
              <button 
                className="w-full bg-gray-300 py-3 rounded font-bold text-sm text-gray-500 cursor-not-allowed min-h-[44px]"
                disabled
              >
                一键挑战（观看广告解锁）
              </button>
            )}
          </div>
        </div>
      </div>

      {showBattleConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded p-5 max-w-sm w-full shadow-xl border border-gray-300">
            <h3 className="text-lg font-bold text-center mb-3 text-black">确认挑战</h3>
            <div className="bg-gray-50 rounded p-3 mb-3 border border-gray-200 text-xs">
              <div className="flex justify-between items-center mb-1.5">
                <span className="font-bold text-sm text-black">{showBattleConfirm.name}</span>
                {(showBattleConfirm.isBoss || showBattleConfirm.id.toLowerCase().includes('boss')) && (
                  <span className="text-black text-xs">【妖王】</span>
                )}
              </div>
              <div className="text-gray-600 space-y-1">
                  <div>境界: {game.getRealmNameByIndex(showBattleConfirm.realm)}</div>
                  <div>气血: {showBattleConfirm.hp}</div>
                  <div>攻击: {showBattleConfirm.attack} 防御: {showBattleConfirm.defense}</div>
                {showBattleConfirm.mechanisms && showBattleConfirm.mechanisms.length > 0 && (
                  <div className="mt-1.5">
                    <div className="mb-1">机制:</div>
                    <div className="flex flex-wrap gap-1">
                      {showBattleConfirm.mechanisms.map((mech, j) => (
                        <span key={j} className={getMechanismClass(mech)}>
                          {getMechanismName(mech)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="text-xs text-gray-600 mb-3 text-center">消耗8点体力</div>
            <div className="flex gap-2">
              <button 
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-2.5 rounded text-sm min-h-[44px]"
                onClick={() => setShowBattleConfirm(null)}
              >
                取消
              </button>
              <button 
                className="flex-1 bg-black hover:bg-gray-800 text-white py-2.5 rounded text-sm min-h-[44px]"
                onClick={() => confirmBattle(showBattleConfirm)}
              >
                挑战
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
