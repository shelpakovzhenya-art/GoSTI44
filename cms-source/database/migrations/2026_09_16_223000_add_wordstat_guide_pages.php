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

        $pages = json_decode(file_get_contents(dirname(base_path()).'/content/pages.json'), true, flags: JSON_THROW_ON_ERROR);
        foreach ($pages as $position => $page) {
            if (($page['template'] ?? null) !== 'guide') {
                continue;
            }

            $key = $page['key'];
            $name = $page['name'];
            unset($page['key'], $page['name']);
            ContentValidator::validate('page', $page, $key);
            $this->upsertPage($key, $name, $page, $position + 1);
        }
    }

    public function down(): void
    {
        // Guide pages remain editable and are not removed on rollback.
    }

    private function upsertPage(string $key, string $name, array $data, int $position): void
    {
        $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
        DB::transaction(function () use ($key, $name, $json, $position): void {
            $entry = DB::table('content_entries')->where('key', $key)->lockForUpdate()->first();
            $now = now();

            if ($entry) {
                DB::table('content_entries')->where('id', $entry->id)->update([
                    'kind' => 'page',
                    'name' => $name,
                    'position' => $position,
                    'draft' => $json,
                    'published' => $json,
                    'published_at' => $now,
                    'updated_at' => $now,
                ]);
                $this->revision($entry->id, $json);
                return;
            }

            $id = DB::table('content_entries')->insertGetId([
                'kind' => 'page',
                'key' => $key,
                'name' => $name,
                'draft' => $json,
                'published' => $json,
                'position' => $position,
                'published_at' => $now,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
            $this->revision($id, $json);
        });
    }

    private function revision(int $entryId, string $json): void
    {
        DB::table('content_revisions')->insert([
            'content_entry_id' => $entryId,
            'user_id' => null,
            'action' => 'publish',
            'data' => $json,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
};
