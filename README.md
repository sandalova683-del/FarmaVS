# FormulaVS 4.0.0

FormulaVS is a web-first wellness tracker. Version 4.0 adds the native health-data foundation for mobile builds.

## Health integration

- iOS: Apple HealthKit, read-only `stepCount`.
- Android: Health Connect, read-only aggregated `StepsRecord`.
- PWA/browser: manual steps remain available; native health APIs are reported as unavailable.
- FormulaVS never writes steps back to Apple Health or Health Connect.
- Health data stays local to the device in the current architecture.

## Architecture

`web UI -> FormulaVSHealth bridge -> iOS HealthKit / Android Health Connect`

The web layer does not contain platform-specific health logic.

## Install / build

Requires Node.js and the current Capacitor 8 toolchain. The official Capacitor docs describe adding iOS/Android with `@capacitor/ios` and `@capacitor/android`. See the project documentation at https://capacitorjs.com/docs.

```bash
npm install
npm run build:web
npm run sync
npx cap add ios
npx cap add android
```

Then copy/integrate the native plugin sources from `packages/formulavs-health` into the generated platform projects (see `packages/formulavs-health/README.md` and `native-integration.md`).

### iOS

Add the HealthKit capability to the app target and the `NSHealthShareUsageDescription` string. The app requests read-only access to step count.

### Android

Declare `android.permission.health.READ_STEPS` and the Health Connect package query. The implementation uses the stable Health Connect 1.1.0 client and aggregation to avoid double-counting overlapping sources.

## Web validation

```bash
npm run build:web
```

## Data model

Daily steps may contain:

```json
{
  "steps": 8426,
  "stepsSource": "healthkit",
  "stepsSyncedAt": "2026-09-15T16:42:00.000Z"
}
```

Manual values use `stepsSource: "manual"`.
