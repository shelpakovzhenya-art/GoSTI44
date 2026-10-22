<?php

use App\Support\ContentValidator;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('content_entries') || ! DB::table('content_entries')->where('key', 'home')->exists()) {
            return;
        }

        $this->replacePublicTerms();
        $this->syncPages();
        $this->syncBathService();

        $collections = json_decode(file_get_contents(dirname(base_path()).'/content/collections.json'), true, flags: JSON_THROW_ON_ERROR);
        $menu = array_map(fn (array $link): array => ['label' => $link[0], 'href' => str_starts_with($link[1], '/') ? $link[1] : '#'.$link[1]], $collections['links']);
        $this->patchEntry('main-menu', fn (array $data): array => array_replace($data, ['buttons' => $menu]), 'Главное меню');

        $this->patchEntry('home', function (array $data): array {
            $data['seo'] = array_replace($data['seo'] ?? [], [
                'title' => 'Танжерин — гостевые дома в Костроме с кухней и верандой',
                'description' => 'Три самостоятельных гостевых дома в Костроме для семьи или компании до 25 гостей. Отдельные входы, кухни, веранды и мангальные зоны. Фотографии, свободные даты и бронирование.',
            ]);
            return $data;
        });
    }

    public function down(): void
    {
        // Published client copy and pages remain editable and are not overwritten on rollback.
    }

    private function replacePublicTerms(): void
    {
        DB::table('content_entries')->orderBy('id')->each(function (object $entry): void {
            $changes = [];
            foreach (['draft', 'published'] as $column) {
                if ($entry->{$column} === null) {
                    continue;
                }
                $before = json_decode($entry->{$column}, true, flags: JSON_THROW_ON_ERROR);
                $after = $this->replaceRecursive($before);
                if ($after === $before) {
                    continue;
                }
                ContentValidator::validate($entry->kind, $after, $entry->key);
                $json = json_encode($after, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
                $changes[$column] = $json;
                $this->revision($entry->id, $column, $json);
            }
            $name = $this->replaceText($entry->name);
            if ($name !== $entry->name) {
                $changes['name'] = $name;
            }
            if ($changes !== []) {
                $changes['updated_at'] = now();
                if (isset($changes['published'])) {
                    $changes['published_at'] = now();
                }
                DB::table('content_entries')->where('id', $entry->id)->update($changes);
            }
        });
    }

    private function replaceRecursive(mixed $value): mixed
    {
        if (is_string($value)) {
            return $this->replaceText($value);
        }
        if (! is_array($value)) {
            return $value;
        }
        foreach ($value as $key => $item) {
            $value[$key] = $this->replaceRecursive($item);
        }
        return $value;
    }

    private function replaceText(string $value): string
    {
        return str_replace(
            ['ТАУНХАУСАХ', 'ТАУНХАУСАМИ', 'ТАУНХАУСОВ', 'ТАУНХАУСА', 'ТАУНХАУСЕ', 'ТАУНХАУСЫ', 'ТАУНХАУС', 'Таунхаусах', 'Таунхаусами', 'Таунхаусов', 'Таунхауса', 'Таунхаусе', 'Таунхаусы', 'Таунхаус', 'таунхаусах', 'таунхаусами', 'таунхаусов', 'таунхауса', 'таунхаусе', 'таунхаусы', 'таунхаус', 'SPA-зона с баней', 'SPA-зона', 'SPA', 'СПА'],
            ['ДОМАХ', 'ДОМАМИ', 'ДОМОВ', 'ДОМА', 'ДОМЕ', 'ДОМА', 'ДОМ', 'Домах', 'Домами', 'Домов', 'Дома', 'Доме', 'Дома', 'Дом', 'домах', 'домами', 'домов', 'дома', 'доме', 'дома', 'дом', 'Баня и чайная зона', 'баня', 'баня', 'баня'],
            $value
        );
    }

    private function syncPages(): void
    {
        $pages = json_decode(file_get_contents(dirname(base_path()).'/content/pages.json'), true, flags: JSON_THROW_ON_ERROR);
        foreach ($pages as $position => $page) {
            $key = $page['key'];
            $name = $page['name'];
            unset($page['key'], $page['name']);
            if (! in_array($key, ['kostroma', 'kostroma/gde-poest', 'kostroma/dostoprimechatelnosti'], true)) {
                continue;
            }
            ContentValidator::validate('page', $page, $key);
            $this->upsertEntry('page', $key, $name, $page, $position + 1);
        }
    }

    private function syncBathService(): void
    {
        $collections = json_decode(file_get_contents(dirname(base_path()).'/content/collections.json'), true, flags: JSON_THROW_ON_ERROR);
        $bath = collect($collections['services'])->firstWhere('className', 'bath');
        if (! is_array($bath)) {
            return;
        }
        $data = [
            'title' => $bath['title'], 'description' => $bath['text'], 'detail' => $bath['detail'],
            'icon' => $bath['icon'], 'className' => $bath['className'], 'images' => $bath['images'],
        ];
        ContentValidator::validate('service', $data, 'service-bath');
        $this->upsertEntry('service', 'service-bath', $data['title'], $data, 2);
        foreach (['service-breakfast', 'service-barbecue', 'service-bath', 'service-children', 'service-comfort'] as $position => $key) {
            DB::table('content_entries')->where('key', $key)->update(['position' => $position, 'updated_at' => now()]);
        }
    }

    private function upsertEntry(string $kind, string $key, string $name, array $data, int $position): void
    {
        $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
        DB::transaction(function () use ($kind, $key, $name, $json, $position): void {
            $entry = DB::table('content_entries')->where('key', $key)->lockForUpdate()->first();
            if ($entry) {
                $changes = ['kind' => $kind, 'name' => $name, 'position' => $position, 'draft' => $json, 'published' => $json, 'published_at' => now(), 'updated_at' => now()];
                DB::table('content_entries')->where('id', $entry->id)->update($changes);
                $this->revision($entry->id, 'published', $json);
                return;
            }
            $now = now();
            $id = DB::table('content_entries')->insertGetId([
                'kind' => $kind, 'key' => $key, 'name' => $name, 'draft' => $json, 'published' => $json,
                'position' => $position, 'published_at' => $now, 'created_at' => $now, 'updated_at' => $now,
            ]);
            $this->revision($id, 'published', $json);
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
                $json = json_encode($after, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
                if ($json !== $entry->{$column}) {
                    $changes[$column] = $json;
                    $this->revision($entry->id, $column, $json);
                }
            }
            if ($name !== null) {
                $changes['name'] = $name;
            }
            if ($changes !== []) {
                $changes['updated_at'] = now();
                if (isset($changes['published'])) {
                    $changes['published_at'] = now();
                }
                DB::table('content_entries')->where('id', $entry->id)->update($changes);
            }
        });
    }

    private function revision(int $entryId, string $column, string $json): void
    {
        DB::table('content_revisions')->insert([
            'content_entry_id' => $entryId, 'user_id' => null,
            'action' => $column === 'draft' ? 'draft' : 'publish', 'data' => $json,
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }
};
