import React, { useState } from 'react';
import { TapTapStorage } from '../../utils/tapTapAdapter';

interface PrivacyConsentProps {
  onAccept: () => void;
}

export const PrivacyConsent: React.FC<PrivacyConsentProps> = ({ onAccept }) => {
  const [showPolicy, setShowPolicy] = useState(false);
  const [checked, setChecked] = useState(false);
  const [isInternalView, setIsInternalView] = useState(false);

  const handleAccept = () => {
    if (!checked) return;
    TapTapStorage.setItem('privacy_consent', 'true');
    TapTapStorage.setItem('privacy_consent_time', String(Date.now()));
    onAccept();
  };

  const handleReject = () => {
    setIsInternalView(true);
    setChecked(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div className="bg-white rounded-lg p-6 mx-4 max-w-sm w-full shadow-2xl">
        <h2 className="text-lg font-bold text-center mb-4">隐私政策与用户协议</h2>
        
        <div className="text-sm text-gray-600 mb-4 leading-relaxed">
          <p className="mb-3">
            欢迎使用 <strong>「成帝，等闲之事」</strong>！在使用本游戏前，请您仔细阅读并同意以下条款：
          </p>
          
          {showPolicy ? (
            <div className="border rounded p-3 mb-3 max-h-48 overflow-y-auto bg-gray-50 text-xs">
              <h3 className="font-bold mb-2">隐私政策摘要</h3>
              <p className="mb-2">1. 我们收集您的TapTap账号基础信息（头像、昵称）用于游戏内展示。</p>
              <p className="mb-2">2. 您的游戏进度数据存储在本地设备上，您可以随时管理和删除。</p>
              <p className="mb-2">3. 我们不会将您的个人信息出售或转让给任何第三方。</p>
              <p className="mb-2">4. 您可以通过游戏内设置或TapTap平台管理您的个人信息。</p>
              
              <h3 className="font-bold mb-2 mt-3">用户协议摘要</h3>
              <p className="mb-2">1. 使用本游戏即表示您同意本协议的全部条款。</p>
              <p className="mb-2">2. 请勿使用外挂、脚本等作弊工具。</p>
              <p className="mb-2">3. 请勿对其他玩家进行骚扰或人身攻击。</p>
              
              <p className="mt-2 text-gray-400">
                完整政策请参阅游戏内"设置" → "隐私政策"和"用户协议"。
              </p>
            </div>
          ) : null}
          
          <button 
            onClick={() => setShowPolicy(!showPolicy)}
            className="text-blue-600 underline text-sm mb-3 inline-block"
          >
            {showPolicy ? '收起详情' : '查看隐私政策与用户协议详情'}
          </button>
        </div>

        <div className="flex items-start gap-2 mb-4">
          <input 
            type="checkbox" 
            id="privacy-check" 
            checked={checked} 
            onChange={(e) => setChecked(e.target.checked)}
            className="mt-1 w-4 h-4"
          />
          <label htmlFor="privacy-check" className="text-sm text-gray-700">
            我已阅读并同意 <span className="text-blue-600">《隐私政策》</span>和<span className="text-blue-600">《用户服务协议》</span>
            {isInternalView && <span className="block text-red-500 mt-1">（仅内部测试使用，不涉及真实用户数据）</span>}
          </label>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={handleReject}
            className="flex-1 py-2 px-4 rounded-lg border border-gray-300 text-gray-600 text-sm"
          >
            内部测试
          </button>
          <button 
            onClick={handleAccept}
            disabled={!checked}
            className="flex-1 py-2 px-4 rounded-lg bg-blue-600 text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            同意并继续
          </button>
        </div>
      </div>
    </div>
  );
};