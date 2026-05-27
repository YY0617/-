import { useState, useCallback, useRef, useEffect } from 'react';
import { useGameStore, Monster } from '../store/gameStore';
import { executeBattleRound, processVictory, canSkipBattle } from '../systems/battleSystem';
import { BATTLE_QUOTES } from '../constants/gameConstants';

export function useBattle() {
  const game = useGameStore();
  const [battleState, setBattleState] = useState<'none' | 'fighting' | 'victory' | 'defeat'>('none');
  const [currentMonster, setCurrentMonster] = useState<Monster | null>(null);
  const [monsterHp, setMonsterHp] = useState(0);
  const [playerHp, setPlayerHp] = useState(0);
  const [bossPhase, setBossPhase] = useState(1);
  const [logs, setLogs] = useState<string[]>([]);
  const [showBattleConfirm, setShowBattleConfirm] = useState<Monster | null>(null);
  const [isAutoBattle, setIsAutoBattle] = useState(false);
  const [damageNumbers, setDamageNumbers] = useState<Array<{id: number; value: number; type: 'damage' | 'heal' | 'crit'; target: 'player' | 'monster'}>>([]);
  const [showBreakthroughEffect, setShowBreakthroughEffect] = useState(false);
  const autoBattleTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoBattleRef = useRef<() => void>();
  const battleLogRef = useRef<HTMLDivElement>(null);
  const damageIdRef = useRef(0);

  useEffect(() => {
    if (battleLogRef.current) {
      battleLogRef.current.scrollTop = battleLogRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = useCallback((log: string) => {
    setLogs(prev => [...prev.slice(-49), log]);
  }, []);

  const showDamageNumber = useCallback((value: number, type: 'damage' | 'heal' | 'crit', target: 'player' | 'monster') => {
    const id = damageIdRef.current++;
    setDamageNumbers(prev => [...prev, { id, value, type, target }]);
    setTimeout(() => {
      setDamageNumbers(prev => prev.filter(d => d.id !== id));
    }, 1000);
  }, []);

  const triggerBreakthroughEffect = useCallback(() => {
    setShowBreakthroughEffect(true);
    setTimeout(() => setShowBreakthroughEffect(false), 3000);
  }, []);

  const confirmBattle = useCallback((monster: Monster) => {
    if (!game.useStamina(8)) {
      addLog('体力不足！');
      setShowBattleConfirm(null);
      return;
    }

    setLogs([]);
    setCurrentMonster(monster);
    setMonsterHp(monster.hp);
    setPlayerHp(game.stats.hp);
    setBattleState('fighting');
    setIsAutoBattle(false);

    const isBoss = monster.isBoss ?? false;
    setBossPhase(isBoss ? 1 : 0);

    addLog(`遭遇 ${monster.name}！`);
    if (isBoss) {
      addLog('【妖王】进入战斗！');
    }
    addLog(BATTLE_QUOTES.attack[Math.floor(Math.random() * BATTLE_QUOTES.attack.length)]);
    setShowBattleConfirm(null);
  }, [game, addLog]);

  const basicAttack = useCallback(() => {
    if (!currentMonster || battleState !== 'fighting') return;

    const result = executeBattleRound(
      game,
      currentMonster,
      null,
      monsterHp,
      playerHp,
      bossPhase
    );

    setMonsterHp(result.newMonsterHp);
    setPlayerHp(result.newPlayerHp);
    const damage = playerHp - result.newPlayerHp;
    if (damage > 0) {
      game.takeDamage(damage);
      showDamageNumber(damage, 'damage', 'player');
    }
    const monsterDamage = monsterHp - result.newMonsterHp;
    if (monsterDamage > 0) {
      showDamageNumber(monsterDamage, result.isCrit ? 'crit' : 'damage', 'monster');
    }
    result.logs.forEach(log => addLog(log));

    if (result.phaseChange) {
      setBossPhase(result.phaseChange.newPhase);
    }

    if (result.result === 'victory') {
      setBattleState('victory');
      const victoryResult = processVictory(game, currentMonster);
      victoryResult.logs.forEach(log => addLog(log));
      addLog(BATTLE_QUOTES.kill[Math.floor(Math.random() * BATTLE_QUOTES.kill.length)]);
      game.showToast(`战斗胜利！获得 ${victoryResult.expReward} 修为，${victoryResult.goldReward} 灵石！`, 'success');
      setIsAutoBattle(false);
    } else if (result.result === 'defeat') {
      setBattleState('defeat');
      game.takeDamage(game.stats.hpMax);
      setIsAutoBattle(false);
    }
  }, [currentMonster, battleState, monsterHp, playerHp, bossPhase, game, addLog]);

  const useSkill = useCallback((skillIndex: number) => {
    if (!currentMonster || battleState !== 'fighting') return;

    const skill = game.skills[skillIndex];
    if (!skill) return;

    if (!game.useSpiritualPower(skill.spiritualPowerCost)) {
      addLog('灵力不足！');
      return;
    }

    const result = executeBattleRound(
      game,
      currentMonster,
      skill,
      monsterHp,
      playerHp,
      bossPhase
    );

    setMonsterHp(result.newMonsterHp);
    setPlayerHp(result.newPlayerHp);
    const damage = playerHp - result.newPlayerHp;
    if (damage > 0) {
      game.takeDamage(damage);
      showDamageNumber(damage, 'damage', 'player');
    }
    const monsterDamage = monsterHp - result.newMonsterHp;
    if (monsterDamage > 0) {
      showDamageNumber(monsterDamage, result.isCrit ? 'crit' : 'damage', 'monster');
    }
    addLog(`【${skill.name}】`);
    result.logs.forEach(log => addLog(log));

    if (result.phaseChange) {
      setBossPhase(result.phaseChange.newPhase);
    }

    if (result.result === 'victory') {
      setBattleState('victory');
      const victoryResult = processVictory(game, currentMonster);
      victoryResult.logs.forEach(log => addLog(log));
      addLog(BATTLE_QUOTES.kill[Math.floor(Math.random() * BATTLE_QUOTES.kill.length)]);
      game.showToast(`战斗胜利！获得 ${victoryResult.expReward} 修为，${victoryResult.goldReward} 灵石！`, 'success');
      setIsAutoBattle(false);
    } else if (result.result === 'defeat') {
      setBattleState('defeat');
      game.takeDamage(game.stats.hpMax);
      setIsAutoBattle(false);
    }
  }, [currentMonster, battleState, monsterHp, playerHp, bossPhase, game, addLog]);

  const useBattleItem = useCallback((itemIndex: number) => {
    const item = game.inventory[itemIndex];
    if (!item || item.type !== 'consumable') return;

    if (item.id.includes('qi')) {
      game.heal(50);
      setPlayerHp(prev => Math.min(game.stats.hpMax, prev + 50));
      addLog('使用淬体丹，恢复50气血！');
    } else if (item.id.includes('spirit')) {
      game.restoreSpiritualPower(30);
      addLog('使用通脉丹，恢复30灵力！');
    } else if (item.id.includes('big_qi')) {
      game.heal(120);
      setPlayerHp(prev => Math.min(game.stats.hpMax, prev + 120));
      addLog('使用凝元丹，恢复120气血！');
    } else if (item.id.includes('big_spirit')) {
      game.restoreSpiritualPower(70);
      addLog('使用聚灵丹，恢复70灵力！');
    } else if (item.id.includes('stamina')) {
      game.recoverStamina(20);
      addLog('使用养神丹，恢复20体力！');
    }

    game.removeItem(item.id, 1);
  }, [game, addLog]);

  const endBattle = useCallback(() => {
    setBattleState('none');
    setCurrentMonster(null);
    setBossPhase(1);
    setLogs([]);
    setIsAutoBattle(false);
    if (autoBattleTimerRef.current) {
      clearInterval(autoBattleTimerRef.current);
      autoBattleTimerRef.current = null;
    }

    if (game.stats.hp <= 0) {
      game.heal(Math.floor(game.stats.hpMax * 0.5));
    }

    game.advanceGameTime(180);
    game.triggerRandomEvent();
  }, [game]);

  const skipBattle = useCallback(() => {
    if (!currentMonster) return;
    if (!canSkipBattle(game.stats, currentMonster)) {
      addLog('实力不足，无法跳过战斗！');
      return;
    }

    setBattleState('victory');
    const victoryResult = processVictory(game, currentMonster);
    setLogs(['━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', '🎉 自动战斗胜利！', '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━']);
    victoryResult.logs.forEach(log => addLog(log));
    addLog(BATTLE_QUOTES.kill[Math.floor(Math.random() * BATTLE_QUOTES.kill.length)]);
    game.showToast(`战斗胜利！获得 ${victoryResult.expReward} 修为，${victoryResult.goldReward} 灵石！`, 'success');
    setIsAutoBattle(false);
  }, [currentMonster, game, addLog]);

  // 激进、平衡、保守策略的自动战斗
  autoBattleRef.current = () => {
    const strategy = game.battleStrategy || 'balanced';
    const hpPercent = playerHp / game.stats.hpMax;
    
    // 保守策略：低血量就吃药
    if (strategy === 'defensive' && hpPercent < 0.3) {
      const consumables = game.inventory.filter(item => item.type === 'consumable');
      const qiPill = consumables.find(item => item.id.includes('qi'));
      if (qiPill) {
        const index = game.inventory.indexOf(qiPill);
        if (index !== -1) {
          useBattleItem(index);
          return;
        }
      }
    }

    // 激进：始终用技能
    if (strategy === 'aggressive') {
      if (game.skills.length > 0 && game.stats.spiritualPower >= game.skills[0].spiritualPowerCost) {
        useSkill(0);
      } else {
        basicAttack();
      }
    } 
    // 平衡：有技能且灵力够就用技能，否则普攻
    else if (strategy === 'balanced') {
      if (game.skills.length > 0 && game.stats.spiritualPower >= game.skills[0].spiritualPowerCost) {
        useSkill(0);
      } else {
        basicAttack();
      }
    } 
    // 保守：尽量普攻保灵力，低血吃药
    else {
      basicAttack();
    }
  };

  const toggleAutoBattle = useCallback(() => {
    if (battleState !== 'fighting') return;

    if (isAutoBattle) {
      setIsAutoBattle(false);
      if (autoBattleTimerRef.current) {
        clearInterval(autoBattleTimerRef.current);
        autoBattleTimerRef.current = null;
      }
    } else {
      setIsAutoBattle(true);
      autoBattleTimerRef.current = setInterval(() => {
        autoBattleRef.current?.();
      }, 1000);
    }
  }, [battleState, isAutoBattle]);

  return {
    battleState,
    setBattleState,
    currentMonster,
    setCurrentMonster,
    monsterHp,
    setMonsterHp,
    playerHp,
    setPlayerHp,
    bossPhase,
    setBossPhase,
    logs,
    setLogs,
    showBattleConfirm,
    setShowBattleConfirm,
    confirmBattle,
    basicAttack,
    useSkill,
    useBattleItem,
    endBattle,
    battleLogRef,
    addLog,
    isAutoBattle,
    toggleAutoBattle,
    skipBattle,
    damageNumbers,
    showDamageNumber,
    showBreakthroughEffect,
    triggerBreakthroughEffect,
  };
}
