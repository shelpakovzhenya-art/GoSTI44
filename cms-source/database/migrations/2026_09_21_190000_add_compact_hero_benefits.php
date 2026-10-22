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
            $entry = DB::table('content_entries')->where('key', 'landing')->lockForUpdate()->first();
            if (! $entry) {
                return;
            }

            $texts = [
                ['key' => '104', 'value' => 'Тихий район Костромы'],
                ['key' => '105', 'value' => '12 минут до центра'],
                ['key' => '106', 'value' => 'Волга рядом'],
                ['key' => '107', 'value' => 'Отдельный дом'],
                ['key' => '108', 'value' => 'До 10 гостей'],
                ['key' => '109', 'value' => 'свой вход'],
                ['key' => '110', 'value' => 'Территория'],
                ['key' => '111', 'value' => 'Веранда и мангал'],
                ['key' => '112', 'value' => 'парковка'],
            ];
            $changes = [];

            foreach (['draft', 'published'] as $column) {
                if ($entry->{$column} === null) {
                    continue;
                }

                $data = json_decode($entry->{$column}, true, flags: JSON_THROW_ON_ERROR);
                $data['texts'] ??= [];
                foreach ($texts as $text) {
                    $key = $text['key'];
                    $value = $text['value'];
                    $found = false;
                    foreach ($data['texts'] as &$item) {
                        if (($item['key'] ?? null) !== $key) {
                            continue;
                        }
                        $item['value'] = $value;
                        $found = true;
                        break;
                    }
                    unset($item);
                    if (! $found) {
                        $data['texts'][] = ['key' => $key, 'value' => $value];
                    }
                }

                ContentValidator::validate($entry->kind, $data, $entry->key);
                $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
                if ($json === $entry->{$column}) {
                    continue;
                }

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
        });
    }

    public function down(): void
    {
        // Published CMS copy remains editable and is not overwritten on rollback.
    }
};
