import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { NPC, LOCATIONS, STATUS_LABELS } from '../../data/npcTemplates';
import { getRealmName } from '../../store/gameStore';

const NPCWorldPanel: React.FC<{ onSelectNPC?: (npc: NPC) => void }> = ({ onSelectNPC }) => {
  const { npcs, location, lastSimulatedTime } = useGameStore();
  const [activeTab, setActiveTab] = useState<'location' | 'list'>('location');
  const [selectedLocation, setSelectedLocation] = useState<string>(location);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const deltaTime = now - lastSimulatedTime;
      if (deltaTime > 10000) {
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [lastSimulatedTime]);

  const getStatusLabel = (status: NPC['status']) => {
    switch (status) {
      case 'cultivating': return '修炼';
      case 'exploring': return '探索';
      case 'fighting': return '战斗';
      case 'resting': return '休息';
      case 'socializing': return '社交';
      default: return '未知';
    }
  };

  const npcsByLocation = (loc: string) => npcs.filter(npc => npc.location === loc);

  return (
    <div className="p-3">
      <h2 className="text-base font-bold mb-2 text-black py-2.5">修炼世界</h2>
      
      <div className="flex space-x-2 mb-2">
        <button
          onClick={() => setActiveTab('location')}
          className={`px-3 py-2 rounded border min-h-[44px] ${activeTab === 'location' ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300'}`}
        >
          按位置
        </button>
        <button
          onClick={() => setActiveTab('list')}
          className={`px-3 py-2 rounded border min-h-[44px] ${activeTab === 'list' ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300'}`}
        >
          全部修士
        </button>
      </div>

      {activeTab === 'location' ? (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {LOCATIONS.map((loc) => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-3 py-2 rounded text-sm border ${
                  selectedLocation === loc ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 hover:bg-gray-50'
                }`}
              >
                {loc} ({npcsByLocation(loc).length})
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {npcsByLocation(selectedLocation).length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                这里没有修士...
              </div>
            ) : (
              npcsByLocation(selectedLocation).map((npc) => (
                <div
                  key={npc.id}
                  onClick={() => onSelectNPC?.(npc)}
                  className="p-3 bg-white rounded border border-gray-200 cursor-pointer hover:border-black transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-black">
                        {npc.gender === 'male' ? '男' : '女'} {npc.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {getRealmName(npc.currentRealm, npc.currentSubLevel)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {npc.appearance}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-black">
                        {getStatusLabel(npc.status)}
                      </div>
                      <div className="text-xs text-gray-500">
                        灵石: {npc.gold}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-gray-600">
                    {npc.personality}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {npcs.map((npc) => (
            <div
              key={npc.id}
              onClick={() => onSelectNPC?.(npc)}
              className="p-3 bg-white rounded border border-gray-200 cursor-pointer hover:border-black transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-black">
                    {npc.gender === 'male' ? '男' : '女'} {npc.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getRealmName(npc.currentRealm, npc.currentSubLevel)} · {npc.location}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-black">
                    {getStatusLabel(npc.status)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NPCWorldPanel;
