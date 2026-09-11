# FormulaVS

FormulaVS — PWA для отслеживания веса, питания, активности, объёмов и прогресса.

## Запуск

Можно открыть `index.html` локально для базового просмотра. Для полноценного PWA/service worker нужен HTTPS или localhost.

Например:

```bash
python3 -m http.server 8080
```

Затем открыть `http://localhost:8080/`.

## Данные

Пользовательские данные хранятся локально в браузере. В версии 3.0.1 добавлены экспорт/импорт JSON для резервного копирования и переноса.

## Важные файлы

- `index.html` — приложение, стили и логика.
- `sw.js` — service worker/offline cache.
- `manifest.webmanifest` — PWA manifest.
- `version.json` — версия приложения.
- `CHANGELOG.md` — список изменений.
