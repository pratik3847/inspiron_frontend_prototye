import React, { useState, useCallback } from 'react';
import Claims837Dashboard from '@/components/dashboard/Claims837Dashboard';
import Remittance835Dashboard from '@/components/dashboard/Remittance835Dashboard';
import Enrollment834Dashboard from '@/components/dashboard/Enrollment834Dashboard';

type TabType = '837' | '835' | '834';

const tabs: { key: TabType; label: string }[] = [
  { key: '837', label: '837 Claims' },
  { key: '835', label: '835 Remittance' },
  { key: '834', label: '834 Enrollment' },
];

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('837');
  const [renderKey, setRenderKey] = useState(0);

  const switchTab = useCallback((tab: TabType) => {
    setActiveTab(tab);
    setRenderKey(k => k + 1); // Force re-mount = full state reset
  }, []);

  return (
    <div className="space-y-6">
      {/* Segmented control */}
      <div className="inline-flex items-center bg-card rounded-xl border border-border p-1 shadow-sm shadow-black/10">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => switchTab(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all active:scale-[0.97] ${
              activeTab === tab.key
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard content — key forces full remount = state isolation */}
      <div key={renderKey}>
        {activeTab === '837' && <Claims837Dashboard />}
        {activeTab === '835' && <Remittance835Dashboard />}
        {activeTab === '834' && <Enrollment834Dashboard />}
      </div>
    </div>
  );
};

export default Dashboard;
