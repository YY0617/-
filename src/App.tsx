/**
 * App — root component. Toggles between LaunchPage, CharacterCreation and GamePage.
 */
import React, { useState, useEffect } from 'react';
import { useGameStore, saveGame, loadSave, deleteSave, getHasSaves, getSaves } from './store/gameStore';
import LaunchPage from './components/pages/LaunchPage';
import CharacterCreation from './components/pages/CharacterCreation';
import GamePage from './components/pages/GamePage';
import { ToastContainer } from './components/common/UIComponents';
import { PrivacyConsent } from './components/common/PrivacyConsent';
import { TapTapStorage } from './utils/tapTapAdapter';

type AppState = 'launch' | 'characterCreation' | 'game';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('launch');
  const [hasSaves, setHasSaves] = useState<boolean[]>([false, false, false]);
  const [currentSaveSlot, setCurrentSaveSlot] = useState<number | null>(null);
  const [privacyAccepted, setPrivacyAccepted] = useState(() => {
    return TapTapStorage.getItem('privacy_consent') === 'true';
  });

  useEffect(() => {
    setHasSaves(getHasSaves());
  }, []);

  interface SaveSnapshot {
    playerName: string;
    background: import('./data/types').Background | null;
    physique: import('./data/types').Physique;
    lingen: import('./data/types').Lingen;
    master: import('./data/types').Master | null;
    force: import('./data/types').Force | null;
    stats: import('./data/types').PlayerStats;
    inventory: import('./data/types').InventoryItem[];
    gold: number;
    gameStarted: boolean;
    quests: import('./data/types').Quest[];
    unlockedAchievements: string[];
    claimedAchievements: string[];
    reputation: Record<string, number>;
    daoHeart: import('./data/types').DaoHeartState;
    karma: import('./data/types').KarmaState;
    totalKills: Record<string, number>;
    battleHistory: string[];
    unlockedTalents: string[];
    talentPoints: number;
    gameTime: number;
    activeWorldEvents: import('./data/types').WorldEvent[];
    pastWorldEvents: import('./data/types').WorldEvent[];
    npcs: import('./data/types').NPC[];
  }

  const getGameStateSnapshot = (): SaveSnapshot => {
    const state = useGameStore.getState();
    return {
      playerName: state.playerName,
      background: state.background,
      physique: state.physique,
      lingen: state.lingen,
      master: state.master,
      force: state.force,
      stats: state.stats,
      inventory: state.inventory,
      gold: state.gold,
      gameStarted: state.gameStarted,
      quests: state.quests,
      unlockedAchievements: state.unlockedAchievements,
      claimedAchievements: state.claimedAchievements,
      reputation: state.reputation,
      daoHeart: state.daoHeart,
      karma: state.karma,
      totalKills: state.totalKills,
      battleHistory: state.battleHistory,
      unlockedTalents: state.unlockedTalents,
      talentPoints: state.talentPoints,
      gameTime: state.gameTime,
      activeWorldEvents: state.activeWorldEvents,
      pastWorldEvents: state.pastWorldEvents,
      npcs: state.npcs,
    };
  };

  // Auto-save every 5 minutes when in game
  useEffect(() => {
    if (appState !== 'game' || !currentSaveSlot) return;

    const intervalId = setInterval(() => {
      const snapshot = getGameStateSnapshot();
      const summary = `${snapshot.playerName} - ${useGameStore.getState().getRealmName()}`;
      saveGame(currentSaveSlot, snapshot, summary);
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [appState, currentSaveSlot]);

  const handleNewGame = () => {
    setCurrentSaveSlot(null);
    setAppState('characterCreation');
  };

  const handleLoadGame = (slot: number) => {
    const savedState = loadSave(slot);
    if (savedState) {
      // 使用 loadGameState 来加载状态
      const store = useGameStore.getState();
      store.loadGameState(savedState as Partial<import('./store/slices/types').FullStore>);
      setCurrentSaveSlot(slot);
      
      // 如果游戏已经开始，直接进入游戏页面
      if (savedState.gameStarted) {
        setAppState('game');
      } else {
        setAppState('characterCreation');
      }
    }
  };

  const handleSaveToSlot = (slot: number) => {
    const snapshot = getGameStateSnapshot();
    const summary = `${snapshot.playerName} - ${useGameStore.getState().getRealmName()}`;
    if (saveGame(slot, snapshot, summary)) {
      setCurrentSaveSlot(slot);
      setHasSaves(getHasSaves());
      useGameStore.getState().showToast('保存成功！', 'success');
    } else {
      useGameStore.getState().showToast('保存失败！', 'error');
    }
  };

  const handleDeleteSave = (slot: number) => {
    if (deleteSave(slot)) {
      setHasSaves(getHasSaves());
      if (currentSaveSlot === slot) {
        setCurrentSaveSlot(null);
      }
    }
  };

  const goToGameFromCreation = () => {
    setAppState('game');
    // Auto-save to slot 1 if no slot selected yet
    if (!currentSaveSlot) {
      setTimeout(() => {
        handleSaveToSlot(1);
      }, 500);
    }
  };

  const returnToLaunch = () => {
    setAppState('launch');
    setHasSaves(getHasSaves());
  };

  return (
    <>
      <ToastContainer />
      {appState === 'launch' && (
        <LaunchPage
          onNewGame={handleNewGame}
          onLoadGame={handleLoadGame}
          hasSavedGames={hasSaves}
        />
      )}
      {appState === 'characterCreation' && (
        <CharacterCreation
          onComplete={goToGameFromCreation}
          onBack={returnToLaunch}
        />
      )}
      {appState === 'game' && (
        <GamePage
          onSave={handleSaveToSlot}
          onDeleteSave={handleDeleteSave}
          currentSaveSlot={currentSaveSlot}
          onReturnToLaunch={returnToLaunch}
          saves={getSaves()}
        />
      )}
      {!privacyAccepted && (
        <PrivacyConsent onAccept={() => setPrivacyAccepted(true)} />
      )}
    </>
  );
};

export default App;
