import React from 'react';
import ValidationPanel from '@/components/ValidationPanel';

const ValidatorPage: React.FC = () => (
  <div className="max-w-3xl mx-auto">
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-foreground">EDI Validator</h2>
      <p className="text-sm text-muted-foreground mt-1">Real-time validation with error highlighting and suggested fixes</p>
    </div>
    <ValidationPanel />
  </div>
);

export default ValidatorPage;
