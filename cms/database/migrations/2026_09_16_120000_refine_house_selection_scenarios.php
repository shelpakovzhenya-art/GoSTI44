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

        $this->patchEntry('landing', function (array $data): array {
            $texts = [
                '029' => 'ВЫБЕРИТЕ СВОЙ ТАНЖЕРИН',
                '030' => 'Какой таунхаус подойдёт именно вам?',
                '031' => 'Три таунхауса — три разных сценария отдыха.',
                '032' => 'Сравните вместимость, планировку и удобства — и выберите вариант для своей поездки.',
            ];
            foreach ($data['texts'] ?? [] as &$item) {
                if (isset($texts[$item['key'] ?? ''])) {
                    $item['value'] = $texts[$item['key']];
                }
            }
            unset($item);

            return $data;
        });

        $this->patchEntry('lime', function (array $data): array {
            $data = array_replace($data, [
                'label' => 'Для семьи с детьми',
                'feature' => 'Собственная баня',
                'title' => 'Компактный семейный таунхаус с собственной баней',
                'description' => 'Для небольшой семьи, родителей с детьми и тех, кто хочет совместить проживание с собственной баней.',
            ]);
            $data['amenities'] = array_map(
                fn (string $amenity): string => $amenity === 'Баня и чайная зона' ? 'Собственная баня' : $amenity,
                $data['amenities'] ?? []
            );
            foreach ($data['images'] ?? [] as &$image) {
                if (($image['src'] ?? '') === '/images/spa-tea.jpg') {
                    $image['alt'] = 'Чайная зона при бане в таунхаусе «Лайм»';
                }
            }
            unset($image);

            return $data;
        });

        $this->patchEntry('lemon', fn (array $data): array => array_replace($data, [
            'label' => 'Для большой семьи',
            'title' => 'Просторный таунхаус для большой семьи и компании',
            'description' => 'Подойдёт нескольким поколениям семьи, двум семьям с детьми или компании друзей.',
        ]));

        $this->patchEntry('citrus', fn (array $data): array => array_replace($data, [
            'label' => 'Для компании',
            'title' => 'Четыре спальни — больше личного пространства',
            'description' => 'Для большой семьи, друзей и групп, которым важно быть вместе и при этом иметь отдельные комнаты.',
        ]));

        $this->patchEntry('photo-gallery', function (array $data): array {
            foreach ($data['images'] ?? [] as &$image) {
                if (($image['src'] ?? '') === '/images/spa-sauna.jpg') {
                    $image['alt'] = 'Собственная баня в таунхаусе «Лайм»';
                }
            }
            unset($image);

            return $data;
        });
    }

    public function down(): void
    {
        // CMS editors may change these fields after deployment; rollback must preserve their work.
    }

    private function patchEntry(string $key, callable $patch): void
    {
        DB::transaction(function () use ($key, $patch): void {
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
                if ($after === $before) {
                    continue;
                }
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
