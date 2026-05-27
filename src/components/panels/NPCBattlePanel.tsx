import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { NPC } from '../../data/npcTemplates';
import { getRealmName } from '../../data/realmConfig';

interface NPCBattlePanelProps {
  npc: NPC;
  onComplete: (won: boolean) => void;
  onClose: () => void;
}

const NPCBattlePanel: React.FC<NPCBattlePanelProps> = ({ npc, onComplete, onClose }) => {
  const game = useGameStore();
  
  const [playerHp, setPlayerHp] = useState(game.stats.hp || 100);
  const [npcHp, setNpcHp] = useState(100 + npc.currentRealm * 50);
  const [logs, setLogs] = useState<string[]>([]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [battleEnded, setBattleEnded] = useState(false);

  const npcMaxHp = 100 + npc.currentRealm * 50;
  const playerMaxHp = game.stats.hpMax || 100;

  const addLog = (text: string) => {
    setLogs(prev => [...prev, text]);
  };

  const playerAttack = () => {
    if (!isPlayerTurn || battleEnded) return;
    
    const damage = Math.floor(game.stats.attack * (0.8 + Math.random() * 0.4));
    const newNpcHp = Math.max(0, npcHp - damage);
    setNpcHp(newNpcHp);
    addLog(`你对${npc.name}造成了${damage}点伤害！`);
    
    if (newNpcHp <= 0) {
      setBattleEnded(true);
      addLog(`你战胜了${npc.name}！`);
      setTimeout(() => onComplete(true), 1000);
    } else {
      setIsPlayerTurn(false);
      setTimeout(npcTurn, 1000);
    }
  };

  const npcTurn = () => {
    const damage = Math.floor(10 + npc.currentRealm * 5 + Math.random() * 10);
    const newPlayerHp = Math.max(0, playerHp - damage);
    setPlayerHp(newPlayerHp);
    addLog(`${npc.name}对你造成了${damage}点伤害！`);
    
    if (newPlayerHp <= 0) {
      setBattleEnded(true);
      addLog(`你被${npc.name}击败了...`);
      setTimeout(() => onComplete(false), 1000);
    } else {
      setIsPlayerTurn(true);
    }
  };

  const useSkill = () => {
    if (!isPlayerTurn || battleEnded) return;
    if (game.stats.spiritualPower < 10) {
      addLog('灵力不足！');
      return;
    }
    
    const damage = Math.floor(game.stats.attack * 1.5 * (0.9 + Math.random() * 0.2));
    const newNpcHp = Math.max(0, npcHp - damage);
    setNpcHp(newNpcHp);
    game.useSpiritualPower(10);
    addLog(`你使用技能对${npc.name}造成了${damage}点伤害！`);
    
    if (newNpcHp <= 0) {
      setBattleEnded(true);
      addLog(`你战胜了${npc.name}！`);
      setTimeout(() => onComplete(true), 1000);
    } else {
      setIsPlayerTurn(false);
      setTimeout(npcTurn, 1000);
    }
  };

  const tryToFlee = () => {
    if (!isPlayerTurn || battleEnded) return;
    if (Math.random() < 0.5) {
      addLog('逃跑成功！');
      setTimeout(() => onComplete(false), 500);
    } else {
      addLog('逃跑失败！');
      setIsPlayerTurn(false);
      setTimeout(npcTurn, 1000);
    }
  };

  return (
    <div className="p-3 bg-gray-100 rounded">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-bold text-black py-2.5">与 {npc.name} 战斗</h2>
        <button onClick={onClose} className="text-gray-500 min-h-[44px] min-w-[44px] flex items-center justify-center">✕</button>
      </div>

      <div className="grid grid-cols-2 gap-1.5 mb-2">
        <div className="bg-white p-3 rounded border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-2">你</h3>
          <div className="text-sm text-gray-600 mb-2">
            {getRealmName(game.stats.realm, game.stats.subLevel)}
          </div>
          <div className="w-full bg-gray-200 rounded h-4 mb-1">
            <div 
              className="bg-green-500 h-4 rounded transition-all"
              style={{ width: `${(playerHp / playerMaxHp) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-600">HP: {playerHp}/{playerMaxHp}</div>
        </div>

        <div className="bg-white p-3 rounded border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-2">{npc.name}</h3>
          <div className="text-sm text-gray-600 mb-2">
            {getRealmName(npc.currentRealm, npc.currentSubLevel)}
          </div>
          <div className="w-full bg-gray-200 rounded h-4 mb-1">
            <div 
              className="bg-red-500 h-4 rounded transition-all"
              style={{ width: `${(npcHp / npcMaxHp) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-600">HP: {npcHp}/{npcMaxHp}</div>
        </div>
      </div>

      <div className="bg-white p-3 rounded border border-gray-200 mb-2 h-40 overflow-y-auto">
        {logs.map((log, i) => (
          <p key={i} className="text-sm text-gray-700">{log}</p>
        ))}
      </div>

      {!battleEnded && (
        <div className="grid grid-cols-3 gap-1.5">
          <button 
            onClick={playerAttack} 
            disabled={!isPlayerTurn}
            className={`p-3 rounded min-h-[44px] ${
              isPlayerTurn ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-gray-300 text-gray-500'
            }`}
          >
            攻击
          </button>
          <button 
            onClick={useSkill} 
            disabled={!isPlayerTurn}
            className={`p-3 rounded min-h-[44px] ${
              isPlayerTurn ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-gray-300 text-gray-500'
            }`}
          >
            技能
          </button>
          <button 
            onClick={tryToFlee} 
            disabled={!isPlayerTurn}
            className={`p-3 rounded min-h-[44px] ${
              isPlayerTurn ? 'bg-gray-500 text-white hover:bg-gray-600' : 'bg-gray-300 text-gray-500'
            }`}
          >
            逃跑
          </button>
        </div>
      )}
    </div>
  );
};

export default NPCBattlePanel;