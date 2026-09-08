<?php

namespace App\Filament\Resources\ContentEntries\Tables;

use App\Filament\Resources\ContentEntries\Schemas\ContentEntryForm;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class ContentEntriesTable
{
    public static function configure(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('name')->label('Название')->searchable()->sortable(),
            TextColumn::make('kind')->label('Тип')->formatStateUsing(fn (string $state) => ContentEntryForm::KINDS[$state] ?? $state)->badge(),
            TextColumn::make('key')->label('Ключ')->searchable(),
            TextColumn::make('published_at')->label('Опубликовано')->dateTime('d.m.Y H:i')->placeholder('Черновик'),
            TextColumn::make('updated_at')->label('Изменено')->dateTime('d.m.Y H:i')->sortable(),
        ])->filters([SelectFilter::make('kind')->label('Тип')->options(ContentEntryForm::KINDS)])
            ->recordActions([EditAction::make()])->defaultSort('position');
    }
}
