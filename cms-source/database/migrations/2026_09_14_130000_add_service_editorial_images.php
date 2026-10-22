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

        $images = [
            'service-breakfast' => ['/images/family.jpg', 'Кухня-столовая таунхауса «Лайм»'],
            'service-barbecue' => ['/images/veranda.jpg', 'Крытая веранда таунхауса со столом и местами для отдыха'],
            'service-children' => ['/images/family-bedroom.jpg', 'Спальня таунхауса «Лайм»'],
            'service-comfort' => ['/images/lux-living.jpg', 'Гостиная таунхауса «Цитрус»'],
        ];

        foreach ($images as $key => [$src, $alt]) {
            $this->patchService($key, $src, $alt);
        }
    }

    public function down(): void
    {
        // Editors may replace these photographs after deployment; rollback must not discard their work.
    }

    private function patchService(string $key, string $src, string $alt): void
    {
        DB::transaction(function () use ($key, $src, $alt): void {
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
                $data['images'] = [['src' => $src, 'alt' => $alt]];
                ContentValidator::validate('service', $data, $key);
                $encoded = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);

                if ($encoded === $entry->{$column}) {
                    continue;
                }

                $changes[$column] = $encoded;
                DB::table('content_revisions')->insert([
                    'content_entry_id' => $entry->id,
                    'user_id' => null,
                    'action' => $column === 'draft' ? 'draft' : 'publish',
                    'data' => $encoded,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
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
};
