import React from 'react';

const SettingsPage: React.FC = () => (
  <div className="max-w-2xl mx-auto animate-fade-in">
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-foreground">Settings</h2>
      <p className="text-sm text-muted-foreground mt-1">Manage your account and preferences</p>
    </div>
    <div className="bg-card rounded-xl border border-border divide-y divide-border">
      {[
        { label: 'Organization', value: 'Acme Health Systems' },
        { label: 'Default Parser', value: '837 Professional' },
        { label: 'Validation Level', value: 'Strict (HIPAA 5010)' },
        { label: 'API Key', value: '••••••••••••sk-3f8a' },
      ].map(item => (
        <div key={item.label} className="flex items-center justify-between px-5 py-4">
          <span className="text-sm text-foreground font-medium">{item.label}</span>
          <span className="text-sm text-muted-foreground">{item.value}</span>
        </div>
      ))}
    </div>
  </div>
);

export default SettingsPage;
