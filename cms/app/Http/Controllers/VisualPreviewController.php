<?php

namespace App\Http\Controllers;

use App\Support\VisualEditorContent;
use Illuminate\Http\Request;

class VisualPreviewController extends Controller
{
    public function __invoke(Request $request)
    {
        $entries = VisualEditorContent::entries()->map(function ($entry) {
            $data = $entry->published;
            foreach (VisualEditorContent::fields($entry) as $path) data_set($data, $path, data_get($entry->draft, $path, ''));
            return ['key' => $entry->key, 'kind' => $entry->kind, 'data' => $data];
        })->values();

        return response()->json(['version' => 1, 'entries' => $entries,
            'editorOrigin' => $request->query('origin'),
            'editableKeys' => array_keys(VisualEditorContent::catalog()),
            'editableValues' => array_map(fn ($field) => $field['value'], VisualEditorContent::catalog()),
        ])->header('Cache-Control', 'private, no-store')->header('X-Robots-Tag', 'noindex');
    }
}
