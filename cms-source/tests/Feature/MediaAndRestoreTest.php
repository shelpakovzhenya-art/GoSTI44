<?php

namespace Tests\Feature;

use App\Filament\Resources\Media\Pages\CreateMedia;
use App\Models\Media;
use App\Models\User;
use Filament\Facades\Filament;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Livewire\Livewire;
use Tests\TestCase;
use ZipArchive;

class MediaAndRestoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_media_form_accepts_image_and_stores_it(): void
    {
        Storage::fake('public');
        $this->actingAs(User::factory()->create(['role' => 'admin']));
        Filament::setCurrentPanel(Filament::getPanel('admin'));
        Livewire::test(CreateMedia::class)->fillForm(['name' => 'Веранда', 'alt' => 'Стол на веранде', 'path' => UploadedFile::fake()->image('veranda.jpg', 600, 400)])->call('create')->assertHasNoFormErrors();
        $media = Media::firstOrFail();
        Storage::disk('public')->assertExists($media->path);
    }

    public function test_editor_cannot_open_user_management(): void
    {
        $this->actingAs(User::factory()->create(['role' => 'editor']))->get('/admin/users')->assertForbidden();
    }

    public function test_content_archive_restores_public_and_draft_versions(): void
    {
        $path = storage_path('framework/testing/restore-'.bin2hex(random_bytes(4)).'.zip');
        if (! is_dir(dirname($path))) {
            mkdir(dirname($path), 0775, true);
        }
        $zip = new ZipArchive;
        $zip->open($path, ZipArchive::CREATE);
        $zip->addFromString('content.json', json_encode(['version' => 1, 'entries' => [['kind' => 'page', 'key' => 'test-page', 'name' => 'Страница', 'draft' => ['title' => 'Черновик'], 'published' => ['title' => 'Публикация'], 'published_at' => now()->toDateTimeString(), 'position' => 0, 'revisions' => []]], 'media' => []]));
        $zip->close();
        $this->artisan('cms:import', ['path' => $path])->assertSuccessful();
        $this->getJson('/api/content')->assertJsonPath('entries.0.data.title', 'Публикация')->assertJsonMissing(['title' => 'Черновик']);
        $this->artisan('cms:import', ['path' => $path])->assertFailed();
    }
}
