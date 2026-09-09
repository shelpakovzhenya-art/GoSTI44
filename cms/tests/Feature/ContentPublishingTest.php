<?php

namespace Tests\Feature;

use App\Models\ContentEntry;
use App\Models\User;
use Filament\Panel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Tests\TestCase;

class ContentPublishingTest extends TestCase
{
    use RefreshDatabase;

    public function test_preview_requires_valid_unexpired_signature(): void
    {
        $entry = ContentEntry::create(['kind' => 'page', 'key' => 'home', 'name' => 'Главная', 'draft' => ['title' => 'Секретный черновик']]);
        $this->getJson('/api/preview/'.$entry->id)->assertForbidden();
        $url = URL::temporarySignedRoute('content.preview', now()->addMinutes(15), ['entry' => $entry->id], absolute: false);
        $this->getJson($url)->assertOk()->assertJsonPath('entries.0.data.title', 'Секретный черновик');
        $this->travel(16)->minutes();
        $this->getJson($url)->assertForbidden();
    }

    public function test_drafts_never_leak_and_restore_does_not_publish(): void
    {
        $entry = ContentEntry::create(['kind' => 'page', 'key' => 'home', 'name' => 'Главная', 'draft' => ['title' => 'Первая']]);
        $this->getJson('/api/content')->assertOk()->assertJsonCount(0, 'entries');
        $entry->publish();
        $revision = $entry->revisions()->where('action', 'publish')->first();
        $entry->update(['draft' => ['title' => 'Вторая']]);
        $this->getJson('/api/content')->assertJsonPath('entries.0.data.title', 'Первая')->assertJsonMissing(['title' => 'Вторая']);
        $entry->publish();
        $entry->restoreRevision($revision->id);
        $this->assertSame('Первая', $entry->draft['title']);
        $this->getJson('/api/content')->assertJsonPath('entries.0.data.title', 'Вторая');
    }

    public function test_editor_cannot_publish_and_disabled_account_cannot_enter(): void
    {
        $editor = User::factory()->create(['role' => 'editor']);
        $entry = ContentEntry::create(['kind' => 'page', 'key' => 'home', 'name' => 'Главная', 'draft' => []]);
        $this->assertFalse(Gate::forUser($editor)->allows('publish', $entry));
        $publisher = User::factory()->create(['role' => 'publisher']);
        $this->assertTrue(Gate::forUser($publisher)->allows('publish', $entry));
        $publisher->active = false;
        $this->assertFalse($publisher->canAccessPanel(Panel::make()));
    }

    public function test_html_scripts_and_unsafe_links_are_removed(): void
    {
        $entry = ContentEntry::create(['kind' => 'page', 'key' => 'home', 'name' => 'Главная', 'draft' => ['body' => '<p>Текст <strong>дома</strong></p><script>alert(1)</script><a href="javascript:alert(1)" onclick="alert(1)">ссылка</a>']]);
        $html = $entry->draft['body'];
        $this->assertStringNotContainsString('<script', $html);
        $this->assertStringNotContainsString('javascript:', $html);
        $this->assertStringNotContainsString('onclick', $html);
        $this->assertStringContainsString('<strong>дома</strong>', $html);
    }

    public function test_admin_alias_authenticates_through_filament_and_rejects_wrong_password(): void
    {
        $panel = \Filament\Facades\Filament::getPanel('admin');
        \Filament\Facades\Filament::setCurrentPanel($panel);
        \Filament\Facades\Filament::bootCurrentPanel();
        config(['auth.login_aliases' => ['admin' => 'operator@example.test']]);
        $user = User::factory()->create(['email' => 'operator@example.test', 'role' => 'admin', 'password' => 'test-only-password']);

        \Livewire\Livewire::test(\App\Providers\Filament\CmsLogin::class)
            ->fillForm(['email' => 'admin', 'password' => 'wrong-password'])
            ->call('authenticate')
            ->assertHasFormErrors(['email']);
        $this->assertGuest();

        \Livewire\Livewire::test(\App\Providers\Filament\CmsLogin::class)
            ->fillForm(['email' => 'admin', 'password' => 'test-only-password'])
            ->call('authenticate')
            ->assertHasNoFormErrors();
        $this->assertAuthenticatedAs($user);
    }
}
