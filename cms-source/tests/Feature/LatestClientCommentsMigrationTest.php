<?php

namespace Tests\Feature;

use App\Models\ContentEntry;
use Database\Seeders\SiteContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LatestClientCommentsMigrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guides_bath_and_house_wording_are_published(): void
    {
        $this->seed(SiteContentSeeder::class);
        $migration = require database_path('migrations/2026_09_16_210000_apply_latest_client_comments.php');
        $migration->up();

        foreach (['kostroma', 'kostroma/gde-poest', 'kostroma/dostoprimechatelnosti'] as $key) {
            $page = ContentEntry::where('key', $key)->firstOrFail();
            $this->assertSame('guide', $page->published['template']);
            $this->assertNotEmpty($page->published['guideItems']);
        }

        $bath = ContentEntry::where('key', 'service-bath')->firstOrFail();
        $this->assertSame('bath', $bath->published['className']);
        $this->assertStringContainsString('Баня', $bath->published['title']);
        $this->assertSame(
            ['service-breakfast', 'service-barbecue', 'service-bath', 'service-children', 'service-comfort'],
            ContentEntry::where('kind', 'service')->orderBy('position')->pluck('key')->all()
        );

        $menu = ContentEntry::where('key', 'main-menu')->firstOrFail()->published['buttons'];
        $this->assertContains(['label' => 'Кострома', 'href' => '/kostroma'], $menu);
        $this->assertNotContains('#spa', array_column($menu, 'href'));

        ContentEntry::whereNotNull('published')->each(function (ContentEntry $entry): void {
            $json = json_encode($entry->published, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            $this->assertDoesNotMatchRegularExpression('/таунхаус/iu', $json, $entry->key);
            $this->assertDoesNotMatchRegularExpression('/SPA|СПА/u', $json, $entry->key);
        });
    }
}
