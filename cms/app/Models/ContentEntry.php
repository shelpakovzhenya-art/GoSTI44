<?php

namespace App\Models;

use App\Support\ContentSanitizer;
use App\Support\ContentValidator;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\DB;

class ContentEntry extends Model
{
    protected $fillable = ['kind', 'key', 'name', 'draft', 'position'];

    protected function casts(): array
    {
        return ['draft' => 'array', 'published' => 'array', 'published_at' => 'datetime'];
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(ContentRevision::class)->latest();
    }

    protected static function booted(): void
    {
        static::saving(function (self $entry) {
            $entry->draft = ContentSanitizer::clean($entry->draft ?? []);
        });
        static::saved(function (self $entry) {
            if ($entry->wasChanged('draft') || $entry->wasRecentlyCreated) {
                $entry->revisions()->create(['user_id' => auth()->id(), 'action' => 'draft', 'data' => $entry->draft]);
            }
        });
    }

    public function publish(): void
    {
        DB::transaction(function () {
            $entry = self::query()->lockForUpdate()->findOrFail($this->id);
            ContentValidator::validate($entry->kind, $entry->draft, $entry->key);
            $entry->published = $entry->draft;
            $entry->published_at = now();
            $entry->save();
            $entry->revisions()->create(['user_id' => auth()->id(), 'action' => 'publish', 'data' => $entry->draft]);
        });
        $this->refresh();
    }

    public function restoreRevision(int $revisionId): void
    {
        $revision = $this->revisions()->findOrFail($revisionId);
        $this->update(['draft' => $revision->data]);
    }
}
