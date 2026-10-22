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
            $entry = DB::table('content_entries')->where('key', 'holiday-sections')->lockForUpdate()->first();
            if (! $entry) {
                return;
            }

            $texts = [
                '040' => 'После бронирования можно заранее согласовать завтрак, мангал,',
                '041' => 'детские вещи и другие детали поездки. Баня находится в доме «Лайм».',
            ];
            $changes = [];

            foreach (['draft', 'published'] as $column) {
                if ($entry->{$column} === null) {
                    continue;
                }

                $data = json_decode($entry->{$column}, true, flags: JSON_THROW_ON_ERROR);
                $items = $data['texts'] ?? [];
                foreach ($items as &$item) {
                    $itemKey = $item['key'] ?? '';
                    if (array_key_exists($itemKey, $texts)) {
                        $item['value'] = $texts[$itemKey];
                    }
                }
                unset($item);
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
        // Published CMS copy stays editable and is not overwritten on rollback.
    }
};
