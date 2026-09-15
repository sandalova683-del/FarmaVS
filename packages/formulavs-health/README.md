# @formulavs/health

Native FormulaVS bridge for daily step counts.

- iOS: HealthKit `stepCount` (read only)
- Android: Health Connect `StepsRecord` (read only, aggregated)
- Web/PWA: gracefully reports `unavailable`

The app intentionally does not write step data back to Apple Health or Health Connect.
