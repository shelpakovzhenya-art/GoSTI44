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
                    '002' => 'Три просторных таунхауса в Костроме',
                    '003' => '',
                    '004' => 'Для отдыха с семьёй, друзьями и деловых поездок, а также для тех, кто ценит пространство и комфорт.',
                    '005' => '',
                    '006' => '',
                    '007' => '',
                ];

                $data['texts'] ??= [];
                foreach ($values as $key => $value) {
                    $this->upsert($data['texts'], $key, $value);
                }

                return $data;
            });

            $this->patchEntry('home', function (array $data): array {
                $data['seo'] ??= [];
                $data['seo']['h1'] = 'Три просторных таунхауса в Костроме';

                return $data;
            });

            $this->patchEntry('site-settings', function (array $data): array {
                $data['fields'] ??= [];
                $this->upsert($data['fields'], 'max', 'https://max.ru/');

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
