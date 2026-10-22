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
        // Fresh test/install databases are populated by the seeder afterwards.
        if (! DB::table('content_entries')->where('key', 'home')->exists()) {
            return;
        }

        $pagesPath = dirname(base_path()).'/content/pages.json';
        if (is_file($pagesPath)) {
            $pages = json_decode(file_get_contents($pagesPath), true, flags: JSON_THROW_ON_ERROR);
            foreach ($pages as $position => $page) {
                $key = $page['key'];
                $name = $page['name'];
                unset($page['key'], $page['name']);
                ContentValidator::validate('page', $page, $key);
                if (DB::table('content_entries')->where('key', $key)->exists()) {
                    continue;
                }
                $json = json_encode($page, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
                $now = now();
                $id = DB::table('content_entries')->insertGetId([
                    'kind' => 'page', 'key' => $key, 'name' => $name,
                    'draft' => $json, 'published' => $json, 'position' => $position + 1,
                    'published_at' => $now, 'created_at' => $now, 'updated_at' => $now,
                ]);
                DB::table('content_revisions')->insert([
                    'content_entry_id' => $id, 'user_id' => null, 'action' => 'publish',
                    'data' => $json, 'created_at' => $now, 'updated_at' => $now,
                ]);
            }
        }

        $landingTexts = [
            '002' => 'Один большой дом',
            '003' => 'с тремя таунхаусами',
            '004' => 'Для семей, друзей и компаний до 25 гостей.',
            '005' => 'Можно жить рядом и сохранять личное пространство.',
            '006' => 'У каждого дома — своя кухня, веранда и мангальная зона.',
            '007' => '',
            '009' => 'Выбрать дом',
            '011' => 'в одном доме',
            '013' => 'в трёх домах',
            '014' => 'Кострома · Октябрьская улица, 45',
            '020' => 'Три дома рядом',
            '021' => 'для семьи или компании',
            '022' => 'Один большой дом разделён на три самостоятельные части. У каждой — отдельный вход, спальни, кухня и веранда.',
            '024' => 'дома',
            '025' => '3',
            '026' => 'самостоятельных дома',
            '030' => 'Какой дом подойдёт именно вам?',
            '031' => 'Три дома — три разных сценария отдыха.',
            '039' => 'Дома, комнаты и территория',
            '040' => 'Настоящие фотографии домов и территории',
            '065' => 'Тихий район Черноречья.',
            '071' => 'Наши дома',
            '077' => 'Дома в Костроме',
        ];
        $this->patchEntry('landing', function (array $data) use ($landingTexts): array {
            $data['texts'] ??= [];
            foreach ($data['texts'] as &$item) {
                $key = $item['key'] ?? '';
                if (array_key_exists($key, $landingTexts)) {
                    $item['value'] = $landingTexts[$key];
                }
            }
            unset($item);
            return $data;
        });

        $this->patchEntry('home', function (array $data): array {
            $data['seo'] ??= [];
            $data['seo']['h1'] = 'Один большой дом';
            return $data;
        });

        $this->patchEntry('navigation', function (array $data): array {
            $data['texts'] ??= [];
            foreach ($data['texts'] as &$item) {
                if (($item['key'] ?? '') === '002') {
                    $item['value'] = 'Кухня и веранда у каждого дома';
                }
            }
            unset($item);
            return $data;
        });

        $this->patchEntry('lime', function (array $data): array {
            $data['images'] ??= [];
            foreach ($data['images'] as &$image) {
                if (($image['src'] ?? '') === '/images/spa-tea.jpg') {
                    $image['alt'] = 'Чайная зона при бане в доме «Лайм»';
                }
            }
            unset($image);
            return $data;
        });

        $menu = [
            ['label' => 'Дома', 'href' => '#houses'],
            ['label' => 'Для большой компании', 'href' => '/dlya-bolshoy-kompanii'],
            ['label' => 'Для гостей', 'href' => '#services'],
            ['label' => 'Галерея', 'href' => '#gallery'],
            ['label' => 'Отзывы', 'href' => '#reviews'],
            ['label' => 'Кострома', 'href' => '#contacts'],
        ];
        $this->patchEntry('main-menu', function (array $data) use ($menu): array {
            $data['buttons'] = $menu;
            return $data;
        });
    }

    public function down(): void
    {
        // Published pages and later editor changes are intentionally preserved.
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
                $json = json_encode($after, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
                $changes[$column] = $json;
                DB::table('content_revisions')->insert([
                    'content_entry_id' => $entry->id, 'user_id' => null,
                    'action' => $column === 'draft' ? 'draft' : 'publish', 'data' => $json,
                    'created_at' => now(), 'updated_at' => now(),
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
