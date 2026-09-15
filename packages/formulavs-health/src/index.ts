import { registerPlugin } from '@capacitor/core';

export interface HealthStatus {
  status: 'unavailable' | 'not_connected' | 'permission_required' | 'connected';
  platform: 'ios' | 'android' | 'web';
  canOpenSettings?: boolean;
}

export interface StepsResult {
  status: string;
  value: number | null;
  source: 'healthkit' | 'health_connect' | 'manual' | 'unsupported';
  date: string;
  syncedAt?: string;
}

export interface FormulaVSHealthPlugin {
  getStatus(): Promise<HealthStatus>;
  requestPermissions(): Promise<HealthStatus>;
  openSettings(): Promise<{ opened: boolean }>;
  getSteps(options: { date: string }): Promise<StepsResult>;
}

export const FormulaVSHealth = registerPlugin<FormulaVSHealthPlugin>('FormulaVSHealth', {
  web: () => import('./web').then(m => new m.FormulaVSHealthWeb())
});
