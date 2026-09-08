<?php

namespace App\Http\Controllers;

use App\Models\ContentEntry;
use Illuminate\Http\JsonResponse;

class PublishedContentController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $entries = ContentEntry::query()->whereNotNull('published')->orderBy('position')->get();

        return response()->json([
            'version' => 1,
            'entries' => $entries->map(fn ($entry) => [
                'key' => $entry->key,
                'kind' => $entry->kind,
                'data' => $entry->published,
                'updatedAt' => $entry->published_at?->toIso8601String(),
            ]),
        ])->header('Cache-Control', 'no-store')->header('X-Robots-Tag', 'noindex');
    }
}
