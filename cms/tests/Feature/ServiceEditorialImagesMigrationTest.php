<?php

namespace Tests\Feature;

use App\Models\ContentEntry;
use App\Support\ContentValidator;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

class ServiceEditorialImagesMigrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_service_photographs_are_added_without_overwriting_editorial_fields(): void
    {
        $expected = [
            'service-breakfast' => '/images/family.jpg',
            'service-barbecue' => '/images/veranda.jpg',
            'service-children' => '/images/family-bedroom.jpg',
            'service-comfort' => '/images/lux-living.jpg',
        ];

        foreach (array_keys($expected) as $position => $key) {
            $entry = ContentEntry::create([
                'kind' => 'service',
                'key' => $key,
                'name' => $key,
                'position' => $position,
                'draft' => $this->serviceData('Черновик '.$key),
            ]);
            $entry->published = $this->serviceData('Публикация '.$key);
            $entry->published_at = now()->subDay();
            $entry->save();
        }

        $revisionCount = DB::table('content_revisions')->count();
        $migration = require database_path('migrations/2026_09_14_130000_add_service_editorial_images.php');
        $migration->up();

        foreach ($expected as $key => $src) {
            $entry = ContentEntry::query()->where('key', $key)->firstOrFail();
            $this->assertSame('Черновик '.$key, $entry->draft['title']);
            $this->assertSame('Публикация '.$key, $entry->published['title']);
            $this->assertSame($src, $entry->draft['images'][0]['src']);
            $this->assertSame($src, $entry->published['images'][0]['src']);
            $this->assertNotEmpty($entry->published['images'][0]['alt']);
        }

        $this->assertSame($revisionCount + 8, DB::table('content_revisions')->count());
    }

    public function test_service_requires_a_complete_editorial_photograph(): void
    {
        $data = $this->serviceData('Услуга');
        $data['images'] = [['src' => '/images/family.jpg', 'alt' => 'Кухня таунхауса']];
        ContentValidator::validate('service', $data, 'service-test');
        $this->addToAssertionCount(1);

        $data['images'][0]['alt'] = '';
        $this->expectException(ValidationException::class);
        ContentValidator::validate('service', $data, 'service-test');
    }

    private function serviceData(string $title): array
    {
        return [
            'title' => $title,
            'description' => 'Краткое описание',
            'detail' => 'Подробности',
            'icon' => 'Leaf',
            'className' => 'comfort',
        ];
    }
}
