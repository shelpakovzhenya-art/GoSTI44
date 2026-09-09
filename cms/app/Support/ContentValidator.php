<?php

namespace App\Support;

use App\Models\ContentEntry;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

final class ContentValidator
{
    public static function validate(string $kind, array $data, string $key = ''): void
    {
        $rules = ['title' => 'nullable|string|max:250', 'description' => 'nullable|string', 'body' => 'nullable|string', 'images' => 'nullable|array', 'images.*.src' => ['required', 'string', 'regex:/^\/(images|brand|storage)\/[a-zA-Z0-9_\-.\/]+$/'], 'images.*.alt' => 'nullable|string|max:250'];
        if ($kind === 'house') {
            $rules = array_merge($rules, [
                'name' => 'required|string|max:100', 'title' => 'required|string|max:250', 'description' => 'required|string',
                'area' => 'required|numeric|min:1', 'guests' => 'required|string', 'bedrooms' => 'required|integer|min:0', 'bathrooms' => 'required|integer|min:0',
                'areaApproximate' => 'nullable|boolean',
                'tone' => 'required|in:lime,lemon,citrus', 'images' => 'required|array|min:1', 'amenities' => 'required|array', 'amenities.*' => 'string',
            ]);
        }
        if ($kind === 'rating') {
            $rules = array_merge($rules, ['id' => 'required|string', 'name' => 'required|string', 'rating' => ['required', 'regex:/^[0-5]([,.][0-9])?$/'], 'count' => 'required|string', 'url' => 'required|url:http,https', 'logo' => ['required', 'regex:/^\/(images|storage)\/[a-zA-Z0-9_\-.\/]+$/']]);
        }
        if ($kind === 'review') {
            $rules = array_merge($rules, ['name' => 'required|string', 'quote' => 'required|string', 'date' => 'required|string', 'initials' => 'required|string']);
        }
        if ($kind === 'faq') {
            $rules = array_merge($rules, ['title' => 'required|string', 'description' => 'required|string']);
        }
        Validator::make($data, $rules)->validate();
        if ($kind === 'page' && preg_match('~^(admin|api|preview|editor-preview|_next|storage|images|brand)(/|$)~', $key)) {
            throw ValidationException::withMessages(['key' => 'Этот путь зарезервирован приложением.']);
        }
        if ($kind === 'redirect') {
            $next = $data['destination'] ?? '';
            $visited = ['/'.$key];
            for ($i = 0; $i < 20; $i++) {
                if (! is_string($next) || ! preg_match('~^/(?!/)[^<>]*$~', $next)) {
                    throw ValidationException::withMessages(['draft.destination' => 'Нужен внутренний путь, начинающийся с /.']);
                }
                $path = parse_url($next, PHP_URL_PATH);
                if (in_array($path, $visited, true)) {
                    throw ValidationException::withMessages(['draft.destination' => 'Перенаправление создаёт цикл.']);
                }
                $visited[] = $path;
                $following = ContentEntry::where('kind', 'redirect')->where('key', ltrim($path, '/'))->whereNotNull('published')->first();
                if (! $following) {
                    break;
                }
                $next = $following->published['destination'] ?? '';
                if ($i === 19) {
                    throw ValidationException::withMessages(['draft.destination' => 'Слишком длинная цепочка перенаправлений.']);
                }
            }
        }
        foreach ($data['fields'] ?? [] as $field) {
            $key = $field['key'] ?? '';
            $value = $field['value'] ?? '';
            if (in_array($key, ['telegram', 'vk', 'route', 'booking', 'yandex', 'gis', 'google', 'reviewWidget', 'mapWidget'], true)) {
                Validator::make(['link' => $value], ['link' => 'required|url:https'])->validate();
            }
            if ($key === 'phoneHref') {
                Validator::make(['phone' => $value], ['phone' => ['required', 'regex:/^tel:\+?[0-9 ()-]+$/']])->validate();
            }
        }
    }
}
