# FormulaVS changelog

## 4.0.0 — Health integration foundation

- FormulaVS stays web-first/PWA-compatible.
- Added Capacitor 8 project configuration.
- Added a platform-neutral `FormulaVSHealth` bridge.
- Added iOS HealthKit implementation for read-only daily step count.
- Added Android Health Connect implementation for read-only aggregated daily step count.
- Added step import action to the Trackers screen.
- Imported health steps are stored with their source and sync timestamp.
- Manual step entry remains available.
- Added native integration source under `packages/formulavs-health`.
- Updated service worker cache to 4.0.0.
- Preserved the light-only UI.
- Main-screen weight now falls back to the registration weight only when there are no daily measurements at all.
