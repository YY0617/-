import React, { useState, useEffect } from 'react';
import { useGameStore } from '../../store/gameStore';
import { STAT_NAMES } from '../../utils/gameUtils';
import { PHYSIQUES, LINGEN, BACKGROUNDS, FORCES, MASTERS, DAO_FOUNDATIONS } from '../../data/characterData';

type CreationStep = 1 | 2 | 3 | 4 | 5 | 6;
type BackgroundType = 'sect' | 'master' | 'solo' | 'family';

interface CharacterCreationProps {
  onComplete: () => void;
  onBack: () => void;
}

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onComplete, onBack }) => {
  const game = useGameStore();
  const [nameInput, setNameInput] = useState('');
  const [step, setStep] = useState<CreationStep>(1);
  const [selectedPhysique, setSelectedPhysique] = useState<number | null>(null);
  const [selectedLingen, setSelectedLingen] = useState<number | null>(null);
  const [selectedBackground, setSelectedBackground] = useState<BackgroundType | null>(null);
  const [selectedForce, setSelectedForce] = useState<number | null>(null);
  const [selectedMaster, setSelectedMaster] = useState<number | null>(null);
  const [selectedDaoFoundation, setSelectedDaoFoundation] = useState<number | null>(null);
  
  const [isRolling, setIsRolling] = useState(false);
  const [physiqueResult, setPhysiqueResult] = useState<{ name: string; desc: string; color: string; rarity: number } | null>(null);
  const [lingenResult, setLingenResult] = useState<{ name: string; desc: string; color: string; rarity: number } | null>(null);
  const [daoFoundationResult, setDaoFoundationResult] = useState<{ name: string; desc: string; color: string; rarity: number } | null>(null);
  const [masterResult, setMasterResult] = useState<{ name: string; desc: string; color: string; rarity: number } | null>(null);
  const [showPhysiqueEffect, setShowPhysiqueEffect] = useState(false);
  const [showLingenEffect, setShowLingenEffect] = useState(false);
  const [showDaoFoundationEffect, setShowDaoFoundationEffect] = useState(false);
  const [showMasterEffect, setShowMasterEffect] = useState(false);
  const [masterRolled, setMasterRolled] = useState(false);
  const [rolledMaster, setRolledMaster] = useState<number | null>(null);

  // 四个宗门
  const fourForces = FORCES.slice(0, 4);
  
  // 属性名称映射为中文
  const statNames: Record<string, string> = {
    attack: '攻击',
    defense: '防御',
    hp: '气血',
    spiritualPower: '灵力',
    stamina: '体力',
    spiritualRoot: '灵根',
    intelligence: '悟性',
    agility: '敏捷',
    luck: '运气',
    gold: '灵石',
    hpMax: '最大气血',
    spiritualPowerMax: '最大灵力',
  };

  const rollPhysique = () => {
    if (isRolling) return;
    setIsRolling(true);
    setShowPhysiqueEffect(false);
    
    let iterations = 0;
    const maxIterations = 15;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * PHYSIQUES.length);
      setPhysiqueResult({
        name: PHYSIQUES[randomIndex].name,
        desc: PHYSIQUES[randomIndex].desc,
        color: PHYSIQUES[randomIndex].color,
        rarity: PHYSIQUES[randomIndex].rarity,
      });
      
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        const finalIndex = equalRandom(PHYSIQUES.length);
        const result = PHYSIQUES[finalIndex];
        setPhysiqueResult({
          name: result.name,
          desc: result.desc,
          color: result.color,
          rarity: result.rarity,
        });
        setSelectedPhysique(finalIndex);
        setIsRolling(false);
        setTimeout(() => setShowPhysiqueEffect(true), 100);
      }
    }, 80);
  };

  const rollLingen = () => {
    if (isRolling) return;
    setIsRolling(true);
    setShowLingenEffect(false);
    
    let iterations = 0;
    const maxIterations = 15;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * LINGEN.length);
      setLingenResult({
        name: LINGEN[randomIndex].name,
        desc: LINGEN[randomIndex].desc,
        color: LINGEN[randomIndex].color,
        rarity: LINGEN[randomIndex].rarity,
      });
      
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        const finalIndex = equalRandom(LINGEN.length);
        const result = LINGEN[finalIndex];
        setLingenResult({
          name: result.name,
          desc: result.desc,
          color: result.color,
          rarity: result.rarity,
        });
        setSelectedLingen(finalIndex);
        setIsRolling(false);
        setTimeout(() => setShowLingenEffect(true), 100);
      }
    }, 80);
  };

  const rollDaoFoundation = () => {
    if (isRolling) return;
    setIsRolling(true);
    setShowDaoFoundationEffect(false);
    
    const availableDaoFoundations = DAO_FOUNDATIONS.slice(0, 3); // 只在前三种中抽取
    
    let iterations = 0;
    const maxIterations = 12;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * availableDaoFoundations.length);
      setDaoFoundationResult({
        name: availableDaoFoundations[randomIndex].name,
        desc: availableDaoFoundations[randomIndex].desc,
        color: availableDaoFoundations[randomIndex].color,
        rarity: availableDaoFoundations[randomIndex].rarity,
      });
      
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        const finalIndex = equalRandom(availableDaoFoundations.length);
        const result = availableDaoFoundations[finalIndex];
        setDaoFoundationResult({
          name: result.name,
          desc: result.desc,
          color: result.color,
          rarity: result.rarity,
        });
        setSelectedDaoFoundation(finalIndex);
        setIsRolling(false);
        setTimeout(() => setShowDaoFoundationEffect(true), 100);
      }
    }, 100);
  };

  const rollMaster = () => {
    if (isRolling || masterRolled) return;
    setIsRolling(true);
    setShowMasterEffect(false);
    
    let iterations = 0;
    const maxIterations = 12;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * MASTERS.length);
      setMasterResult({
        name: MASTERS[randomIndex].name,
        desc: MASTERS[randomIndex].desc,
        color: 'text-gray-800',
        rarity: 50,
      });
      
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        const finalIndex = equalRandom(MASTERS.length);
        const result = MASTERS[finalIndex];
        setMasterResult({
          name: result.name,
          desc: result.desc,
          color: result.isBoss ? 'text-purple-700' : 'text-gray-700',
          rarity: result.isBoss ? 10 : 90,
        });
        setRolledMaster(finalIndex);
        setSelectedMaster(finalIndex);
        setMasterRolled(true);
        setIsRolling(false);
        setTimeout(() => setShowMasterEffect(true), 100);
      }
    }, 100);
  };

  // 等概率随机抽取
  const equalRandom = (length: number): number => {
    return Math.floor(Math.random() * length);
  };

  const handleComplete = () => {
    if (nameInput.trim()) {
      game.setPlayerName(nameInput.trim());
    }
    
    // 确定background
    const bgIndex = BACKGROUNDS.findIndex(b => 
      (selectedBackground === 'sect' && b.id === 'sect') ||
      (selectedBackground === 'master' && b.id === 'master') ||
      (selectedBackground === 'solo' && b.id === 'solo') ||
      (selectedBackground === 'family' && b.id === 'family')
    );
    if (bgIndex !== -1) {
      game.setBackground(BACKGROUNDS[bgIndex]);
    }
    
    // 确定force
    if (selectedForce !== null) {
      game.setForce(FORCES[selectedForce]);
    } else if (selectedBackground === 'family') {
      // 家族势力默认设置
      game.setForce(FORCES[3]);
    }
    
    // 确定master
    if (selectedMaster !== null) {
      game.setMaster(MASTERS[selectedMaster]);
    }
    
    // 确定道基
    if (selectedDaoFoundation !== null) {
      const daoFoundation = DAO_FOUNDATIONS.slice(0, 3)[selectedDaoFoundation];
      game.enhanceDaoFoundation(daoFoundation.quality as 'mortal' | 'spirit' | 'immortal' | 'celestial' | 'divine');
    }
    
    game.setPhysique(PHYSIQUES[selectedPhysique!]);
    game.setLingen(LINGEN[selectedLingen!]);
    game.setGameStarted(true);
    onComplete();
  };

  const isStep5Complete = () => {
    if (!selectedBackground) return false;
    if (selectedBackground === 'sect' && selectedForce === null) return false;
    if (selectedBackground === 'master' && !masterRolled) return false;
    return true;
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 pb-24">
      <div className="bg-white rounded-xl p-4 max-w-md w-full shadow-sm border border-gray-100">
        <h1 className="text-xl font-bold text-center text-black mb-4 py-2">成帝，等闲之事</h1>

        {step === 1 && (
          <div className="space-y-3">
            <h2 className="text-base font-bold text-black mb-3">第一步：输入道号</h2>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="请输入你的道号"
              className="w-full p-3 border border-gray-200 rounded-lg text-center text-base focus:outline-none focus:border-gray-400"
              maxLength={10}
            />
            <button
              onClick={() => nameInput.trim() && setStep(2)}
              disabled={!nameInput.trim()}
              className={`w-full mt-3 py-3 rounded-lg font-bold min-h-[44px] ${
                nameInput.trim() ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-500'
              }`}
            >
              确定
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <h2 className="text-base font-bold text-black mb-3">第二步：测试体质</h2>
            
            <div className={`p-4 rounded-xl border-2 mb-3 min-h-[100px] flex items-center justify-center ${
              selectedPhysique !== null 
                ? 'border-gray-200 bg-gray-50' 
                : 'border-dashed border-gray-300 bg-gray-50'
            }`}>
              {physiqueResult ? (
                <div className={`text-center ${showPhysiqueEffect ? 'animate-pulse' : ''}`}>
                  <div className={`text-xl font-bold ${physiqueResult.color} mb-1`} style={{ animation: showPhysiqueEffect ? 'glow 0.5s ease-in-out' : 'none' }}>
                    {physiqueResult.name}
                  </div>
                  <div className="text-sm text-gray-600">{physiqueResult.desc}</div>
                  {selectedPhysique !== null && (
                    <div className="text-xs text-gray-500 mt-2">
                      加成: {Object.entries(PHYSIQUES[selectedPhysique].effect).map(([k, v]) => `${statNames[k] || STAT_NAMES[k] || k}:+${v}`).join(', ')}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400">点击下方按钮测试体质</div>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={rollPhysique}
                disabled={isRolling}
                className={`w-full py-3 rounded-lg font-bold min-h-[44px] ${
                  isRolling ? 'bg-gray-300 text-gray-500' : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {isRolling ? '测试中...' : '随机测试体质'}
              </button>
              <button
                onClick={() => {
                  setSelectedPhysique(0);
                  setPhysiqueResult({
                    name: PHYSIQUES[0].name,
                    desc: PHYSIQUES[0].desc,
                    color: PHYSIQUES[0].color,
                    rarity: PHYSIQUES[0].rarity,
                  });
                }}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-bold min-h-[44px]"
              >
                选择凡体
              </button>
              <button onClick={() => setStep(1)} className="w-full py-3 bg-gray-100 text-gray-600 rounded-lg font-bold min-h-[44px]">
                返回上一步
              </button>
            </div>

            {selectedPhysique !== null && (
              <button 
                onClick={() => setStep(3)} 
                className="w-full mt-3 py-3 bg-green-600 text-white rounded-lg font-bold min-h-[44px]"
              >
                下一步
              </button>
            )}
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <h2 className="text-base font-bold text-black mb-3">第三步：测试灵根</h2>
            
            <div className={`p-4 rounded-xl border-2 mb-3 min-h-[100px] flex items-center justify-center ${
              selectedLingen !== null 
                ? 'border-gray-200 bg-gray-50' 
                : 'border-dashed border-gray-300 bg-gray-50'
            }`}>
              {lingenResult ? (
                <div className={`text-center ${showLingenEffect ? 'animate-pulse' : ''}`}>
                  <div className={`text-xl font-bold ${lingenResult.color} mb-1`} style={{ animation: showLingenEffect ? 'glow 0.5s ease-in-out' : 'none' }}>
                    {lingenResult.name}
                  </div>
                  <div className="text-sm text-gray-600">{lingenResult.desc}</div>
                  {selectedLingen !== null && (
                    <div className="text-xs text-blue-600 mt-2">
                      加成: 灵根:+{LINGEN[selectedLingen].effect.spiritualRoot}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400">点击下方按钮测试灵根</div>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={rollLingen}
                disabled={isRolling}
                className={`w-full py-3 rounded-lg font-bold min-h-[44px] ${
                  isRolling ? 'bg-gray-300 text-gray-500' : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {isRolling ? '测试中...' : '随机测试灵根'}
              </button>
              <button
                onClick={() => {
                  setSelectedLingen(2);
                  setLingenResult({
                    name: LINGEN[2].name,
                    desc: LINGEN[2].desc,
                    color: LINGEN[2].color,
                    rarity: LINGEN[2].rarity,
                  });
                }}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-bold min-h-[44px]"
              >
                选择中品灵根
              </button>
              <button onClick={() => setStep(2)} className="w-full py-3 bg-gray-100 text-gray-600 rounded-lg font-bold min-h-[44px]">
                返回上一步
              </button>
            </div>

            {selectedLingen !== null && (
              <button 
                onClick={() => setStep(4)} 
                className="w-full mt-3 py-3 bg-gray-800 text-white rounded-lg font-bold min-h-[44px]"
              >
                下一步
              </button>
            )}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-3">
            <h2 className="text-base font-bold text-black mb-3">第四步：测试道基</h2>
            
            <div className={`p-4 rounded-xl border-2 mb-3 min-h-[100px] flex items-center justify-center ${
              selectedDaoFoundation !== null 
                ? 'border-gray-200 bg-gray-50' 
                : 'border-dashed border-gray-300 bg-gray-50'
            }`}>
              {daoFoundationResult ? (
                <div className={`text-center ${showDaoFoundationEffect ? 'animate-pulse' : ''}`}>
                  <div className={`text-xl font-bold ${daoFoundationResult.color} mb-1`} style={{ animation: showDaoFoundationEffect ? 'glow 0.5s ease-in-out' : 'none' }}>
                    {daoFoundationResult.name}
                  </div>
                  <div className="text-sm text-gray-600">{daoFoundationResult.desc}</div>
                  {selectedDaoFoundation !== null && (
                    <div className="text-xs text-green-600 mt-2">
                      加成: 突破成功概率+{(DAO_FOUNDATIONS.slice(0,3)[selectedDaoFoundation].bonusRate * 100).toFixed(0)}%
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400">点击下方按钮测试道基</div>
              )}
            </div>

            <div className="space-y-2">
              <button
                onClick={rollDaoFoundation}
                disabled={isRolling}
                className={`w-full py-3 rounded-lg font-bold min-h-[44px] ${
                  isRolling ? 'bg-gray-300 text-gray-500' : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {isRolling ? '测试中...' : '随机测试道基'}
              </button>
              <button
                onClick={() => {
                  setSelectedDaoFoundation(0);
                  setDaoFoundationResult({
                    name: DAO_FOUNDATIONS[0].name,
                    desc: DAO_FOUNDATIONS[0].desc,
                    color: DAO_FOUNDATIONS[0].color,
                    rarity: DAO_FOUNDATIONS[0].rarity,
                  });
                }}
                className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-bold min-h-[44px]"
              >
                选择凡人道基
              </button>
              <button onClick={() => setStep(3)} className="w-full py-3 bg-gray-100 text-gray-600 rounded-lg font-bold min-h-[44px]">
                返回上一步
              </button>
            </div>

            {selectedDaoFoundation !== null && (
              <button 
                onClick={() => setStep(5)} 
                className="w-full mt-3 py-3 bg-gray-800 text-white rounded-lg font-bold min-h-[44px]"
              >
                下一步
              </button>
            )}
          </div>
        )}

        {step === 5 && (
          <div className="space-y-3">
            <h2 className="text-base font-bold text-black mb-3">第五步：选择出身</h2>
            
            {/* 四个出身选择 */}
            {!selectedBackground && (
              <div className="space-y-2 mb-3">
                <button
                  onClick={() => setSelectedBackground('sect')}
                  className="w-full p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 text-left min-h-[44px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏯</span>
                    <div>
                      <div className="font-bold text-black">拜入宗门</div>
                      <div className="text-sm text-gray-600">选择加入四大宗门之一</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => setSelectedBackground('master')}
                  className="w-full p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 text-left min-h-[44px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🧙</span>
                    <div>
                      <div className="font-bold text-black">拜人为师</div>
                      <div className="text-sm text-gray-600">随机拜师，可能遇到隐世大佬</div>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedBackground('solo');
                  }}
                  className="w-full p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 text-left min-h-[44px]"
                >
                  <div className="flex items-center gap-2">
                      <span className="text-2xl">🧘</span>
                      <div>
                        <div className="font-bold text-black">独自修炼</div>
                        <div className="text-sm text-gray-600">无拘无束，独自闯荡修炼界</div>
                      </div>
                    </div>
                </button>
                
                <button
                  onClick={() => {
                    setSelectedBackground('family');
                  }}
                  className="w-full p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 text-left min-h-[44px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🏠</span>
                    <div>
                      <div className="font-bold text-black">家族势力</div>
                      <div className="text-sm text-gray-600">背靠家族，资源充足</div>
                    </div>
                  </div>
                </button>
              </div>
            )}

            {/* 拜入宗门 - 选择四个宗门 */}
            {selectedBackground === 'sect' && selectedForce === null && (
              <div className="space-y-2 mb-3">
                <div className="text-sm font-bold text-black mb-2">选择宗门</div>
                <div className="grid grid-cols-2 gap-2">
                  {fourForces.map((force, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedForce(i)}
                      className="p-3 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 text-center min-h-[60px]"
                    >
                      <div className="font-bold text-black text-sm">{force.name}</div>
                      <div className="text-xs text-gray-600">{force.desc}</div>
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setSelectedBackground(null)} 
                  className="w-full py-2 bg-gray-100 text-gray-600 rounded-lg text-sm"
                >
                  返回重新选择
                </button>
              </div>
            )}

            {/* 拜入宗门 - 已选择 */}
            {selectedBackground === 'sect' && selectedForce !== null && (
              <div className="space-y-2 mb-3">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  <div className="text-2xl mb-2">🏯</div>
                  <div className="font-bold text-black">{FORCES[selectedForce].name}</div>
                  <div className="text-sm text-gray-600 mt-1">{FORCES[selectedForce].desc}</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setSelectedForce(null)} 
                    className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm"
                  >
                    重新选择
                  </button>
                  <button 
                    onClick={() => setSelectedBackground(null)} 
                    className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm"
                  >
                    更换出身
                  </button>
                </div>
              </div>
            )}

            {/* 拜人为师 - 随机拜师 */}
            {selectedBackground === 'master' && (
              <div className="space-y-2 mb-3">
                <div className={`p-4 rounded-xl border-2 mb-3 min-h-[100px] flex items-center justify-center ${
                  rolledMaster !== null 
                    ? 'border-gray-200 bg-gray-50' 
                    : 'border-dashed border-gray-300 bg-gray-50'
                }`}>
                  {masterResult ? (
                    <div className={`text-center ${showMasterEffect ? 'animate-pulse' : ''}`}>
                      <div className={`text-xl font-bold ${masterResult.color} mb-1`} style={{ animation: showMasterEffect ? 'glow 0.5s ease-in-out' : 'none' }}>
                        {masterResult.name}
                      </div>
                      <div className="text-sm text-gray-600">{masterResult.desc}</div>
                      {rolledMaster !== null && MASTERS[rolledMaster].isBoss && (
                        <div className="text-xs text-purple-600 mt-2 font-bold">
                          ✨ 遇到隐世大佬！
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-400">点击下方按钮随机拜师</div>
                  )}
                </div>
                {!masterRolled && (
                  <button
                    onClick={rollMaster}
                    disabled={isRolling}
                    className={`w-full py-3 rounded-lg font-bold min-h-[44px] ${
                      isRolling ? 'bg-gray-300 text-gray-500' : 'bg-gray-800 text-white hover:bg-gray-700'
                    }`}
                  >
                    {isRolling ? '拜师中...' : '随机拜师'}
                  </button>
                )}
                <div className="flex gap-2">
                  {masterRolled && (
                    <button 
                      onClick={() => {
                        setMasterRolled(false);
                        setRolledMaster(null);
                        setSelectedMaster(null);
                        setMasterResult(null);
                        setShowMasterEffect(false);
                      }} 
                      className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm"
                    >
                      重新拜师
                    </button>
                  )}
                  <button 
                    onClick={() => setSelectedBackground(null)} 
                    className="flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm"
                  >
                    更换出身
                  </button>
                </div>
              </div>
            )}

            {/* 独自修炼 - 确认 */}
            {selectedBackground === 'solo' && (
              <div className="space-y-2 mb-3">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  <div className="text-2xl mb-2">🧘</div>
                  <div className="font-bold text-black">独自修炼</div>
                  <div className="text-sm text-gray-600 mt-1">无拘无束，独自闯荡修炼界</div>
                </div>
                <button 
                  onClick={() => setSelectedBackground(null)} 
                  className="w-full py-2 bg-gray-100 text-gray-600 rounded-lg text-sm"
                >
                  返回重新选择
                </button>
              </div>
            )}

            {/* 家族势力 - 确认 */}
            {selectedBackground === 'family' && (
              <div className="space-y-2 mb-3">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-center">
                  <div className="text-2xl mb-2">🏠</div>
                  <div className="font-bold text-black">家族势力</div>
                  <div className="text-sm text-gray-600 mt-1">背靠家族，资源充足</div>
                </div>
                <button 
                  onClick={() => setSelectedBackground(null)} 
                  className="w-full py-2 bg-gray-100 text-gray-600 rounded-lg text-sm"
                >
                  返回重新选择
                </button>
              </div>
            )}

            <div className="flex gap-2">
              <button onClick={() => setStep(4)} className="flex-1 py-3 bg-gray-200 rounded-lg font-bold min-h-[44px]">
                上一步
              </button>
              {isStep5Complete() && (
                <button onClick={() => setStep(6)} className="flex-1 py-3 bg-gray-800 text-white rounded-lg font-bold min-h-[44px]">
                  下一步
                </button>
              )}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="space-y-3">
            <h2 className="text-base font-bold text-black mb-3">第六步：确认选择</h2>
            
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">道号</span>
                <span className="font-bold text-black">{nameInput}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">体质</span>
                <span className={`font-bold ${PHYSIQUES[selectedPhysique!].color}`}>
                  {PHYSIQUES[selectedPhysique!].name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">灵根</span>
                <span className={`font-bold ${LINGEN[selectedLingen!].color}`}>
                  {LINGEN[selectedLingen!].name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">道基</span>
                <span className={`font-bold ${
                  selectedDaoFoundation !== null ? 
                  DAO_FOUNDATIONS.slice(0,3)[selectedDaoFoundation].color : 
                  'text-gray-600'
                }`}>
                  {selectedDaoFoundation !== null ? 
                  DAO_FOUNDATIONS.slice(0,3)[selectedDaoFoundation].name : 
                  '未选择'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">出身</span>
                <span className="font-bold text-black">
                  {selectedBackground === 'sect' && '拜入宗门'}
                  {selectedBackground === 'master' && '拜人为师'}
                  {selectedBackground === 'solo' && '独自修炼'}
                  {selectedBackground === 'family' && '家族势力'}
                </span>
              </div>
              {selectedBackground === 'sect' && selectedForce !== null && (
                <div className="flex justify-between">
                  <span className="text-gray-600">宗门</span>
                  <span className="font-bold text-black">{FORCES[selectedForce].name}</span>
                </div>
              )}
              {selectedBackground === 'master' && selectedMaster !== null && (
                <div className="flex justify-between">
                  <span className="text-gray-600">师父</span>
                  <span className="font-bold text-black">{MASTERS[selectedMaster].name}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button onClick={() => setStep(5)} className="flex-1 py-3 bg-gray-200 rounded-lg font-bold min-h-[44px]">
                上一步
              </button>
              <button onClick={handleComplete} className="flex-1 py-3 bg-green-600 text-white rounded-lg font-bold min-h-[44px]">
                开始修炼
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterCreation;
