import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { WorldEvent } from '../../data/worldEvents';

interface WorldEventPanelProps {
  onClose: () => void;
}

const WorldEventPanel: React.FC<WorldEventPanelProps> = ({ onClose }) => {
  const { activeWorldEvents, pastWorldEvents, location } = useGameStore();
  const localEvents = activeWorldEvents.filter(e => e.location === location);
  const otherEvents = activeWorldEvents.filter(e => e.location !== location);

  const getEventTypeClass = (type: string) => {
    switch (type) {
      case 'competition': return 'border-black bg-gray-50';
      case 'disaster': return 'border-gray-600 bg-gray-100';
      case 'celebration': return 'border-gray-400 bg-gray-50';
      case 'mystery': return 'border-gray-500 bg-gray-50';
      case 'market': return 'border-gray-300 bg-gray-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'competition': return '竞技';
      case 'disaster': return '灾难';
      case 'celebration': return '庆典';
      case 'mystery': return '神秘';
      case 'market': return '市场';
      default: return '事件';
    }
  };

  return (
    <div className="p-3 bg-white rounded">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-base font-bold text-black py-2.5">修炼世界</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center">
          &times;
        </button>
      </div>

      {localEvents.length > 0 && (
        <div className="mb-2">
          <h3 className="text-base font-bold text-black mb-2">当前位置事件</h3>
          <div className="space-y-2">
            {localEvents.map(event => (
              <div key={event.id} 
                   className={`p-3 rounded border ${getEventTypeClass(event.type)}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-black border border-gray-300 px-2 py-1 rounded">
                    {getEventTypeLabel(event.type)}
                  </span>
                  <h4 className="font-bold text-black">{event.name}</h4>
                </div>
                <p className="text-sm text-gray-700 mb-2">{event.description}</p>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span>{event.location}</span>
                  {event.rewards && (
                    <span>
                      奖励: {event.rewards.gold ? `${event.rewards.gold}金币` : ''} 
                      {event.rewards.exp ? ` ${event.rewards.exp}修为` : ''}
                    </span>
                  )}
                  <span>{event.participants.length}人参与</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {otherEvents.length > 0 && (
        <div className="mb-2">
          <h3 className="text-base font-bold text-black mb-2">世界其他事件</h3>
          <div className="space-y-2">
            {otherEvents.map(event => (
              <div key={event.id} 
                   className={`p-3 rounded border ${getEventTypeClass(event.type)}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-black border border-gray-300 px-2 py-1 rounded">
                    {getEventTypeLabel(event.type)}
                  </span>
                  <h4 className="font-semibold text-black">{event.name}</h4>
                </div>
                <p className="text-xs text-gray-600">{event.location}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {pastWorldEvents.length > 0 && (
        <div>
          <h3 className="text-base font-bold text-black mb-2">历史事件</h3>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {pastWorldEvents.slice(-5).reverse().map(event => (
              <div key={event.id} className="p-2 bg-gray-50 rounded border border-gray-200 text-xs">
                <span className="font-medium text-black">{event.name}</span>
                <span className="text-gray-500 ml-2">@ {event.location}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeWorldEvents.length === 0 && pastWorldEvents.length === 0 && (
        <div className="text-center p-3 text-gray-500">
          世界一片平静，暂无大事发生...
        </div>
      )}
    </div>
  );
};

export default WorldEventPanel;
