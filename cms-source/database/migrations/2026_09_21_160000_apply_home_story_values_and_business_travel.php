<?php

use App\Support\ContentValidator;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('content_entries')) {
            return;
        }

        DB::transaction(function (): void {
            $this->patchEntry('landing', function (array $data): array {
                $values = [
                    '001' => 'О ТАНЖЕРИНЕ',
                    '002' => 'Место, куда приятно возвращаться',
                    '003' => '',
                    '004' => 'ТАНЖЕРИН — три гостевых дома в Костроме: ЛАЙМ, ЛИМОН и ЦИТРУС. У каждого — свой характер и своя атмосфера.',
                    '005' => 'Здесь можно приехать на несколько дней и жить в привычном ритме: приготовить завтрак на своей кухне, отдохнуть после прогулок по Костроме, провести вечер на веранде.',
                    '006' => 'Мы сделали дома такими, в каких хочется останавливаться в поездках: чистыми, уютными и продуманными для жизни.',
                    '007' => '',
                    '079' => 'НАШИ ЦЕННОСТИ',
                    '080' => 'Здесь ценят то, что действительно важно',
                    '081' => 'Чистоту',
                    '082' => 'Дом, в который приятно заехать.',
                    '083' => 'Тишину',
                    '084' => 'Чтобы по-настоящему отдохнуть.',
                    '085' => 'Заботу в деталях',
                    '086' => 'Когда нужные мелочи уже предусмотрены.',
                    '087' => '',
                    '088' => 'ДЛЯ КОМАНДИРОВОК',
                    '089' => 'Удобно остановиться по работе',
                    '090' => 'Wi‑Fi, рабочее место и своя кухня помогают сохранить привычный ритм в деловой поездке. После работы можно отдохнуть в тихом районе, а машину оставить на территории.',
                    '091' => 'Wi‑Fi',
                    '092' => 'Рабочее место',
                    '093' => 'Своя кухня',
                    '094' => 'Тихий район',
                    '095' => 'Парковка',
                    '096' => 'Бесконтактное заселение',
                    '097' => 'Проверить даты',
                    '098' => 'КОСТРОМА',
                    '099' => 'Кострома остаётся в воспоминаниях',
                    '100' => 'Своими улицами, Волгой и особой атмосферой.',
                    '101' => 'А «Танжерин» пусть будет тем местом, которое сделало вашу поездку ещё теплее.',
                    '102' => 'Выбрать даты',
                    '103' => 'Открыть путеводитель',
                ];

                $data['texts'] ??= [];
                foreach ($values as $key => $value) {
                    $this->upsert($data['texts'], $key, $value);
                }

                return $data;
            });

            $this->patchEntry('home', function (array $data): array {
                $data['seo'] ??= [];
                $data['seo']['h1'] = 'Место, куда приятно возвращаться';

                return $data;
            });

            $menu = [
                ['label' => 'Дома', 'href' => '#houses'],
                ['label' => 'Для гостей', 'href' => '/dlya-bolshoy-kompanii'],
                ['label' => 'Для командировочных', 'href' => '#business-travel'],
                ['label' => 'Галерея', 'href' => '#gallery'],
                ['label' => 'Отзывы', 'href' => '#reviews'],
                ['label' => 'Контакты', 'href' => '#contacts'],
                ['label' => 'Кострома', 'href' => '/kostroma'],
            ];
            $this->patchEntry('main-menu', function (array $data) use ($menu): array {
                $data['buttons'] = $menu;

                return $data;
            });
        });
    }

    private function patchEntry(string $key, callable $patch): void
    {
        $entry = DB::table('content_entries')->where('key', $key)->lockForUpdate()->first();
        if (! $entry) {
            return;
        }

        $changes = [];
        foreach (['draft', 'published'] as $column) {
            if ($entry->{$column} === null) {
                continue;
            }

            $data = json_decode($entry->{$column}, true, flags: JSON_THROW_ON_ERROR);
            $updated = $patch($data);
            if ($updated === $data) {
                continue;
            }

            ContentValidator::validate($entry->kind, $updated, $entry->key);
            $json = json_encode($updated, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
            $changes[$column] = $json;
            DB::table('content_revisions')->insert([
                'content_entry_id' => $entry->id,
                'user_id' => null,
                'action' => $column === 'draft' ? 'draft' : 'publish',
                'data' => $json,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        if ($changes === []) {
            return;
        }

        $changes['updated_at'] = now();
        if (isset($changes['published'])) {
            $changes['published_at'] = now();
        }
        DB::table('content_entries')->where('id', $entry->id)->update($changes);
    }

    private function upsert(array &$items, string $key, string $value): void
    {
        foreach ($items as &$item) {
            if (($item['key'] ?? null) !== $key) {
                continue;
            }

            $item['value'] = $value;
            unset($item);

            return;
        }
        unset($item);

        $items[] = ['key' => $key, 'value' => $value];
    }

    public function down(): void
    {
        // Published CMS copy remains editable and is not overwritten on rollback.
    }
};
