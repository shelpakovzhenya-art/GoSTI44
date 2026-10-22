<?php

namespace App\Filament\Pages;

use App\Models\ContentEntry;
use App\Support\VisualEditorContent;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\ValidationException;
use Livewire\Attributes\Locked;

class VisualEditor extends Page
{
    protected static ?string $navigationLabel = 'Визуальный редактор';
    protected static ?string $title = 'Визуальный редактор главной';
    protected static ?int $navigationSort = -10;
    protected string $view = 'filament.pages.visual-editor';

    #[Locked] public string $previewUrl = '';
    #[Locked] public string $previewOrigin = '';
    #[Locked] public ?string $selectedKey = null;
    #[Locked] public string $revision = '';
    #[Locked] public string $savedValue = '';
    public string $value = '';

    public static function canAccess(): bool
    {
        return auth()->user()?->active === true;
    }

    public function mount(): void
    {
        $this->refreshPreview();
    }

    public function refreshPreview(): void
    {
        abort_unless(self::canAccess(), 403);
        if ($this->value !== $this->savedValue) {
            throw ValidationException::withMessages(['value' => 'Перед обновлением сохраните или отмените правку.']);
        }
        $signed = URL::temporarySignedRoute('content.visual-preview', now()->addMinutes(15),
            ['origin' => request()->getSchemeAndHttpHost()], absolute: false);
        $frontend = rtrim(config('cms.frontend_url'), '/');
        $this->previewUrl = $frontend.'/editor-preview?'.parse_url($signed, PHP_URL_QUERY);
        $this->previewOrigin = preg_replace('~^(https?://[^/]+).*$~', '$1', $frontend);
    }

    public function selectText(string $key): void
    {
        if ($this->value !== $this->savedValue) {
            throw ValidationException::withMessages(['value' => 'Сохраните или отмените текущую правку перед выбором другого текста.']);
        }
        $field = VisualEditorContent::catalog()[$key] ?? null;
        abort_unless($field, 404);
        $entry = ContentEntry::findOrFail($field['entry']);
        Gate::authorize('update', $entry);
        $this->selectedKey = $key;
        $this->revision = VisualEditorContent::revision($entry);
        $this->value = $this->savedValue = (string) data_get($entry->draft, $field['path'], '');
        $this->resetValidation();
        $this->dispatch('visual-text', key: $key, value: $this->value);
    }

    public function discard(): void
    {
        $this->value = $this->savedValue;
        $this->resetValidation();
        if ($this->selectedKey) $this->dispatch('visual-text', key: $this->selectedKey, value: $this->value);
    }

    public function saveDraft(): void
    {
        $this->validate(['value' => 'required|string|max:10000']);
        $this->mutate(false);
        Notification::make()->title('Черновик сохранён. Сайт для гостей не изменён.')->success()->send();
    }

    public function publishSelected(): void
    {
        if ($this->value !== $this->savedValue) {
            throw ValidationException::withMessages(['value' => 'Сначала сохраните черновик.']);
        }
        $this->mutate(true);
        Notification::make()->title('Блок опубликован на сайте')->success()->send();
    }

    private function mutate(bool $publish): void
    {
        $field = VisualEditorContent::catalog()[$this->selectedKey ?? ''] ?? null;
        abort_unless($field, 404);
        DB::transaction(function () use ($field, $publish) {
            $entry = ContentEntry::lockForUpdate()->findOrFail($field['entry']);
            Gate::authorize($publish ? 'publish' : 'update', $entry);
            if (VisualEditorContent::revision($entry) !== $this->revision) {
                throw ValidationException::withMessages(['value' => 'Блок уже изменён другим редактором. Скопируйте свой текст, отмените правку и выберите его заново.']);
            }
            if ($publish) {
                $entry->publish();
            } else {
                $draft = $entry->draft;
                data_set($draft, $field['path'], $this->value);
                $entry->update(['draft' => $draft]);
            }
            $this->revision = VisualEditorContent::revision($entry);
            $this->value = $this->savedValue = (string) data_get($entry->draft, $field['path'], '');
            $this->dispatch('visual-text', key: $this->selectedKey, value: $this->value);
        });
    }
}
