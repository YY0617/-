import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { formatAnnouncementTime, Announcement } from '../../data/announcements';

interface AnnouncementPanelProps {
  onClose: () => void;
}

const AnnouncementPanel: React.FC<AnnouncementPanelProps> = ({ onClose }) => {
  const { announcements, markAnnouncementRead, clearAllAnnouncements } = useGameStore();
  const [filter, setFilter] = useState<'all' | 'unread' | 'system' | 'achievement'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredAnnouncements = announcements.filter(ann => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !ann.isRead;
    if (filter === 'system') return ann.type === 'system' || ann.type === 'world';
    if (filter === 'achievement') return ann.type === 'achievement' || ann.type === 'milestone';
    return true;
  });

  const unreadCount = announcements.filter(a => !a.isRead).length;

  const getPriorityBorder = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-black';
      case 'medium': return 'border-l-gray-400';
      default: return 'border-l-gray-300';
    }
  };

  const handleToggle = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      markAnnouncementRead(id);
    }
  };

  return (
    <div className="p-3 bg-white rounded max-h-[80vh] overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-black py-2.5">修炼界公告</h2>
          {unreadCount > 0 && (
            <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}条未读
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center">
          &times;
        </button>
      </div>

      <div className="flex gap-1.5 mb-2">
        {[
          { key: 'all', label: '全部' },
          { key: 'unread', label: '未读' },
          { key: 'system', label: '系统' },
          { key: 'achievement', label: '成就' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-3 py-1 rounded text-sm border min-h-[44px] ${
              filter === tab.key 
                ? 'bg-black text-white border-black' 
                : 'bg-white text-black border-gray-300 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            <p className="text-base mb-1 font-bold">📭</p>
            <p>暂无公告</p>
          </div>
        ) : (
          filteredAnnouncements.map(ann => {
            const isExpanded = expandedId === ann.id;
            const isContentLong = ann.content.length > 50;
            const displayContent = isContentLong && !isExpanded 
              ? ann.content.substring(0, 50) + '...' 
              : ann.content;
            
            return (
              <div
                key={ann.id}
                onClick={() => handleToggle(ann.id)}
                className={`p-3 rounded border-l-4 cursor-pointer transition-all hover:border-black ${getPriorityBorder(ann.priority)} bg-gray-50 border border-gray-200 ${
                  !ann.isRead ? 'border-r-black border-t-black border-b-black' : ''
                }`}
              >
                <div className="flex items-start gap-2">
                  <span className="text-base font-bold text-black">📢</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-bold ${!ann.isRead ? 'text-black' : 'text-gray-700'}`}>
                        {ann.title}
                      </h3>
                      <span className="text-xs text-gray-500">
                        {formatAnnouncementTime(ann.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{displayContent}</p>
                    {isContentLong && (
                      <span className="inline-block mt-1 text-xs text-blue-600">
                        {isExpanded ? '收起' : '点击展开'}
                      </span>
                    )}
                    {!ann.isRead && (
                      <span className="inline-block mt-1 text-xs bg-black text-white px-2 py-0.5 rounded">
                        未读
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {announcements.length > 0 && (
        <div className="mt-2 pt-2 border-t border-gray-200">
          <button
            onClick={clearAllAnnouncements}
            className="w-full py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition-colors min-h-[44px]"
          >
            清空所有
          </button>
        </div>
      )}
    </div>
  );
};

export default AnnouncementPanel;
