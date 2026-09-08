<?php

namespace Database\Seeders;

use App\Models\ContentEntry;
use Illuminate\Database\Seeder;

class SiteContentSeeder extends Seeder
{
    public function run(): void
    {
        $root = dirname(base_path()).'/content/';
        $site = json_decode(file_get_contents($root.'site.json'), true, flags: JSON_THROW_ON_ERROR);
        $sections = json_decode(file_get_contents($root.'sections.json'), true, flags: JSON_THROW_ON_ERROR);
        $collections = json_decode(file_get_contents($root.'collections.json'), true, flags: JSON_THROW_ON_ERROR);
        foreach ($collections['services'] as $index => $service) {
            $this->entry('service', 'service-'.$service['className'], $service['title'], ['title' => $service['title'], 'description' => $service['text'], 'detail' => $service['detail'], 'icon' => $service['icon'], 'className' => $service['className']], $index);
        }
        $this->entry('section', 'comforts', 'Удобства в каждом доме', ['items' => $collections['comforts']]);
        $this->entry('section', 'photo-gallery', 'Фотогалерея: состав и порядок фото', ['images' => $collections['photos']]);
        $this->entry('menu', 'main-menu', 'Главное меню', ['buttons' => array_map(fn ($link) => ['label' => $link[0], 'href' => '#'.$link[1]], $collections['links'])]);
        foreach ($sections as $section) {
            $this->entry($section['kind'], $section['key'], $section['name'], $section['draft']);
        }
        foreach ($site['houses'] as $index => $house) {
            $this->entry('house', $house['id'], $house['name'], $house, $index);
        }
        foreach ($site['rules'] as $index => $rule) {
            $this->entry('faq', 'faq-'.($index + 1), $rule['title'], ['title' => $rule['title'], 'description' => $rule['text']], $index);
        }
        foreach ($site['ratings'] as $index => $rating) {
            $this->entry('rating', 'rating-'.$rating['id'], $rating['name'], $rating, $index);
        }
        foreach ($site['reviewExcerpts'] as $index => $review) {
            $this->entry('review', 'review-'.($index + 1), $review['name'], $review, $index);
        }
        $fields = [];
        foreach ($site['site'] as $key => $value) {
            $fields[] = ['key' => $key, 'value' => $value];
        }
        $this->entry('settings', 'site-settings', 'Контакты и домен', ['fields' => $fields, 'origin' => '', 'indexable' => false]);
        $images = [];
        foreach (glob(dirname(base_path()).'/public/images/*') as $file) {
            if (! in_array(strtolower(pathinfo($file, PATHINFO_EXTENSION)), ['jpg', 'jpeg', 'png', 'webp'])) {
                continue;
            }
            $path = '/images/'.basename($file);
            $images[] = ['key' => $path, 'src' => $path, 'alt' => ''];
        }
        $this->entry('section', 'site-images', 'Фотографии на сайте: замена во всех блоках', ['images' => $images]);
        $this->entry('page', 'home', 'Главная страница', ['seo' => [
            'title' => 'Танжерин — гостевые дома в Костроме с кухней и верандой',
            'description' => 'Три отдельных дома в Костроме для семьи или компании до 25 гостей. Кухня, веранда, мангал и парковка. Баня в доме «Лайм». Фотографии, свободные даты и бронирование.',
            'h1' => 'ТАНЖЕРИН', 'noindex' => false,
        ]]);
    }

    private function entry(string $kind, string $key, string $name, array $data, int $position = 0): void
    {
        if (ContentEntry::where('key', $key)->exists()) {
            return;
        }
        $entry = ContentEntry::create(['kind' => $kind, 'key' => $key, 'name' => $name, 'draft' => $data, 'position' => $position]);
        $entry->publish();
    }
}
