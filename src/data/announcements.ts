export interface Announcement {
  id: string;
  type: 'system' | 'world' | 'player' | 'achievement' | 'milestone';
  title: string;
  content: string;
  timestamp: number;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  icon: string;
}

export const createAnnouncement = (
  type: Announcement['type'],
  title: string,
  content: string,
  priority: Announcement['priority'] = 'medium'
): Announcement => {
  return {
    id: `ann_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    content,
    timestamp: Date.now(),
    isRead: false,
    priority,
    icon: getAnnouncementIcon(type),
  };
};

export const getAnnouncementIcon = (type: Announcement['type']): string => {
  switch (type) {
    case 'system': return '🔔';
    case 'world': return '🌍';
    case 'player': return '👤';
    case 'achievement': return '🏆';
    case 'milestone': return '⭐';
    default: return '📢';
  }
};

export const ANNOUNCEMENT_TEMPLATES = {
  world: [
    { title: '天降祥瑞', content: '天空中出现七彩祥云，修士们纷纷抬头观望...' },
    { title: '灵气潮汐', content: '天地灵气突然变得异常活跃，修炼效率提升！' },
    { title: '秘境开启', content: '某处秘境的大门缓缓打开，吸引了众多修士前往...' },
    { title: '灵兽异动', content: '深山中的灵兽群突然躁动不安...' },
    { title: '宗门盛典', content: '附近宗门正在举办庆典，欢迎各方修士参加...' },
  ],
  milestone: [
    { title: '十年磨一剑', content: '某位修士苦修十年，终于突破瓶颈...' },
    { title: '新星崛起', content: '一位年轻的修士展现了惊人的天赋...' },
    { title: '传奇诞生', content: '修炼界又诞生了一位传奇人物...' },
    { title: '宝物现世', content: '传说中的灵宝在某地现世，引发轰动...' },
    { title: '天劫降临', content: '有修士渡劫，引得天地变色...' },
  ],
};

export function generateRandomAnnouncement(type: 'world' | 'milestone'): Announcement {
  const templates = ANNOUNCEMENT_TEMPLATES[type];
  const template = templates[Math.floor(Math.random() * templates.length)];
  return createAnnouncement(type, template.title, template.content, type === 'world' ? 'medium' : 'high');
}

export function formatAnnouncementTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;
  return `${Math.floor(diff / 86400000)}天前`;
}
