import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import { getRealmName } from '../../data/realmConfig';
import { STAT_NAMES } from '../../utils/gameUtils';
import { 
  MENTORS_BY_BACKGROUND, 
  LESSONS, 
  GUIDANCE_REQUESTS,
  type MasterDiscipleSystemState,
  type MasterDisciple,
  type Lesson
} from '../../data/masterDiscipleData';

const SPECIALTY_NAMES: Record<string, string> = {
  combat: '战斗',
  cultivation: '修炼',
  alchemy: '炼丹',
  formation: '阵法',
  insight: '悟道',
};

export const MasterDisciplePanel: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const game = useGameStore();
  const [activeTab, setActiveTab] = useState<'mentors' | 'lessons' | 'guidance'>('mentors');

  useEffect(() => {
    if (game.background) {
      const bgId = game.background.id;
      const available = MENTORS_BY_BACKGROUND[bgId] || MENTORS_BY_BACKGROUND['solo'];
      
      let initialMaster: MasterDisciple | null = null;
      
      if (bgId === 'master' && game.master) {
        initialMaster = {
          id: game.master.id,
          name: game.master.name,
          role: 'master',
          realm: 10,
          relationship: 50,
          knowledge: 90,
          specialty: ['战斗', '修炼'],
          lastInteraction: Date.now(),
          lessonsGiven: 0,
          lessonsReceived: 0,
          breakthroughsAssisted: 0,
          backgroundType: 'master'
        };
      }
      
      const currentMaster = game.masterDisciple?.master;
      const needUpdate = bgId === 'master' && game.master && (!currentMaster || currentMaster.id !== game.master.id);
      
      if (!game.masterDisciple || needUpdate) {
        const initial: MasterDiscipleSystemState = {
          master: initialMaster,
          disciples: [],
          availableMentors: bgId === 'master' ? [] : available,
          ongoingLessons: [],
          guidanceCooldowns: {},
          totalLessonsCompleted: 0,
          totalBreakthroughsAssisted: 0
        };
        game.setMasterDisciple(initial);
      }
    }
  }, [game.background, game.master]);

  const requestGuidance = (type: 'breakthrough' | 'skill' | 'cultivation' | 'problem') => {
    if (!game.masterDisciple || !game.masterDisciple.master) return;
    const request = GUIDANCE_REQUESTS.find(r => r.type === type);
    if (!request) return;
    const cdKey = request.type;
    if (game.masterDisciple.guidanceCooldowns[cdKey] && Date.now() < game.masterDisciple.guidanceCooldowns[cdKey]) {
      game.showToast('请求冷却中！', 'error');
      return;
    }
    const success = Math.random() < request.successChance;
    if (success) {
      if (type === 'breakthrough') {
        game.setStats({
          ...game.stats,
          breakthroughBonusRate: (game.stats.breakthroughBonusRate || 0) + 0.2
        });
        game.showToast('师父指导成功，突破成功率+20%！', 'success');
      } else if (type === 'cultivation') {
        game.gainCultivation(100);
        game.showToast('师父指点，修为大增！', 'success');
      } else {
        game.showToast('受教了！', 'success');
      }
      game.setMasterDisciple({
        ...game.masterDisciple,
        guidanceCooldowns: { ...game.masterDisciple.guidanceCooldowns, [cdKey]: Date.now() + request.cooldown },
        totalBreakthroughsAssisted: game.masterDisciple.totalBreakthroughsAssisted + 1
      });
    } else {
      game.showToast('师父今日无暇指导...', 'info');
    }
  };

  const startLesson = (lesson: Lesson) => {
    if (!game.masterDisciple || !game.masterDisciple.master) return;
    const master = game.masterDisciple.master;
    if (lesson.prerequisites?.realm && game.stats.realm < lesson.prerequisites.realm) {
      game.showToast('境界不足！', 'error');
      return;
    }
    if (lesson.prerequisites?.relationship && 
      (master.relationship < lesson.prerequisites.relationship)) {
      game.showToast('亲密度不足！', 'error');
      return;
    }
    let bonusMult = 1;
    if (lesson.backgroundBonus && game.background) {
      bonusMult = lesson.backgroundBonus[game.background.id] || 1;
    }
    if (lesson.rewards.cultivationBonus) {
      game.gainCultivation(100 * bonusMult);
    }
    if (lesson.rewards.stats?.attack) {
      game.setStats({ ...game.stats, attack: game.stats.attack + lesson.rewards.stats.attack });
    }
    if (lesson.rewards.relationship) {
      game.setMasterDisciple({
        ...game.masterDisciple,
        master: {
          ...master,
          relationship: Math.min(100, master.relationship + lesson.rewards.relationship)
        }
      });
    }
    game.recordLessonCompleted();
    game.showToast(`完成${lesson.name}！`, 'success');
  };

  const chooseMentor = (mentor: MasterDisciple) => {
    if (!game.masterDisciple) return;
    game.setMasterDisciple({
      ...game.masterDisciple,
      master: mentor,
      availableMentors: game.masterDisciple.availableMentors.filter(m => m.id !== mentor.id)
    });
    game.showToast(`成功拜入${mentor.name}门下！`, 'success');
  };

  const md = game.masterDisciple;
  if (!md) return null;

  const isMasterBackground = game.background?.id === 'master';
  
  const getPanelTitle = () => {
    if (isMasterBackground) return '师门';
    return md.master ? '师徒' : '拜师';
  };

  const tabs = isMasterBackground ? ['lessons', 'guidance'] as const : ['mentors', 'lessons', 'guidance'] as const;

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">{getPanelTitle()}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
      </div>
      
      <div className="flex gap-2 mb-4 border-b pb-2">
        {tabs.map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1 rounded text-sm ${activeTab === tab ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {{ mentors: '师徒', lessons: '授业', guidance: '请益' }[tab]}
          </button>
        ))}
      </div>

      {activeTab === 'mentors' && !isMasterBackground && (
        <div className="space-y-4">
          {md.master ? (
            <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-2xl">
                  👨‍🏫
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{md.master.name}</h3>
                  <p className="text-sm text-gray-600">境界: {getRealmName(md.master.realm, 0)}</p>
                  <p className="text-sm text-blue-600">亲密度: {md.master.relationship}/100</p>
                </div>
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <p className="font-bold">专长:</p>
                <ul className="pl-4 text-gray-600">
                  {md.master.specialty.map(s => <li key={s}>• {SPECIALTY_NAMES[s] || s}</li>)}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-bold mb-3">可拜师的师父</h3>
              <div className="space-y-3">
                {md.availableMentors.map(mentor => (
                  <div key={mentor.id} className="p-3 bg-white rounded border border-gray-200">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl">👨‍🏫</div>
                        <div>
                          <h4 className="font-bold">{mentor.name}</h4>
                          <p className="text-xs text-gray-500">境界: {getRealmName(mentor.realm, 0)}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => chooseMentor(mentor)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                      >
                        拜师
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'lessons' && (
        <div className="space-y-3">
          {md.master ? (
            LESSONS.map(lesson => {
              const master = md.master!;
              const canDo = 
                (!lesson.prerequisites?.realm || game.stats.realm >= lesson.prerequisites.realm) && 
                (!lesson.prerequisites?.relationship || 
                  (master.relationship >= lesson.prerequisites.relationship));
              return (
                <div key={lesson.id} className={`p-3 rounded border ${canDo ? 'bg-white border-gray-200' : 'bg-gray-100 border-gray-300 opacity-60'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{lesson.name}</h3>
                      <p className="text-sm text-gray-600">{lesson.description}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      lesson.difficulty <= 1 ? 'bg-green-100 text-green-700' : 
                      lesson.difficulty <= 2 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {lesson.difficulty}星
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    奖励: {lesson.rewards.cultivationBonus ? `修为+${Math.floor(100 * (lesson.backgroundBonus?.[game.background?.id || ''] || 1))}` : ''}
                    {lesson.rewards.relationship ? ` 亲密度+${lesson.rewards.relationship}` : ''}
                    {lesson.rewards.stats ? Object.entries(lesson.rewards.stats).map(([k,v]) => ` ${STAT_NAMES[k] || k}+${v}`).join('') : ''}
                  </div>
                  {lesson.prerequisites?.relationship && (
                    <p className="text-xs text-orange-600 mt-1">需要: 亲密度{lesson.prerequisites.relationship}</p>
                  )}
                  <button 
                    onClick={() => startLesson(lesson)}
                    disabled={!canDo}
                    className="mt-2 w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-sm rounded"
                  >
                    学习
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">请先拜师!</div>
          )}
        </div>
      )}

      {activeTab === 'guidance' && (
        <div className="space-y-3">
          {md.master ? (
            GUIDANCE_REQUESTS.map(request => {
              const cd = md.guidanceCooldowns[request.type];
              const onCooldown = cd && Date.now() < cd ? true : undefined;
              return (
                <div key={request.type} className="p-4 bg-white rounded-lg border border-gray-200">
                  <h3 className="font-bold mb-2">{request.type === 'breakthrough' ? '指点突破' : request.type === 'skill' ? '请教授业' : '修炼答疑'}</h3>
                  <p className="text-sm text-gray-600 mb-3">{request.description}</p>
                  <div className="text-sm text-gray-500 mb-3">成功率: {Math.floor(request.successChance * 100)}%</div>
                  <button 
                    onClick={() => requestGuidance(request.type)}
                    disabled={onCooldown}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded disabled:bg-gray-300"
                  >
                    {onCooldown ? '冷却中' : '请益'}
                  </button>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-gray-500">请先拜师!</div>
          )}
        </div>
      )}
    </div>
  );
};
