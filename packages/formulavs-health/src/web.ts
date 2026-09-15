import { WebPlugin } from '@capacitor/core';
import type { FormulaVSHealthPlugin, HealthStatus, StepsResult } from './index';

export class FormulaVSHealthWeb extends WebPlugin implements FormulaVSHealthPlugin {
  async getStatus(): Promise<HealthStatus> { return { status: 'unavailable', platform: 'web' }; }
  async requestPermissions(): Promise<HealthStatus> { return { status: 'unavailable', platform: 'web' }; }
  async openSettings(): Promise<{opened:boolean}> { return { opened: false }; }
  async getSteps(options: {date:string}): Promise<StepsResult> {
    return { status: 'unavailable', value: null, source: 'unsupported', date: options.date };
  }
}
