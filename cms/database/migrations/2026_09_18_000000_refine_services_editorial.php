<?php

use App\Support\ContentValidator;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('content_entries') || ! DB::table('content_entries')->where('key', 'holiday-sections')->exists()) {
            return;
        }

        $this->patchTextEntry('holiday-sections', [
            '040' => 'После бронирования можно заранее согласовать завтрак, мангал,',
            '041' => 'детские вещи и другие детали поездки. Баня находится в доме «Лайм».',
        ]);

        $collections = json_decode(file_get_contents(dirname(base_path()).'/content/collections.json'), true, flags: JSON_THROW_ON_ERROR);
        $keys = [
            'breakfast' => 'service-breakfast',
            'barbecue' => 'service-barbecue',
            'bath' => 'service-bath',
            'children' => 'service-children',
            'comfort' => 'service-comfort',
        ];

        foreach ($collections['services'] as $service) {
            $key = $keys[$service['className']] ?? null;
            if ($key === null) {
                continue;
            }
            $this->patchEntry($key, fn (array $data): array => array_replace($data, [
                'title' => $service['title'],
                'description' => $service['text'],
                'detail' => $service['detail'],
            ]), $service['title']);
        }
    }

    public function down(): void
    {
        // Published copy remains editable in CMS and is not overwritten on rollback.
    }

    private function patchTextEntry(string $key, array $texts): void
    {
        $this->patchEntry($key, function (array $data) use ($texts): array {
            foreach ($data['texts'] ?? [] as &$item) {
                if (array_key_exists($item['key'] ?? '', $texts)) {
                    $item['value'] = $texts[$item['key']];
                }
            }
            unset($item);

            return $data;
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

            if ($name !== null && $name !== $entry->name) {
                $changes['name'] = $name;
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
