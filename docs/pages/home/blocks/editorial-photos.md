# Фотографии внутри блоков — 09.09.2026

По прямому запросу пользователя сгенерированы два атмосферных натюрморта встроенным imagegen. Это художественные изображения, не документальные фотографии объекта. Реальные дома, SPA, территория, хозяйка и галерея сохранены. Новые изображения декоративные (пустой alt), текст и факты берутся из CMS.

- `public/images/editorial/mandarins.webp` — внутри блока о Танжерине рядом с текстом; 1536 × 1024.
- `public/images/editorial/tea.webp` — внутри блока услуг рядом с сеткой 2 × 2.
- WebP подготовлен без изменения содержания через sharp, установленный в проекте. Исходные PNG сохранены генератором; сайт использует собственные файлы public.
- Вырезанный растительный декор удалён. Большие песочные/шалфейные полосы заменены нейтральными поверхностями, компактными композициями и тонкими границами. Шапка и бизнес-логика не менялись.
- Проверено в браузере 1440 и 390 px: изображения загружаются, мобильные кадрирования просмотрены, описание услуги раскрывается, runtime errors и горизонтального overflow нет. TypeScript, ESLint, verify:content и production build прошли. Проверка CMS-редактирования новых изображений не выполнялась; отдельные записи медиа для них не добавлены.

## Точные промпты (built-in imagegen)

### Мандарины

Use case: photorealistic-natural. Asset: editorial photograph for a Russian guesthouse website called Tangerine, inserted as an actual rectangular photo beside introductory copy. Generate one landscape photograph, 3:2 composition. Close still life of three naturally imperfect mandarins, one partly peeled, with a small attached dark green leaf on a shallow handmade ivory ceramic plate, casually placed on an oatmeal linen cloth on a warm worn oak tabletop beside a window. A little of the table is visible, backdrop softly out of focus, no room architecture. Warm restrained cream, natural orange, muted olive. Real optical photography, 50mm lens, gentle side daylight, authentic rind pores and linen weave, subtle film grain, soft imperfect shadows. Understated inviting domestic mood, beautiful but not advertising gloss. Subjects composed centrally with breathing room for cropping. No text, no logos, no collage, no floating fruit, no illustration, no 3D rendering, no overly perfect symmetry, no dramatic fake bokeh, no orange color cast.

### Чай

Use case: photorealistic-natural. Asset: editorial atmospheric photograph for a warm intimate guesthouse website, placed inside a section beside practical information. One portrait 4:5 photograph, close-up of a quiet tea moment: two simple ivory stoneware cups of amber tea on a warm oak table, a casually folded oatmeal linen napkin, a small saucer with a single fresh lemon wedge. Natural window light from the side, gently blurred olive-green garden far behind, framing limited to tabletop, no architecture or invented amenities. Restrained natural cream, honey wood, subtle green palette. Real 50mm editorial lifestyle photography, tangible irregular ceramic glaze and linen weave, soft organic shadows, moderate depth of field, understated natural beauty, slight film texture. No people, no typography, no logo, no floating elements, no collage, no illustration, no 3D rendering, no spa towels, no polished luxury hotel staging.
