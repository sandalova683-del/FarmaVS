import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.formulavs.app',
  appName: 'FormulaVS',
  webDir: '.',
  bundledWebRuntime: false,
  plugins: {
    FormulaVSHealth: {
      iosReadTypes: ['stepCount'],
      androidReadTypes: ['steps']
    }
  }
};

export default config;
