<?php

namespace App\Filament\Resources\Media\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class MediaTable
{
    public static function configure(Table $table): Table
    {
        return $table->columns([
            ImageColumn::make('path')->label('Фото')->disk('public'),
            TextColumn::make('name')->label('Название')->searchable(),
            TextColumn::make('alt')->label('Описание')->searchable(),
            TextColumn::make('created_at')->label('Добавлено')->dateTime('d.m.Y H:i'),
        ])->recordActions([EditAction::make()])->defaultSort('created_at', 'desc');
    }
}
