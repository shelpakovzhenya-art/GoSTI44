<?php

use App\Support\ContentValidator;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('content_entries') || ! DB::table('content_entries')->exists()) {
            return;
        }

        $this->patchTextEntry('landing', [
            '004' => 'Один большой дом с тремя таунхаусами — для семей,',
            '007' => 'до центра Костромы — около 12 минут на машине.',
            '009' => 'Посмотреть таунхаусы',
            '011' => 'в одном таунхаусе',
            '013' => 'в трёх таунхаусах',
            '014' => '12 минут на машине до центра',
            '017' => 'Avito, Яндекс Карты и 2ГИС',
            '020' => 'Таунхаусы в Костроме',
            '022' => 'В «Танжерине» один большой дом разделён на три самостоятельных таунхауса. У каждого — отдельный вход, спальни, кухня и веранда.',
            '023' => 'Общая территория небольшая и уютная: сад, качели и места для прогулки. До центра Костромы — около 12 минут на машине.',
            '024' => 'таунхауса',
            '025' => '12 минут',
            '026' => 'на машине до центра',
            '027' => 'Общий сад',
            '028' => 'качели и место для прогулки',
            '029' => 'ТАУНХАУСЫ',
            '030' => 'Выберите таунхаус по числу гостей',
            '031' => 'От 67 до 100 м², у каждого — отдельный вход.',
            '032' => 'Сравните число спален, фотографии и удобства.',
            '034' => 'Своя веранда и мангал',
            '035' => 'у каждого таунхауса',
            '036' => 'У каждого таунхауса — отдельный вход, крытая веранда со столом и своя мангальная зона. Небольшой общий сад с качелями открыт для всех гостей.',
            '039' => 'Таунхаусы, комнаты и территория',
            '040' => 'Настоящие фотографии наших таунхаусов и территории',
            '043' => 'Читать отзывы на Avito',
            '051' => 'Я занимаюсь размещением гостей в «Танжерине». Если не знаете, какой таунхаус выбрать, напишите, сколько вас и когда планируете приехать.',
            '052' => 'Подскажу по спальным местам, проживанию с детьми и питомцами, бане и купели. Перед приездом объясню, как добраться и заселиться.',
            '057' => 'Укажите даты и число гостей. В форме появятся доступные таунхаусы и цена проживания. Если нужны два или три таунхауса сразу, напишите Светлане.',
            '065' => 'Тихий район Черноречья, около 12 минут на машине до центра города.',
            '069' => 'Как подъехать к «Танжерину»',
            '071' => 'Наши таунхаусы',
            '077' => 'Таунхаусы в Костроме',
        ]);

        $this->patchTextEntry('holiday-sections', [
            '001' => 'ВСЁ ВАЖНОЕ ДЛЯ ПРОЖИВАНИЯ',
            '002' => 'Всё необходимое уже здесь',
            '006' => 'Три таунхауса для компании',
            '008' => 'Забронируйте два или три соседних таунхауса для родственников или друзей. Вы будете рядом на общей территории, а у каждой семьи останутся отдельный вход, спальни, кухня и веранда.',
            '010' => 'Отдельные вход, кухня, спальни и веранда',
            '020' => 'ЛАЙМ · С БАНЕЙ И ЧАЙНОЙ ЗОНОЙ',
            '022' => 'БАНЯ И ЧАЙНАЯ ЗОНА',
            '024' => 'в таунхаусе «Лайм»',
            '025' => 'В «Лайме» есть собственная баня и чайная зона. Ими пользуются только гости этого таунхауса. Купель доступна по выбранному тарифу — уточните условия перед бронированием.',
            '031' => 'и банные принадлежности',
            '033' => 'Баня в таунхаусе «Лайм»',
            '034' => 'Баня доступна только гостям таунхауса «Лайм». Купель зависит от выбранного тарифа. Условия и стоимость согласуем до приезда.',
            '035' => 'Уточнить условия',
            '036' => 'Только для гостей «Лайма»',
            '037' => 'ВСЁ ДЛЯ ВАШЕГО ОТДЫХА',
            '038' => 'Всё важное',
            '039' => 'для комфортного отдыха',
            '040' => 'Мы продумали каждую деталь, чтобы ваш отдых был',
            '041' => 'по-настоящему комфортным и запоминающимся.',
            '043' => 'Обсудить детали',
            '044' => 'Всё необходимое можно согласовать после бронирования.',
            '045' => 'Напишите Светлане, что подготовить к вашему приезду.',
            '046' => 'Написать Светлане',
        ], 'Удобства, компания, баня и всё для отдыха');

        $this->patchTextEntry('navigation', [
            '001' => 'Кострома, Октябрьская улица, 45',
            '002' => 'Кухня и веранда у каждого таунхауса',
        ]);
        $this->patchTextEntry('houses', [
            '001' => 'Таунхаус «',
            '002' => 'ВАШ ТАУНХАУС В КОСТРОМЕ',
            '003' => 'Таунхаус «',
        ], 'Карточки таунхаусов');
        $this->patchTextEntry('embeds', [
            '006' => 'Стоимость и условия — в действующем модуле бронирования. Для размещения в нескольких таунхаусах свяжитесь со Светланой.',
            '009' => 'Кострома, Октябрьская улица, 45',
        ]);

        $this->patchEntry('site-settings', function (array $data): array {
            $values = [
                'route' => 'https://yandex.ru/maps/?mode=routes&rtext=~%D0%9A%D0%BE%D1%81%D1%82%D1%80%D0%BE%D0%BC%D0%B0%2C%20%D0%9E%D0%BA%D1%82%D1%8F%D0%B1%D1%80%D1%8C%D1%81%D0%BA%D0%B0%D1%8F%20%D1%83%D0%BB%D0%B8%D1%86%D0%B0%2C%2045&rtt=auto',
                'address' => 'Кострома, Октябрьская улица, 45',
                'avito' => 'https://www.avito.ru/user/23247c55bfeed02f5abc30847c6ce191/profile?src=sharing',
            ];
            $fields = $data['fields'] ?? [];
            $fields = array_values(array_filter($fields, fn (array $field): bool => ($field['key'] ?? null) !== 'google'));
            foreach ($values as $key => $value) {
                $found = false;
                foreach ($fields as &$field) {
                    if (($field['key'] ?? null) === $key) {
                        $field['value'] = $value;
                        $found = true;
                        break;
                    }
                }
                unset($field);
                if (! $found) {
                    $fields[] = ['key' => $key, 'value' => $value];
                }
            }
            $data['fields'] = $fields;

            return $data;
        });

        $this->syncRatings();

        $this->patchEntry('main-menu', function (array $data): array {
            $labels = [
                '#houses' => 'Таунхаусы',
                '#company' => 'Для компании',
                '#spa' => 'Баня',
                '#services' => 'Всё для отдыха',
            ];
            $data['buttons'] ??= [];
            foreach ($data['buttons'] as &$button) {
                $href = $button['href'] ?? '';
                if (isset($labels[$href])) {
                    $button['label'] = $labels[$href];
                }
            }
            unset($button);

            return $data;
        });

        $this->patchEntry('comforts', function (array $data): array {
            $items = $data['items'] ?? [];
            $updates = [
                0 => ['title' => '3 таунхауса', 'text' => 'Один большой дом разделён на три самостоятельных блока.'],
                1 => ['title' => 'Собственная веранда', 'text' => 'У каждого таунхауса — стол и места для отдыха.'],
                3 => ['title' => 'Мангальная зона', 'text' => 'Своя зона у каждого таунхауса.'],
            ];
            foreach ($updates as $index => $update) {
                if (isset($items[$index])) {
                    $items[$index] = array_replace($items[$index], $update);
                }
            }
            $data['items'] = $items;

            return $data;
        }, 'Удобства таунхаусов');

        $this->patchEntry('photo-gallery', function (array $data): array {
            $data['images'] ??= [];
            foreach ($data['images'] as &$image) {
                if (($image['src'] ?? '') === '/images/spa-sauna.jpg') {
                    $image['alt'] = 'Баня в таунхаусе «Лайм»';
                }
            }
            unset($image);

            return $data;
        });

        $this->patchEntry('service-barbecue', fn (array $data): array => array_replace($data, [
            'description' => 'Мангальная зона у каждого таунхауса.',
        ]));
        $this->patchEntry('service-comfort', fn (array $data): array => array_replace($data, [
            'title' => 'Забота о деталях',
            'description' => 'Обсудим подготовку таунхауса к вашему приезду.',
            'detail' => 'Есть особые пожелания к приезду или проживанию? Расскажите о них Светлане — обсудим доступные варианты и стоимость.',
        ]), 'Забота о деталях');

        $this->patchEntry('lime', fn (array $data): array => array_replace($data, [
            'label' => 'С баней и чайной зоной',
            'feature' => 'Своя баня',
            'description' => 'Таунхаус площадью 67 м² с кухней-столовой, двумя санузлами, собственной баней и чайной зоной. Подойдёт семье с детьми.',
            'images' => $this->townhouseImageAlts($data['images'] ?? []),
            'amenities' => array_map(
                fn (string $amenity): string => $amenity === 'SPA-зона с баней' ? 'Баня и чайная зона' : $amenity,
                $data['amenities'] ?? []
            ),
        ]));
        $this->patchEntry('lemon', fn (array $data): array => array_replace($data, [
            'description' => 'Таунхаус площадью около 100 м² для семьи или компании до 9 человек. Есть отдельная гостиная, кухня-столовая и два санузла.',
            'images' => $this->townhouseImageAlts($data['images'] ?? []),
        ]));
        $this->patchEntry('citrus', fn (array $data): array => array_replace($data, [
            'description' => 'Таунхаус площадью 97 м² на компанию до 10 гостей. Четыре спальни, отдельные кровати, три санузла и своя веранда.',
            'images' => $this->townhouseImageAlts($data['images'] ?? []),
        ]));

        $this->patchEntry('faq-5', fn (array $data): array => array_replace($data, [
            'description' => 'С 22:00 до 07:00 соблюдаем тишину. Таунхаусы и веранды предназначены для спокойного отдыха. Курение в доме запрещено. У каждого таунхауса своя мангальная зона; визиты дополнительных гостей необходимо согласовывать заранее.',
        ]));

        $this->patchEntry('home', function (array $data): array {
            $data['seo'] = array_replace($data['seo'] ?? [], [
                'description' => 'Один большой дом с тремя самостоятельными таунхаусами в Костроме для семьи или компании до 25 гостей. Отдельные входы, кухни, веранды и мангальные зоны. Фотографии, свободные даты и бронирование.',
            ]);

            return $data;
        });
    }

    public function down(): void
    {
        // Published editorial changes can be edited further in CMS, so rollback must not overwrite them.
    }

    private function patchTextEntry(string $key, array $texts, ?string $name = null): void
    {
        $this->patchEntry($key, function (array $data) use ($texts): array {
            $data['texts'] ??= [];
            foreach ($data['texts'] as &$item) {
                $textKey = $item['key'] ?? '';
                if (array_key_exists($textKey, $texts)) {
                    $item['value'] = $texts[$textKey];
                }
            }
            unset($item);

            return $data;
        }, $name);
    }

    private function townhouseImageAlts(array $images): array
    {
        return array_map(function (array $image): array {
            $image['alt'] = str_replace(
                ['дома «', 'в доме «'],
                ['таунхауса «', 'в таунхаусе «'],
                $image['alt'] ?? ''
            );

            return $image;
        }, $images);
    }

    private function syncRatings(): void
    {
        $avito = [
            'id' => 'avito',
            'name' => 'Avito',
            'rating' => '4,7',
            'count' => '116 отзывов',
            'logo' => '/images/avito-logo.svg',
            'url' => 'https://www.avito.ru/user/23247c55bfeed02f5abc30847c6ce191/profile?src=sharing',
        ];
        ContentValidator::validate('rating', $avito, 'rating-avito');

        DB::transaction(function () use ($avito): void {
            $encoded = json_encode($avito, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
            $entry = DB::table('content_entries')->where('key', 'rating-avito')->lockForUpdate()->first();

            if ($entry) {
                $changes = ['kind' => 'rating', 'name' => 'Avito', 'position' => 0, 'updated_at' => now()];
                foreach (['draft', 'published'] as $column) {
                    if ($entry->{$column} !== $encoded) {
                        $changes[$column] = $encoded;
                        DB::table('content_revisions')->insert([
                            'content_entry_id' => $entry->id,
                            'user_id' => null,
                            'action' => $column === 'draft' ? 'draft' : 'publish',
                            'data' => $encoded,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                }
                if (isset($changes['published'])) {
                    $changes['published_at'] = now();
                }
                DB::table('content_entries')->where('id', $entry->id)->update($changes);
            } else {
                $id = DB::table('content_entries')->insertGetId([
                    'kind' => 'rating',
                    'key' => 'rating-avito',
                    'name' => 'Avito',
                    'draft' => $encoded,
                    'published' => $encoded,
                    'published_at' => now(),
                    'position' => 0,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                foreach (['draft', 'publish'] as $action) {
                    DB::table('content_revisions')->insert([
                        'content_entry_id' => $id,
                        'user_id' => null,
                        'action' => $action,
                        'data' => $encoded,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            DB::table('content_entries')->where('key', 'rating-yandex')->update(['position' => 1, 'updated_at' => now()]);
            DB::table('content_entries')->where('key', 'rating-gis')->update(['position' => 2, 'updated_at' => now()]);
            DB::table('content_entries')->where('key', 'rating-google')->update([
                'published' => null,
                'published_at' => null,
                'position' => 3,
                'updated_at' => now(),
            ]);
        });
    }

    private function patchEntry(string $key, callable $patch, ?string $name = null): void
    {
        DB::transaction(function () use ($key, $patch, $name): void {
            $entry = DB::table('content_entries')->where('key', $key)->lockForUpdate()->first();
            if (! $entry) {
                return;
            }

            $changes = [];
            foreach (['draft', 'published'] as $column) {
                if ($entry->{$column} === null) {
                    continue;
                }
                $before = json_decode($entry->{$column}, true, flags: JSON_THROW_ON_ERROR);
                $after = $patch($before);
                ContentValidator::validate($entry->kind, $after, $entry->key);
                if ($after !== $before) {
                    $changes[$column] = json_encode($after, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
                    DB::table('content_revisions')->insert([
                        'content_entry_id' => $entry->id,
                        'user_id' => null,
                        'action' => $column === 'draft' ? 'draft' : 'publish',
                        'data' => $changes[$column],
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            if ($name !== null && $name !== $entry->name) {
                $changes['name'] = $name;
            }
            if ($changes === []) {
                return;
            }

            $changes['updated_at'] = now();
            if (isset($changes['published'])) {
                $changes['published_at'] = now();
            }
            DB::table('content_entries')->where('id', $entry->id)->update($changes);
        });
    }
};
