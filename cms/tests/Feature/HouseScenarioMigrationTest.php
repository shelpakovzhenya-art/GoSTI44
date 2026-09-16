<?php

namespace Tests\Feature;

use App\Models\ContentEntry;
use Database\Seeders\SiteContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HouseScenarioMigrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_scenarios_are_published_without_removing_house_details(): void
    {
        $this->seed(SiteContentSeeder::class);

        $migration = require database_path('migrations/2026_09_16_120000_refine_house_selection_scenarios.php');
        $migration->up();

        $landing = ContentEntry::query()->where('key', 'landing')->firstOrFail();
        $lime = ContentEntry::query()->where('key', 'lime')->firstOrFail();
        $lemon = ContentEntry::query()->where('key', 'lemon')->firstOrFail();
        $citrus = ContentEntry::query()->where('key', 'citrus')->firstOrFail();

        $this->assertSame('Какой дом подойдёт именно вам?', $this->text($landing->published, '030'));
        $this->assertSame('Для семьи с детьми', $lime->published['label']);
        $this->assertSame('Собственная баня', $lime->published['feature']);
        $this->assertContains('Собственная баня', $lime->published['amenities']);
        $this->assertSame('Для большой семьи', $lemon->published['label']);
        $this->assertSame('Для компании', $citrus->published['label']);
        $this->assertNotEmpty($citrus->published['images']);
    }

    private function text(array $data, string $key): string
    {
        return collect($data['texts'])->firstWhere('key', $key)['value'];
    }
}
