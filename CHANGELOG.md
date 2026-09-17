## 4.1.3 — Compact Coach and profile history UI

- Compact unified FormulaVS Coach block on Home.
- Home opens with populated content and safe render fallback.
- FormulaVS logo/brand returns to Home.
- Current body volumes and measurement history grouped into one collapsible section.
- Previous profile parameter changes are collapsed separately; current parameters remain visible.

# FormulaVS changelog

## 4.1.2 — Home grouping and measurement history

- Объединены «Настройка недели» и FormulaVS Coach в один верхний блок Главной в единой тёмной цветовой гамме.
- Текст «Дневник готов к обновлению» сделан компактнее.
- «Данные» в Настройках переименованы в «Резервная копия и перенос данных между устройствами».
- Исходные замеры регистрации теперь хранятся отдельно и не перезаписываются текущими замерами.
- Добавлена постоянная история замеров с датой, временем и значениями; существующие замеры мигрируются в историю автоматически.

## 4.1.0 — Weekly adaptive nutrition and training dynamics

- «План на сегодня» переименован в «План на неделю».
- Начало недели теперь настраивается на Главной и используется в расчётах Планов и Динамики.
- План КБЖУ рассчитывается по среднему положительному весу за предыдущие 7 дней; при отсутствии данных используется вес профиля.
- Недельная калорийность хранится в `nutritionWeekly` и фиксируется на неделю; Б/Ж/У пересчитываются от среднего недельного веса и недельной калорийности.
- Добавлены цели «Рекомпозиция» и «Набор мышечной массы». Для них белковый минимум — 2 г/кг; рекомпозиция использует калории поддержания, набор мышечной массы — профицит набора.
- В дневник добавлены тренировки «Растяжка» и «Пилатес», а также интенсивность 1.375 / 1.55 / 1.725 / 1.90.
- Коэффициент активности для нового недельного плана определяется по средним шагам, интенсивности, количеству и длительности тренировок за предыдущие 7 дней.
- Средняя калорийность предыдущих 7 дней учитывается в адаптации: если фактическая калорийность выше рекомендации и средний вес вырос, прошлый план сохраняется; иначе применяется адаптивный алгоритм.
- В Плане по шагам показывается среднее количество шагов за 7 дней.
- В «Динамике показателей» добавлены показатели интенсивности и коэффициента активности.
- FormulaVS Coach перенесён в верхнюю часть Главной.

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

## 4.0.0-mobile-source
- Added native project bootstrap for Capacitor 8.
- Added idempotent `npm run setup:native`.
- Added iOS HealthKit and Android Health Connect source templates.
- Added mobile build/publish guide.
- iOS status handling no longer infers read permission from HealthKit sharing status.
