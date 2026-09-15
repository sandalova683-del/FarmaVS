# FormulaVS 4.0 — полноценный мобильный исходный проект

FormulaVS 4.0 сохраняет существующий web/PWA-интерфейс и добавляет нативный слой через Capacitor 8. Это позволяет выпускать одну кодовую базу как Web/PWA, iOS и Android. Capacitor официально поддерживает добавление iOS/Android к существующему web-приложению и расширение через собственные плагины. 

## Что уже есть в проекте

- готовый интерфейс FormulaVS 4.0;
- светлая тема;
- корректное отображение последнего фактического веса;
- дневник, аналитика, прогресс и экспорт/импорт данных;
- кнопка синхронизации шагов;
- JS-мост `js/health-service.js`;
- iOS HealthKit plugin для чтения `stepCount`;
- Android Health Connect plugin для чтения `StepsRecord`;
- только чтение шагов — FormulaVS не записывает шаги в HealthKit/Health Connect;
- ручной ввод шагов остаётся резервным вариантом;
- нативные шаблоны разрешений и конфигурации;
- idempotent-скрипт `npm run setup:native`, который создаёт нативные проекты Capacitor и раскладывает FormulaVS Health plugin по ним.

Apple HealthKit требует отдельного разрешения на чтение данных и HealthKit capability/usage description в iOS-проекте.

Android Health Connect требует `READ_STEPS`; для суммарного числа шагов Google рекомендует `aggregate()` для `StepsRecord`, чтобы не задваивать данные из разных источников.

## Важное ограничение

В этом архиве находятся **исходники и автоматизация сборки**, но не подписанные `.ipa` и `.aab`. Подпись приложения выполняется на компьютере разработчика:

- iOS — нужен macOS + Xcode + Apple Developer account;
- Android — Android Studio/SDK + Google Play Console для публикации.

Секреты, сертификаты и пароли в архив не включаются.

## Шаг 1. Установить инструменты

### Для Android

1. Установить Node.js LTS.
2. Установить Android Studio.
3. В Android Studio установить Android SDK и platform tools.
4. Подключить Android-телефон с включённой отладкой USB или использовать эмулятор с поддержкой Health Connect.

### Для iPhone

1. Нужен Mac.
2. Установить Xcode.
3. Войти в Xcode под Apple ID.
4. Для публикации нужен Apple Developer Program.
5. Тестировать HealthKit лучше на физическом iPhone.

## Шаг 2. Подготовить проект

В терминале открыть папку FormulaVS:

```bash
npm install
npm run setup:native
npx cap sync
npm run verify
```

`setup:native` создаёт `ios/` и `android/`, если их ещё нет, и копирует нативный FormulaVS Health plugin.

## Шаг 3. iOS

После `npm run setup:native`:

1. Открыть `ios/App/App.xcworkspace` в Xcode.
2. Выбрать target `App`.
3. В **Signing & Capabilities** добавить **HealthKit**.
4. Убедиться, что target использует `HealthKit.entitlements`.
5. Добавить в Info.plist:
   - `NSHealthShareUsageDescription`
   - `NSHealthUpdateUsageDescription`
6. Зарегистрировать `FormulaVSHealthPlugin` в Capacitor bridge согласно сгенерированной структурой проекта.
7. Выбрать реальный iPhone.
8. Запустить приложение.
9. В FormulaVS открыть трекер шагов и нажать `Получить из телефона`.
10. На системном экране HealthKit разрешить чтение шагов.

HealthKit может ограничивать приложение недавним историческим окном, и Apple специально не позволяет приложению надёжно различать отказ в чтении и отсутствие доступных данных. Поэтому FormulaVS всегда оставляет ручной ввод как резерв.

## Шаг 4. Android

После `npm run setup:native`:

1. Открыть папку `android/` в Android Studio.
2. В `android/app/src/main/AndroidManifest.xml` добавить:

```xml
<uses-permission android:name="android.permission.health.READ_STEPS" />
<queries>
    <package android:name="com.google.android.apps.healthdata" />
</queries>
```

3. В `android/app/build.gradle` добавить:

```gradle
implementation("androidx.health.connect:connect-client:1.1.0")
implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.10.2")
```

4. Убедиться, что `FormulaVSHealthPlugin.kt` находится в:
   `android/app/src/main/java/com/formulavs/health/FormulaVSHealthPlugin.kt`
5. Зарегистрировать plugin в Capacitor bridge сгенерированного Android-проекта.
6. Запустить на телефоне.
7. FormulaVS запросит `READ_STEPS`.
8. Разрешить доступ в Health Connect.
9. Нажать `Получить из телефона`.

Google рекомендует использовать агрегирование для шагов, а не суммировать сырые записи самостоятельно. В Android 14+ Health Connect также может автоматически учитывать шаги, собранные самим телефоном, когда приложению разрешён `READ_STEPS`.

## Как работает автоматическая интеграция

1. Пользователь один раз разрешает FormulaVS читать шаги.
2. При открытии/обновлении трекера FormulaVS обращается к нативному plugin.
3. iPhone получает дневную сумму из HealthKit.
4. Android получает дневную сумму из Health Connect.
5. Значение записывается в дневник FormulaVS как `steps`.
6. В дневнике сохраняется источник: `healthkit` или `health_connect`.
7. Если телефон недоступен или разрешение не выдано, остаётся ручной ввод.

## Публикация

### App Store

После тестирования:

- создать App ID `com.formulavs.app`;
- включить HealthKit capability для App ID;
- настроить signing/provisioning;
- собрать Archive в Xcode;
- пройти App Store Connect metadata/privacy review;
- отдельно описать использование HealthKit в заявке.

### Google Play

После тестирования:

- создать приложение в Play Console;
- настроить package `com.formulavs.app`;
- подписать Android App Bundle;
- заполнить Data Safety;
- выполнить требования Google Play для Health Connect/health data;
- загрузить `.aab` в закрытое тестирование, затем в production.

## Структура

```text
FormulaVS/
├─ index.html
├─ js/health-service.js
├─ package.json
├─ capacitor.config.ts
├─ scripts/
│  ├─ check-web.js
│  └─ setup-native.mjs
├─ packages/formulavs-health/
│  ├─ src/
│  ├─ ios/
│  └─ android/
├─ native-templates/
│  ├─ ios/
│  └─ android/
├─ ios/                 # создаётся/заполняется Capacitor
└─ android/             # создаётся/заполняется Capacitor
```

## Команды

```bash
npm install
npm run setup:native
npx cap sync
npm run verify
npm run open:ios
npm run open:android
```

Capacitor 8 — актуальная ветка документации на момент подготовки FormulaVS 4.0.
