<?php

namespace App\Support;

use App\Models\ContentEntry;
use Illuminate\Support\Collection;

/** Explicit mapping from rendered text identifiers to CMS fields. No client-supplied paths. */
final class VisualEditorContent
{
    public static function fields(ContentEntry $entry): array
    {
        $fields = [];
        if ($entry->kind === 'section') {
            foreach ($entry->draft['texts'] ?? [] as $index => $text) {
                $fields[$entry->key.'.'.$text['key']] = 'texts.'.$index.'.value';
            }
        }
        if ($entry->kind === 'page' && $entry->key === 'home') {
            $fields['landing.002'] = 'seo.h1';
        }
        $plainFields = match ($entry->kind) {
            'house' => ['name', 'title', 'description', 'feature', 'guests'],
            'service' => ['title', 'description', 'detail'],
            'faq' => ['title', 'description'],
            default => [],
        };
        foreach ($plainFields as $field) $fields['field:'.$entry->key.':'.$field] = $field;
        if ($entry->key === 'comforts') {
            foreach ($entry->draft['items'] ?? [] as $index => $item) {
                foreach (['title', 'text'] as $field) $fields['field:comforts:'.$index.':'.$field] = 'items.'.$index.'.'.$field;
            }
        }
        return $fields;
    }

    public static function entries(): Collection
    {
        return ContentEntry::whereNotNull('published')->orderBy('position')->orderBy('id')->get();
    }

    public static function catalog(): array
    {
        $result = [];
        foreach (self::entries() as $entry) {
            foreach (self::fields($entry) as $key => $path) {
                // The H1 belongs to page SEO, even if an older section has that key.
                if ($key === 'landing.002' && $entry->key !== 'home') {
                    continue;
                }
                $result[$key] = ['entry' => $entry->id, 'key' => $key, 'path' => $path,
                    'label' => $entry->name, 'value' => (string) data_get($entry->draft, $path, '')];
            }
        }
        return $result;
    }

    public static function revision(ContentEntry $entry): string
    {
        return hash('sha256', json_encode([$entry->draft, $entry->published], JSON_THROW_ON_ERROR));
    }
}
