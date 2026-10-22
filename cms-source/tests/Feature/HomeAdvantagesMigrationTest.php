<?php

namespace Tests\Feature;

use App\Models\ContentEntry;
use Database\Seeders\SiteContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HomeAdvantagesMigrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_reference_advantages_are_published_as_three_compact_items(): void
    {
        $this->seed(SiteContentSeeder::class);
        $migration = require database_path('migrations/2026_09_21_180000_fix_max_icon_and_compact_home_advantages.php');
        $migration->up();

        $comforts = ContentEntry::where('key', 'comforts')->firstOrFail()->published['items'];

        $this->assertCount(3, $comforts);
        $this->assertSame(['BedDouble', 'Utensils', 'Moon'], array_column($comforts, 'icon'));
        $this->assertSame('Больше личного пространства', $comforts[0]['title']);
        $this->assertSame('Несколько кухонь и санузлов', $comforts[1]['title']);
        $this->assertSame('Можно отдыхать в разном ритме', $comforts[2]['title']);

        $texts = collect(ContentEntry::where('key', 'holiday-sections')->firstOrFail()->published['texts'])
            ->pluck('value', 'key');

        $this->assertSame('ПОЧЕМУ ТРИ ДОМА', $texts['001']);
        $this->assertSame('Почему три гостевых дома удобнее одного большого дома', $texts['002']);
    }
}
