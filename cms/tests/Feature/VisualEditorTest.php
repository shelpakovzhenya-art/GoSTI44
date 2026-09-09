<?php

namespace Tests\Feature;

use App\Filament\Pages\VisualEditor;
use App\Models\ContentEntry;
use App\Models\User;
use Filament\Facades\Filament;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\URL;
use Livewire\Livewire;
use Tests\TestCase;

class VisualEditorTest extends TestCase
{
    use RefreshDatabase;

    private function entry(): ContentEntry
    {
        $entry = ContentEntry::create(['kind' => 'section', 'key' => 'landing', 'name' => 'Главная',
            'draft' => ['texts' => [['key' => '001', 'value' => 'Исходный текст']]]]);
        $entry->publish();
        return $entry;
    }

    private function editor(string $role = 'admin')
    {
        $this->actingAs(User::factory()->create(['role' => $role]));
        Filament::setCurrentPanel(Filament::getPanel('admin'));
        return Livewire::test(VisualEditor::class);
    }

    public function test_visual_editor_saves_draft_then_publishes_and_keeps_history(): void
    {
        $entry = $this->entry();
        $editor = $this->editor()->call('selectText', 'landing.001')->set('value', 'Новый текст')->call('saveDraft')->assertHasNoErrors();
        $this->assertSame('Новый текст', $entry->fresh()->draft['texts'][0]['value']);
        $this->assertSame('Исходный текст', $entry->fresh()->published['texts'][0]['value']);
        $editor->call('publishSelected')->assertHasNoErrors();
        $this->assertSame('Новый текст', $entry->fresh()->published['texts'][0]['value']);
        $this->assertSame(2, $entry->revisions()->where('action', 'publish')->count());
    }

    public function test_editor_cannot_publish_and_stale_changes_are_rejected(): void
    {
        $entry = $this->entry();
        $editor = $this->editor('editor')->call('selectText', 'landing.001');
        $editor->call('publishSelected')->assertForbidden();
        $admin = $this->editor()->call('selectText', 'landing.001');
        $entry->update(['draft' => ['texts' => [['key' => '001', 'value' => 'Другой редактор']]]]);
        $admin->set('value', 'Устаревшая правка')->call('saveDraft')->assertHasErrors('value');
        $this->assertSame('Другой редактор', $entry->fresh()->draft['texts'][0]['value']);
    }

    public function test_unsaved_text_cannot_be_lost_by_switching_or_publishing(): void
    {
        $this->entry();
        $this->editor()->call('selectText', 'landing.001')->set('value', 'Не сохранено')
            ->call('selectText', 'landing.001')->assertHasErrors('value')
            ->call('publishSelected')->assertHasErrors('value')
            ->call('discard')->assertSet('value', 'Исходный текст');
    }

    public function test_signed_visual_preview_and_home_heading_mapping(): void
    {
        $this->entry();
        $home = ContentEntry::create(['kind' => 'page', 'key' => 'home', 'name' => 'Главная SEO', 'draft' => ['seo' => ['h1' => 'Заголовок']]]);
        $home->publish();
        $this->editor()->call('selectText', 'landing.002')->set('value', 'Новый H1')->call('saveDraft')->assertHasNoErrors();
        $this->assertSame('Новый H1', $home->fresh()->draft['seo']['h1']);
        $this->getJson('/api/preview/editor')->assertForbidden();
        $url = URL::temporarySignedRoute('content.visual-preview', now()->addMinutes(15), ['origin' => 'https://example.com'], absolute: false);
        $this->getJson($url)->assertOk()->assertJsonPath('editorOrigin', 'https://example.com')->assertJsonFragment(['h1' => 'Новый H1']);
        $this->getJson($url.'&extra=1')->assertForbidden();
        $this->travel(16)->minutes();
        $this->getJson($url)->assertForbidden();
    }

    public function test_guests_and_inactive_users_cannot_open_editor(): void
    {
        $this->get('/admin/visual-editor')->assertRedirect();
        $this->actingAs(User::factory()->create(['active' => false]))->get('/admin/visual-editor')->assertForbidden();
    }
}
