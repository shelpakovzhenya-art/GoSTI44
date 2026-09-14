<?php

namespace Tests\Feature;

use App\Models\ContentEntry;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ClientContentMigrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_client_review_updates_only_targeted_fields_in_draft_and_publication(): void
    {
        $landing = ContentEntry::create([
            'kind' => 'section',
            'key' => 'landing',
            'name' => 'Главная',
            'draft' => ['texts' => [
                ['key' => '004', 'value' => 'Старый заголовок'],
                ['key' => '999', 'value' => 'Новый черновик редактора'],
            ]],
        ]);
        $landing->published = ['texts' => [
            ['key' => '004', 'value' => 'Старый заголовок'],
            ['key' => '999', 'value' => 'Опубликованный текст'],
        ]];
        $landing->published_at = now()->subDay();
        $landing->save();

        $settings = ContentEntry::create([
            'kind' => 'settings',
            'key' => 'site-settings',
            'name' => 'Настройки',
            'draft' => ['fields' => [
                ['key' => 'address', 'value' => 'Старый адрес'],
                ['key' => 'phone', 'value' => 'Черновой телефон'],
                ['key' => 'google', 'value' => 'https://example.com/google-draft'],
            ]],
        ]);
        $settings->published = ['fields' => [
            ['key' => 'address', 'value' => 'Старый адрес'],
            ['key' => 'phone', 'value' => 'Опубликованный телефон'],
            ['key' => 'google', 'value' => 'https://example.com/google-published'],
        ]];
        $settings->published_at = now()->subDay();
        $settings->save();

        $yandex = $this->rating('rating-yandex', 'Яндекс Карты', 'yandex', 0);
        $gis = $this->rating('rating-gis', '2ГИС', 'gis', 1);
        $google = $this->rating('rating-google', 'Google Maps', 'google', 2);

        $migration = require database_path('migrations/2026_09_14_000000_apply_client_content_review.php');
        $migration->up();

        $landing->refresh();
        $this->assertSame('Один большой дом с тремя таунхаусами — для семей,', $this->text($landing->draft, '004'));
        $this->assertSame('Один большой дом с тремя таунхаусами — для семей,', $this->text($landing->published, '004'));
        $this->assertSame('Новый черновик редактора', $this->text($landing->draft, '999'));
        $this->assertSame('Опубликованный текст', $this->text($landing->published, '999'));

        $settings->refresh();
        $this->assertSame('Кострома, Октябрьская улица, 45', $this->field($settings->published, 'address'));
        $this->assertSame('Опубликованный телефон', $this->field($settings->published, 'phone'));
        $this->assertSame('Черновой телефон', $this->field($settings->draft, 'phone'));
        $this->assertFalse(collect($settings->draft['fields'])->contains('key', 'google'));
        $this->assertFalse(collect($settings->published['fields'])->contains('key', 'google'));
        $this->assertSame(
            'https://www.avito.ru/user/23247c55bfeed02f5abc30847c6ce191/profile?src=sharing',
            $this->field($settings->published, 'avito')
        );

        $avito = ContentEntry::query()->where('key', 'rating-avito')->firstOrFail();
        $this->assertSame('4,7', $avito->published['rating']);
        $this->assertSame('116 отзывов', $avito->published['count']);
        $this->assertSame('/images/avito-logo.svg', $avito->published['logo']);
        $this->assertSame(0, $avito->position);
        $this->assertSame(1, $yandex->fresh()->position);
        $this->assertSame(2, $gis->fresh()->position);
        $this->assertNull($google->fresh()->published);
        $this->assertNotNull($google->fresh()->draft);
    }

    private function rating(string $key, string $name, string $id, int $position): ContentEntry
    {
        $entry = ContentEntry::create([
            'kind' => 'rating',
            'key' => $key,
            'name' => $name,
            'position' => $position,
            'draft' => [
                'id' => $id,
                'name' => $name,
                'rating' => '5,0',
                'count' => 'Старые данные',
                'logo' => '/images/'.$id.'-logo.png',
                'url' => 'https://example.com/'.$id,
            ],
        ]);
        $entry->published = $entry->draft;
        $entry->published_at = now()->subDay();
        $entry->save();

        return $entry;
    }

    private function text(array $data, string $key): string
    {
        return collect($data['texts'])->firstWhere('key', $key)['value'];
    }

    private function field(array $data, string $key): string
    {
        return collect($data['fields'])->firstWhere('key', $key)['value'];
    }
}
