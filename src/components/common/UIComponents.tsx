import React from 'react';
import { useGameStore } from '../../store/gameStore';
import { PROPERTY_NAMES } from '../../constants/gameConstants';

interface AchievementToastProps {
  showAchievement?: { success: boolean; msg: string } | null;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ showAchievement }) => {
  if (!showAchievement) return null;

  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-pulse">
      <div className={`p-4 rounded-lg shadow-xl ${
        showAchievement.success 
          ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
          : 'bg-gradient-to-r from-red-400 to-red-600'
      } text-white`}>
        <div className="text-center font-bold text-lg">
          {showAchievement.success ? 'Achievement Unlocked!' : 'Operation Failed'}
        </div>
        <div className="text-center text-sm mt-1 opacity-90">
          {showAchievement.msg}
        </div>
      </div>
    </div>
  );
};

interface PlayerStatusProps {
  hpPercent: number;
  spiritualPowerPercent: number;
  staminaPercent: number;
  hp: number;
  hpMax: number;
  spiritualPower: number;
  spiritualPowerMax: number;
  stamina: number;
  staminaMax: number;
  gold: number;
  weatherIcon: string;
  weatherDesc: string;
  timeDesc: string;
  cultivationBonus: string;
  battleBonus: string;
  lingenName: string;
  realmName: string;
  playerName: string;
}

export const PlayerStatusBar: React.FC<PlayerStatusProps> = ({
  hpPercent,
  spiritualPowerPercent,
  staminaPercent,
  hp,
  hpMax,
  spiritualPower,
  spiritualPowerMax,
  stamina,
  staminaMax,
  gold,
  weatherIcon,
  timeDesc,
  cultivationBonus,
  battleBonus,
  lingenName,
  realmName,
  playerName,
}) => {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 p-3 z-10">
      <div className="flex justify-between items-center mb-2">
        <div className="text-lg font-bold text-gray-800">{playerName}</div>
        <div className="text-sm text-purple-600 font-bold">{realmName}</div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 text-sm">
        <StatusBar
          label="HP"
          current={hp}
          max={hpMax}
          percent={hpPercent}
          color="red"
          icon="❤️"
        />
        <StatusBar
          label="SP"
          current={spiritualPower}
          max={spiritualPowerMax}
          percent={spiritualPowerPercent}
          color="blue"
          icon="💙"
        />
        <StatusBar
          label="Stamina"
          current={stamina}
          max={staminaMax}
          percent={staminaPercent}
          color="green"
          icon="💚"
        />
      </div>
      
      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <div className="text-orange-600 font-bold">💰 {gold}</div>
        <div>{weatherIcon} {timeDesc}</div>
      </div>
      
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <div>Spiritual Root: {lingenName}</div>
        <div>Cultivation {cultivationBonus} | Battle {battleBonus}</div>
      </div>
    </div>
  );
};

interface StatusBarProps {
  label: string;
  current: number;
  max: number;
  percent: number;
  color: 'red' | 'blue' | 'green';
  icon: string;
}

const StatusBar: React.FC<StatusBarProps> = ({ label, current, max, percent, color, icon }) => {
  const colorClasses = {
    red: 'bg-red-50 border-red-200 text-red-600',
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
  };
  
  const barClasses = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
  };

  return (
    <div className={`border p-2 rounded ${colorClasses[color]}`}>
      <div className="flex items-center gap-1">
        <span className="text-xs">{icon}</span>
        <span className="text-xs font-medium">{label}</span>
      </div>
      <div className="w-full bg-gray-200 h-2 mt-1 rounded overflow-hidden">
        <div 
          className={`h-full rounded transition-all duration-300 ${barClasses[color]}`}
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
      <div className="text-xs text-center mt-1 opacity-75">
        {current}/{max}
      </div>
    </div>
  );
};

interface ResultToastProps {
  result: { success: boolean; msg: string } | null;
  onClose: () => void;
}

export const ResultToast: React.FC<ResultToastProps> = ({ result, onClose }) => {
  React.useEffect(() => {
    if (result) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [result, onClose]);

  if (!result) return null;

  return (
    <div className={`p-3 mb-3 rounded-lg ${
      result.success 
        ? 'bg-green-100 border-2 border-green-500' 
        : 'bg-red-100 border-2 border-red-500'
    }`}>
      <div className={`text-center font-bold ${
        result.success ? 'text-green-800' : 'text-red-800'
      }`}>
        {result.success ? 'Success' : 'Failed'}
      </div>
      <div className="text-center text-gray-700 text-sm mt-1">
        {result.msg}
      </div>
    </div>
  );
};

export const Modal: React.FC<{
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  maxWidth?: string;
}> = ({ title, children, onClose, maxWidth = 'max-w-sm' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-lg p-6 w-full ${maxWidth} mx-4 shadow-xl`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const ConfirmDialog: React.FC<{
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmColor?: string;
}> = ({ 
  title, 
  message, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel', 
  onConfirm, 
  onCancel,
  confirmColor = 'bg-blue-500 hover:bg-blue-600'
}) => {
  return (
    <Modal title={title} onClose={onCancel}>
      <div className="text-center mb-4">
        <p className="text-gray-600">{message}</p>
      </div>
      <div className="flex gap-3">
        <button 
          onClick={onCancel}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded font-bold"
        >
          {cancelText}
        </button>
        <button 
          onClick={onConfirm}
          className={`flex-1 ${confirmColor} text-white py-2 rounded font-bold`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export const ProgressBar: React.FC<{
  current: number;
  max: number;
  label?: string;
  color?: 'red' | 'blue' | 'green' | 'purple' | 'orange';
  showText?: boolean;
}> = ({ current, max, label, color = 'blue', showText = true }) => {
  const colors = {
    red: 'bg-red-500',
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
  };

  const percent = max > 0 ? Math.min(100, (current / max) * 100) : 0;

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-xs text-gray-600 mb-1">
          <span>{label}</span>
          {showText && <span>{current}/{max}</span>}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-300 ${colors[color]}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export const EmptyState: React.FC<{
  icon: string;
  title: string;
  message: string;
}> = ({ icon, title, message }) => {
  return (
    <div className="text-center py-8">
      <div className="text-4xl mb-2">{icon}</div>
      <div className="text-lg font-bold text-gray-700 mb-1">{title}</div>
      <div className="text-sm text-gray-500">{message}</div>
    </div>
  );
};

export const Badge: React.FC<{
  text: string;
  color?: 'red' | 'blue' | 'green' | 'purple' | 'yellow' | 'gray';
}> = ({ text, color = 'gray' }) => {
  const colors = {
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    purple: 'bg-purple-100 text-purple-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    gray: 'bg-gray-100 text-gray-700',
  };

  return (
    <span className={`px-2 py-1 rounded text-xs font-bold ${colors[color]}`}>
      {text}
    </span>
  );
};

export const ToastContainer: React.FC = () => {
  const toasts = useGameStore((s) => s.toasts);
  const showToast = useGameStore((s) => s.showToast);

  React.useEffect(() => {
    if (toasts.length === 0) return;
    const timer = setTimeout(() => {
      useGameStore.setState({ toasts: toasts.slice(1) });
    }, 2000);
    return () => clearTimeout(timer);
  }, [toasts]);

  if (toasts.length === 0) return null;

  const toastColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
  };

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-[80vw]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${toastColors[toast.type]} text-white px-4 py-3 rounded-lg shadow-xl animate-slide-in text-sm font-medium`}
        >
          {toast.msg}
        </div>
      ))}
    </div>
  );
};