// Data types and dataset-backed mock data for EDI dashboards

export interface Claim837 {
  id: string;
  patientName: string;
  provider: string;
  amount: number;
  status: 'accepted' | 'rejected' | 'pending';
  errors: number;
  date: string;
  segments: string[];
}

export interface Payment835 {
  id: string;
  claimRef: string;
  paidAmount: number;
  adjustments: number;
  status: 'paid' | 'denied' | 'partial';
  date: string;
}

export interface Member834 {
  id: string;
  name: string;
  plan: string;
  coverageStatus: 'active' | 'terminated' | 'pending';
  effectiveDate: string;
  terminationDate?: string;
}

export interface ValidationItem {
  type: 'error' | 'warning' | 'pass';
  code: string;
  message: string;
  line?: number;
  suggestion?: string;
}

export interface MockUploadFile {
  id: string;
  name: string;
  size: number;
  type: '837' | '835' | '834' | 'unknown';
  progress: number;
  status: 'uploading' | 'processing' | 'parsed' | 'error';
  isZip: boolean;
  children?: { name: string; type: '837' | '835' | '834' | 'unknown' }[];
  segments?: number;
  loops?: number;
  errorMsg?: string;
}

export const claims837: Claim837[] = [
  {
    id: 'CLM0001',
    patientName: 'Jane Smith',
    provider: 'Hospital XYZ',
    amount: 5000,
    status: 'accepted',
    errors: 0,
    date: '2026-03-21',
    segments: [
      'ISA*00*          *00*          *ZZ*SENDER03      *ZZ*RECEIVER03    *260321*1220*^*00501*000000303*0*T*:',
      'GS*HC*SENDER03*RECEIVER03*20260321*1220*303*X*005010X223A2',
      'ST*837*0003*005010X223A2',
      'BHT*0019*00*3003*20260321*1220*CH',
      'NM1*41*2*HOSPITAL XYZ*****46*123456789',
      'NM1*40*2*ACME PAYER*****46*987654321',
      'HL*1**20*1',
      'NM1*85*2*HOSPITAL XYZ*****XX*1112223333',
      'HL*2*1*22*0',
      'NM1*IL*1*SMITH*JANE****MI*200000002',
      'CLM*CLM0001*5000***11:B:1*Y*A*Y*Y',
      'DTP*434*D8*20260320',
      'HI*ABK:I10',
      'LX*1',
      'SV2*0300*HC:99223*5000*UN*1',
      'SE*16*0003',
      'GE*1*303',
      'IEA*1*000000303',
    ],
  },
  {
    id: 'CLM0002',
    patientName: 'Robert Lee',
    provider: 'Clinic ABC',
    amount: 300,
    status: 'pending',
    errors: 1,
    date: '2026-03-21',
    segments: [
      'ISA*00*          *00*          *ZZ*SENDER04      *ZZ*RECEIVER04    *260321*1230*^*00501*000000404*0*T*:',
      'GS*HC*SENDER04*RECEIVER04*20260321*1230*404*X*005010X222A1',
      'ST*837*0004*005010X222A1',
      'BHT*0019*00*4004*20260321*1230*CH',
      'NM1*41*2*CLINIC ABC*****46*555666777',
      'NM1*40*2*ACME PAYER*****46*888999000',
      'HL*1**20*1',
      'NM1*85*2*CLINIC ABC*****XX*4445556666',
      'HL*2*1*22*0',
      'NM1*IL*1*LEE*ROBERT****MI*300000003',
      'CLM*CLM0002*300***11:B:1*Y*A*Y*Y',
      'DTP*472*D8*20260320',
      'HI*ABK:J20',
      'LX*1',
      'SV1*HC:99213*300*UN*1***1',
      'SE*16*0004',
      'GE*1*404',
      'IEA*1*000000404',
    ],
  },
];

export const payments835: Payment835[] = [
  {
    id: 'PMT1001',
    claimRef: 'CLM0001',
    paidAmount: 4800,
    adjustments: 200,
    status: 'paid',
    date: '2026-03-21',
  },
  {
    id: 'PMT1002',
    claimRef: 'CLM0002',
    paidAmount: 250,
    adjustments: 50,
    status: 'partial',
    date: '2026-03-21',
  },
];

export const members834: Member834[] = [
  {
    id: '100000001',
    name: 'John Doe',
    plan: 'ACME INSURANCE',
    coverageStatus: 'active',
    effectiveDate: '2026-01-01',
  },
];

export const claimsTrendData: { month: string; claims: number; amount: number }[] = [
  { month: 'Jan', claims: 1, amount: 3000 },
  { month: 'Feb', claims: 1, amount: 4200 },
  { month: 'Mar', claims: 2, amount: 5300 },
];
export const claimsStatusSummary = { accepted: 1, rejected: 0, pending: 1 };

export const paymentBreakdownData: { month: string; paid: number; adjustments: number }[] = [
  { month: 'Jan', paid: 1500, adjustments: 120 },
  { month: 'Feb', paid: 2100, adjustments: 140 },
  { month: 'Mar', paid: 5050, adjustments: 250 },
];
export const paymentStatusSummary = { paid: 1, denied: 0, partial: 1 };

export const enrollmentTrendData: { month: string; active: number; terminated: number }[] = [
  { month: 'Jan', active: 1, terminated: 0 },
  { month: 'Feb', active: 1, terminated: 0 },
  { month: 'Mar', active: 1, terminated: 0 },
];
export const planDistributionData: { plan: string; count: number }[] = [
  { plan: 'ACME INSURANCE', count: 1 },
];

export const validationResults: ValidationItem[] = [
  {
    type: 'pass',
    code: 'ISA-OK',
    message: 'ISA/IEA envelope validated successfully.',
    line: 1,
  },
  {
    type: 'warning',
    code: 'DTP-472',
    message: 'Service date is present but patient signature indicator is missing.',
    line: 12,
    suggestion: 'Include CLM08 with patient signature indicator when applicable.',
  },
  {
    type: 'error',
    code: 'NM109',
    message: 'Subscriber ID length does not match expected format.',
    line: 10,
    suggestion: 'Verify member ID value in NM109 for Loop 2010BA.',
  },
  {
    type: 'pass',
    code: 'SE-OK',
    message: 'Transaction segment count matches SE control value.',
    line: 15,
  },
];

export const mockUploadFiles: MockUploadFile[] = [
  {
    id: 'dataset-zip',
    name: 'edi_dataset.zip',
    size: 1934,
    type: '837',
    progress: 100,
    status: 'parsed',
    isZip: true,
    children: [
      { name: '834_enrollment_001.edi', type: '834' },
      { name: '845_priceauth_001.edi', type: 'unknown' },
      { name: '837I_claims_001.edi', type: '837' },
      { name: '837P_claims_001.edi', type: '837' },
    ],
    segments: 57,
    loops: 9,
  },
];
