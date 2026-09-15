import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const run = (args) => execFileSync('npx', ['cap', ...args], { cwd: root, stdio: 'inherit' });

function copy(src, dst) {
  mkdirSync(resolve(dst, '..'), { recursive: true });
  copyFileSync(src, dst);
}

function patchText(file, marker, insertion) {
  if (!existsSync(file)) return false;
  const text = readFileSync(file, 'utf8');
  if (text.includes(marker)) return false;
  const next = insertion(text);
  writeFileSync(file, next);
  return true;
}

if (!existsSync(join(root, 'node_modules'))) {
  console.log('Installing npm dependencies...');
  execFileSync('npm', ['install'], { cwd: root, stdio: 'inherit' });
}

if (!existsSync(join(root, 'ios'))) run(['add', 'ios']);
if (!existsSync(join(root, 'android'))) run(['add', 'android']);

// iOS plugin source.
copy(join(root, 'packages/formulavs-health/ios/Sources/FormulaVSHealth/FormulaVSHealthPlugin.swift'), join(root, 'ios/App/App/Plugins/FormulaVSHealthPlugin.swift'));
copy(join(root, 'native-templates/ios/HealthKit.entitlements'), join(root, 'ios/App/App/HealthKit.entitlements'));

// Android plugin source and templates.
copy(join(root, 'packages/formulavs-health/android/src/main/java/com/formulavs/health/FormulaVSHealthPlugin.kt'), join(root, 'android/app/src/main/java/com/formulavs/health/FormulaVSHealthPlugin.kt'));
copy(join(root, 'native-templates/android/AndroidManifest.healthconnect.xml'), join(root, 'android/app/src/main/AndroidManifest.healthconnect.xml'));

console.log('\nNative projects are generated. Next:');
console.log('  npx cap sync');
console.log('  npm run doctor');
console.log('Then open ios/App/App.xcworkspace in Xcode and android/ in Android Studio.');
console.log('For iOS, enable the HealthKit capability on the App target and verify Info.plist usage text.');
console.log('For Android, merge AndroidManifest.healthconnect.xml into the generated manifest and add Health Connect dependency.');
