<?php

namespace App\Filament\Resources\ContentEntries\Pages;

use App\Filament\Resources\ContentEntries\ContentEntryResource;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Forms\Components\Select;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;

class EditContentEntry extends EditRecord
{
    protected static string $resource = ContentEntryResource::class;

    protected function getSaveFormAction(): Action
    {
        return parent::getSaveFormAction()->label('Сохранить черновик');
    }

    protected function getHeaderActions(): array
    {
        return [
            Action::make('preview')->label('Предпросмотр черновика')->url(function () {
                $signed = URL::temporarySignedRoute('content.preview', now()->addMinutes(15), ['entry' => $this->record->id], absolute: false);

                return rtrim(config('cms.frontend_url'), '/').'/preview?record='.$this->record->id.'&'.parse_url($signed, PHP_URL_QUERY);
            })->openUrlInNewTab(),
            Action::make('publish')->label('Опубликовать')->color('success')->requiresConfirmation()->modalDescription('Сохранённая версия появится на сайте. Несохранённые поля сначала сохраните в черновик.')->visible(fn () => Gate::allows('publish', $this->record))->action(function () {
                Gate::authorize('publish', $this->record);
                $this->record->publish();
                Notification::make()->title('Опубликовано')->success()->send();
            }),
            Action::make('unpublish')->label('Снять с публикации')->color('warning')->requiresConfirmation()->visible(fn () => Gate::allows('unpublish', $this->record) && $this->record->published !== null)->action(function () {
                Gate::authorize('unpublish', $this->record);
                $this->record->published = null;
                $this->record->published_at = null;
                $this->record->save();
                Notification::make()->title('Публикация снята')->success()->send();
            }),
            Action::make('restore')->label('История версий')->schema([
                Select::make('revision')->label('Версия')->options(fn () => $this->record->revisions()->limit(100)->get()->mapWithKeys(fn ($r) => [$r->id => $r->created_at->format('d.m.Y H:i:s').' · '.($r->action === 'publish' ? 'Публикация' : 'Черновик').' #'.$r->id]))->required(),
            ])->modalDescription('Версия восстановится в черновик. Опубликованный сайт останется прежним.')->action(function (array $data) {
                Gate::authorize('update', $this->record);
                $this->record->restoreRevision((int) $data['revision']);
                $this->fillForm();
                Notification::make()->title('Черновик восстановлен')->success()->send();
            }),
            DeleteAction::make(),
        ];
    }
}
