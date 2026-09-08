# Зафиксировать accessibility-правила

## Когда использовать

После tokens, layout и component inventory, до design-system review и implementation.

## Роль Codex

Ты accessibility-minded frontend engineer.

## Цель

Создать `docs/design-system/accessibility.md`: короткие правила, которые действуют и для stable UI, и для любых provisional visual experiments.

## Контекст, который нужно дать

- Tokens, iconography, layout rules и component inventory.
- Тип сайта, аудитория и реальные compliance требования.
- `prompts/_guidelines/creator-critic-design-workflow.md`.
- Релевантные accessibility sections UI quality base.

## Ограничения

Accessibility никогда не является provisional. Новая композиция, media treatment, pictogram, gradient, overlap или motion не получает исключение только потому, что это творческий эксперимент.

## Процесс

1. Зафиксируй project-relevant semantic HTML: headings, landmarks, nav, buttons, links, lists, forms и tables.
2. Определи keyboard, focus, target size и interaction rules.
3. Проверь contrast/readability для stable и provisional color/surface combinations.
4. Определи form labels, help, required, error, loading, empty и success semantics.
5. Определи image alt, decorative media, icon-only controls, captions и proof labeling.
6. Определи motion/reduced-motion и safe behavior для expressive experiments.
7. Добавь только применимые domain rules: e-commerce, dashboard, filters, checkout и dense data.
8. Составь короткий block checklist для build и screenshot critic.
9. Создай `docs/design-system/accessibility.md` и обнови `docs/project-state.md`.

## Output

Пиши человекочитаемый артефакт и сообщение по-русски и кратко. Сохраняй технические идентификаторы; удаляй пустые разделы и повторы.

```md
# Правила доступности

## Обязательные принципы
## Семантический HTML
## Клавиатура, фокус и области нажатия
## Контраст и читаемость
## Формы и состояния
## Изображения, иконки и доказательства
## Анимация и reduced motion
## Предметные правила
## Чек-лист блока
```

## Done when

- Правила конкретны и применимы к будущему build.
- Stable и provisional UI одинаково проходят contrast, focus, semantics и reduced-motion requirements.
- Есть короткий checklist для creator→render→critic workflow.
- `docs/project-state.md` обновлён.

## Follow-up

Следующий промпт: `prompts/05-design-system/12-design-system-review.md`.
