# Android native implementation

Uses the stable `androidx.health.connect:connect-client:1.1.0` API and reads `StepsRecord` through `AggregateRequest` to avoid double-counting overlapping sources.

The app only requests `READ_STEPS`; it never writes steps to Health Connect.
