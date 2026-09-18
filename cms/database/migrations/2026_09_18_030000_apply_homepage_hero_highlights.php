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
            '002' => 'Три просторных',
            '003' => 'таунхауса в Костроме',
            '004' => 'Для отдыха с семьёй, друзьями и деловых поездок.',
            '005' => '',
            '006' => 'Для тех, кто ценит пространство и комфорт.',
            '007' => '',
            '008' => 'Проверить даты и стоимость',
            '009' => 'Сравнить дома',
            '079' => 'Тихий район Костромы',
            '080' => 'Всего 12 минут на машине до центра',
            '081' => 'Волга — в шаговой доступности',
            '082' => 'Самостоятельный дом',
            '083' => 'До 10 гостей',
            '084' => 'Свой вход и личное пространство',
            '085' => 'Веранда и территория',
            '086' => 'Своя веранда и мангальная зона',
            '087' => 'Парковка на территории',
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
                $items = $data['texts'] ?? [];
                $found = [];
                foreach ($items as &$item) {
                    $itemKey = $item['key'] ?? '';
                    if (array_key_exists($itemKey, $texts)) {
                        $item['value'] = $texts[$itemKey];
                        $found[$itemKey] = true;
                    }
                }
                unset($item);

                foreach ($texts as $itemKey => $value) {
                    if (! isset($found[$itemKey])) {
                        $items[] = ['key' => $itemKey, 'value' => $value];
                    }
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
};
