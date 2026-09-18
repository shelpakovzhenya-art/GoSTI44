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

        $this->patchTextEntry('landing', [
            '048' => 'ВАШ КОНТАКТ ПЕРЕД ПОЕЗДКОЙ',
            '049' => 'Будем знакомы.',
            '050' => 'Я — Светлана.',
            '051' => 'Я занимаюсь размещением гостей в «Танжерине». Если не знаете, какой дом выбрать, напишите, сколько вас и когда планируете приехать.',
            '052' => 'Подскажу по спальным местам, проживанию с детьми и питомцами, бане и купели. Перед приездом объясню, как добраться и заселиться.',
            '053' => 'Написать Светлане',
        ]);

        $this->patchTextEntry('holiday-sections', [
            '040' => 'После бронирования можно заранее согласовать завтрак, мангал,',
            '041' => 'детские вещи и другие детали поездки. Баня находится в доме «Лайм».',
        ]);
    }

    public function down(): void
    {
        // Published CMS copy stays editable and is not overwritten on rollback.
    }

    private function patchTextEntry(string $key, array $texts): void
    {
        DB::transaction(function () use ($key, $texts): void {
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
                $found = [];
                foreach ($data['texts'] ?? [] as &$item) {
                    $itemKey = $item['key'] ?? '';
                    if (array_key_exists($itemKey, $texts)) {
                        $item['value'] = $texts[$itemKey];
                        $found[$itemKey] = true;
                    }
                }
                unset($item);

                foreach ($texts as $itemKey => $value) {
                    if (! isset($found[$itemKey])) {
                        $data['texts'][] = ['key' => $itemKey, 'value' => $value];
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
};
