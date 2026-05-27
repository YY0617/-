import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { adManager, AdReward } from '../../utils/adManager';

interface AdScenePanelProps {
  onClose: () => void;
}

export interface AdScene {
  type: string;
  name: string;
  icon: string;
  description: string;
  benefit: string;
  action: string;
  reward: AdReward;
  placementId: string;
}

const AD_SCENES: AdScene[] = [
  {
    type: 'cultivation_double',
    name: '修炼加倍',
    icon: '倍',
    description: '下次修炼获得双倍修为',
    benefit: '修为×2',
    action: '开启加倍',
    reward: { type: 'cultivation', amount: 2, description: '双倍修为' },
    placementId: 'cultivation_double',
  },
  {
    type: 'stamina_full',
    name: '体力恢复',
    icon: '力',
    description: '立即恢复全部体力',
    benefit: '体力已满',
    action: '恢复体力',
    reward: { type: 'stamina', amount: 1, description: '满体力' },
    placementId: 'stamina_full',
  },
  {
    type: 'breakthrough_guardian',
    name: '天劫护法',
    icon: '护',
    description: '下次突破成功率+30%',
    benefit: '突破成功率+30%',
    action: '开启护法',
    reward: { type: 'breakthrough_bonus', amount: 30, description: '突破加成' },
    placementId: 'breakthrough_guardian',
  },
  {
    type: 'enlightenment_speedup',
    name: '顿悟加速',
    icon: '悟',
    description: '立即进入顿悟状态',
    benefit: '立即顿悟',
    action: '立即顿悟',
    reward: { type: 'enlightenment', amount: 1, description: '顿悟' },
    placementId: 'enlightenment_speedup',
  },
  {
    type: 'realm_explore_speedup',
    name: '秘境速通',
    icon: '秘',
    description: '跳过秘境冷却',
    benefit: '立即进入秘境',
    action: '立即探索',
    reward: { type: 'realm_cooldown', amount: 1, description: '秘境冷却清除' },
    placementId: 'realm_explore_speedup',
  },
  {
    type: 'gold_bonus',
    name: '灵石奖励',
    icon: '财',
    description: '获得额外灵石奖励',
    benefit: '1000灵石',
    action: '领取灵石',
    reward: { type: 'gold', amount: 1000, description: '灵石' },
    placementId: 'gold_bonus',
  },
  {
    type: 'tianji_consult',
    name: '天机咨询',
    icon: '机',
    description: '获得机缘，运气+5',
    benefit: '运气+5',
    action: '获取天机',
    reward: { type: 'luck', amount: 5, description: '运气提升' },
    placementId: 'tianji_consult',
  },
  {
    type: 'rest',
    name: '休息机会',
    icon: '休',
    description: '获得3次额外休息机会',
    benefit: '+3次休息',
    action: '领取休息机会',
    reward: { type: 'rest', amount: 3, description: '休息次数' },
    placementId: 'rest',
  },
];

interface AdSceneComponentProps {
  onClose?: () => void;
}

const AdSceneContent: React.FC<AdSceneComponentProps> = ({ onClose }) => {
  const game = useGameStore();
  const [loadingAd, setLoadingAd] = useState<string | null>(null);

  useEffect(() => {
    adManager.init();
  }, []);

  const handleWatchAd = async (scene: AdScene) => {
    if (!game.canWatchAd()) {
      game.showToast('广告冷却中，请稍后再试', 'error');
      return;
    }

    setLoadingAd(scene.type);
    
    try {
      const success = await adManager.showRewardedAd(scene.placementId, scene.reward);
      
      if (success) {
        game.watchAd(scene.type);
        applyReward(scene);
        game.showToast(`获得 ${scene.benefit}！`, 'success');
      } else {
        game.showToast('广告观看失败，请稍后再试', 'error');
      }
    } catch (error) {
      console.error('Ad watch error:', error);
      game.showToast('广告观看出错', 'error');
    } finally {
      setLoadingAd(null);
    }
  };

  const applyReward = (scene: AdScene) => {
    switch (scene.type) {
      case 'enlightenment_speedup':
        if (!game.enlightenment.active) {
          game.triggerEnlightenment();
        }
        break;
      case 'stamina_full':
        game.recoverStamina(game.stats.staminaMax);
        break;
      case 'gold_bonus':
        game.gainGold(1000);
        break;
      case 'cultivation_double':
        game.setAdReward('doubleCultivation', true);
        break;
      case 'breakthrough_guardian':
        game.setAdReward('breakthroughBonusActive', true);
        break;
      case 'tianji_consult':
        game.setStats({ luck: game.stats.luck + 5 });
        break;
      case 'rest':
        game.addRestBonusFromAd();
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-2">
      {AD_SCENES.map((scene) => (
        <div
          key={scene.type}
          className="p-3 bg-gray-50 rounded border border-gray-200"
        >
          <div className="flex items-center gap-2">
            <div className="text-base font-bold text-black w-8 h-8 flex items-center justify-center border border-gray-300 rounded">{scene.icon}</div>
            <div className="flex-1">
              <div className="font-bold text-black">{scene.name}</div>
              <div className="text-xs text-gray-600">{scene.description}</div>
              <div className="text-xs text-black mt-1">效果: {scene.benefit}</div>
            </div>
          </div>
          <button
            onClick={() => handleWatchAd(scene)}
            disabled={loadingAd === scene.type}
            className="w-full mt-2 py-2 bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white rounded text-sm font-bold min-h-[44px] flex items-center justify-center"
          >
            {loadingAd === scene.type ? (
              <>
                <span className="animate-spin mr-2">⚪</span>
                广告加载中...
              </>
            ) : (
              `观看广告 - ${scene.action}`
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export const TianjiPanel: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-bold text-black">天机阁</h2>
        {onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl min-h-[44px] min-w-[44px] flex items-center justify-center">&times;</button>
        )}
      </div>
      <p className="text-xs text-gray-500 mb-3">观看广告解锁额外收益</p>
      
      <div className="max-h-[60vh] overflow-y-auto">
        <AdSceneContent onClose={onClose} />
      </div>
    </div>
  );
};

export const AdScenePanel: React.FC<AdScenePanelProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
      <div className="bg-white rounded max-w-sm w-full shadow-2xl border border-gray-300">
        <div className="p-3 border-b border-gray-200">
          <h2 className="text-base font-bold text-center text-black">天机阁</h2>
          <p className="text-xs text-gray-500 text-center mt-1">观看广告解锁额外收益</p>
        </div>
        
        <div className="p-3 max-h-96 overflow-y-auto">
          <AdSceneContent />
        </div>
        
        <div className="p-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full py-2 bg-gray-200 hover:bg-gray-300 text-black rounded min-h-[44px]"
          >
            关闭
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdScenePanel;
