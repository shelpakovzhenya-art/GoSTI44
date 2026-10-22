<?php

namespace Tests\Feature;

use App\Models\ContentEntry;
use Database\Seeders\SiteContentSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class HouseLandingPagesMigrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_house_and_company_landings_are_published_with_client_copy(): void
    {
        $this->seed(SiteContentSeeder::class);

        foreach (['landing' => ['002' => 'ТАНЖЕРИН', '003' => 'Место, где Вы дома'], 'navigation' => ['002' => 'Кухня и веранда у каждого таунхауса']] as $key => $staleTexts) {
            $entry = ContentEntry::where('key', $key)->firstOrFail();
            $data = $entry->published;
            foreach ($data['texts'] as &$item) {
                if (isset($staleTexts[$item['key']])) {
                    $item['value'] = $staleTexts[$item['key']];
                }
            }
            unset($item);
            $entry->forceFill(['draft' => $data, 'published' => $data])->save();
        }

        $migration = require database_path('migrations/2026_09_16_180000_create_house_landing_pages.php');
        $migration->up();

        $this->assertSame('house', ContentEntry::where('key', 'doma/laym')->firstOrFail()->published['template']);
        $this->assertSame('lemon', ContentEntry::where('key', 'doma/limon')->firstOrFail()->published['houseKey']);
        $this->assertSame('citrus', ContentEntry::where('key', 'doma/citrus')->firstOrFail()->published['houseKey']);
        $company = ContentEntry::where('key', 'dlya-bolshoy-kompanii')->firstOrFail();
        $this->assertSame('company', $company->published['template']);
        $this->assertStringContainsString('До 25 гостей', collect($company->published['texts'])->firstWhere('key', 'heroTitle')['value']);

        $landing = ContentEntry::where('key', 'landing')->firstOrFail();
        $texts = collect($landing->published['texts'])->pluck('value', 'key');
        $this->assertSame('Один большой дом', $texts['002']);
        $this->assertSame('Кострома · Октябрьская улица, 45', $texts['014']);

        $navigation = ContentEntry::where('key', 'navigation')->firstOrFail();
        $navigationTexts = collect($navigation->published['texts'])->pluck('value', 'key');
        $this->assertSame('Кухня и веранда у каждого дома', $navigationTexts['002']);

        $menu = ContentEntry::where('key', 'main-menu')->firstOrFail();
        $this->assertSame('Дома', $menu->published['buttons'][0]['label']);
        $this->assertSame('/dlya-bolshoy-kompanii', $menu->published['buttons'][1]['href']);
    }
}
