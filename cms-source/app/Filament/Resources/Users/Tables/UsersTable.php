<?php

namespace App\Filament\Resources\Users\Tables;

use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table->columns([TextColumn::make('name')->label('Имя')->searchable(), TextColumn::make('email')->label('Email')->searchable(), TextColumn::make('role')->label('Права')->badge(), IconColumn::make('active')->label('Доступ')->boolean()])->recordActions([EditAction::make()]);
    }
}
