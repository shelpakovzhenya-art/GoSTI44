<?php

namespace App\Http\Controllers;

use App\Models\ContentEntry;
use App\Support\ContentValidator;
use Illuminate\Http\JsonResponse;

class PreviewContentController extends Controller
{
    public function __invoke(ContentEntry $entry): JsonResponse
    {
        ContentValidator::validate($entry->kind, $entry->draft, $entry->key);
        $entries = ContentEntry::whereNotNull('published')->orWhere('id', $entry->id)->orderBy('position')->orderBy('id')->get()->map(fn ($item) => ['key' => $item->key, 'kind' => $item->kind, 'data' => $item->id === $entry->id ? $entry->draft : $item->published])->values();

        return response()->json(['version' => 1, 'target' => $entry->key, 'kind' => $entry->kind, 'entries' => $entries])->header('Cache-Control', 'private, no-store')->header('X-Robots-Tag', 'noindex');
    }
}
