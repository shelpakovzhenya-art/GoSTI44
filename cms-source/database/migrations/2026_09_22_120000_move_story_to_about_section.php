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
                ['key' => '001', 'value' => 'ГОСТЕВЫЕ ДОМА В КОСТРОМЕ'],
                ['key' => '002', 'value' => 'Три просторных таунхауса'],
                ['key' => '003', 'value' => 'в Костроме'],
                ['key' => '004', 'value' => 'Для отдыха с семьёй, друзьями, деловых поездок и тех, кто ценит пространство и комфорт.'],
                ['key' => '020', 'value' => 'Место, куда приятно'],
                ['key' => '021', 'value' => 'возвращаться'],
                ['key' => '022', 'value' => 'ТАНЖЕРИН — три таунхауса в Костроме: ЛАЙМ, ЛИМОН и ЦИТРУС. У каждого — свой характер и своя атмосфера.'],
                ['key' => '023', 'value' => 'Здесь можно приехать на несколько дней и жить в привычном ритме: приготовить завтрак на своей кухне, отдохнуть после прогулок по Костроме, провести вечер на веранде.'],
            ];
            $changes = [];

            foreach (['draft', 'published'] as $column) {
                if ($entry->{$column} === null) {
                    continue;
                }

                $data = json_decode($entry->{$column}, true, flags: JSON_THROW_ON_ERROR);
                $items = $data['texts'] ?? [];
                foreach ($texts as $text) {
                    foreach ($items as &$item) {
                        if (($item['key'] ?? null) !== $text['key']) {
                            continue;
                        }
                        $item['value'] = $text['value'];
                        break;
                    }
                    unset($item);
                }
                $data['texts'] = $items;

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
