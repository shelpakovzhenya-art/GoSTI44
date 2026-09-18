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
            $entry = DB::table('content_entries')->where('key', 'home')->lockForUpdate()->first();
            if (! $entry) {
                return;
            }

            $changes = [];
            foreach (['draft', 'published'] as $column) {
                if ($entry->{$column} === null) {
                    continue;
                }

                $data = json_decode($entry->{$column}, true, flags: JSON_THROW_ON_ERROR);
                $data['seo'] ??= [];
                $data['seo']['h1'] = 'Три просторных';

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
        // Published SEO copy stays editable and is not overwritten on rollback.
    }
};
