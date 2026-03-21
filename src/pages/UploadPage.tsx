import React from 'react';
import UploadModule from '@/components/UploadModule';

const UploadPage: React.FC = () => (
  <div className="max-w-3xl mx-auto">
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-foreground">Upload EDI Files</h2>
      <p className="text-sm text-muted-foreground mt-1">Upload .edi files or ZIP batches for parsing and validation</p>
    </div>
    <UploadModule />
  </div>
);

export default UploadPage;
