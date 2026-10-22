<?php

namespace Tests\Feature;

use App\Models\ContentEntry;
use App\Support\ContentValidator;
use Database\Seeders\SiteContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WordstatGuidePagesMigrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_wordstat_guides_are_published_with_distinct_intents(): void
    {
        $this->seed(SiteContentSeeder::class);
        $migration = require database_path('migrations/2026_09_16_223000_add_wordstat_guide_pages.php');
        $migration->up();

        $keys = [
            'kostroma',
            'kostroma/gde-poest',
            'kostroma/dostoprimechatelnosti',
            'kostroma/muzei',
            'kostroma/za-odin-den',
            'kostroma/s-detmi',
            'kostroma/chto-privezti',
        ];

        foreach ($keys as $key) {
            $page = ContentEntry::where('key', $key)->firstOrFail();
            $this->assertSame('guide', $page->published['template']);
            $this->assertNotEmpty($page->published['guideItems']);
            $this->assertNotEmpty($page->published['seo']['title']);
            $this->assertNotEmpty($page->published['seo']['description']);
            $this->assertNotEmpty($page->published['seo']['h1']);
            ContentValidator::validate('page', $page->published, $key);
        }

        $hubLinks = array_column(ContentEntry::where('key', 'kostroma')->firstOrFail()->published['guideItems'], 'href');
        foreach (array_slice($keys, 1) as $key) {
            $this->assertContains('/'.$key, $hubLinks);
        }

        $sights = ContentEntry::where('key', 'kostroma/dostoprimechatelnosti')->firstOrFail()->published;
        $oneDay = ContentEntry::where('key', 'kostroma/za-odin-den')->firstOrFail()->published;
        $this->assertStringNotContainsString('за один', mb_strtolower($sights['seo']['h1']));
        $this->assertStringContainsString('за один день', mb_strtolower($oneDay['seo']['h1']));
        $this->assertStringContainsString('рестораны', mb_strtolower(ContentEntry::where('key', 'kostroma/gde-poest')->firstOrFail()->published['seo']['title']));
    }
}
