<?php

namespace App\Filament\Resources\Users\Schemas;

use App\Models\User;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')->label('Имя')->required()->maxLength(200),
            TextInput::make('email')->label('Email для входа')->email()->required()->unique(ignoreRecord: true),
            TextInput::make('password')->label('Новый пароль')->password()->minLength(12)->required(fn (string $operation) => $operation === 'create')->dehydrated(fn (?string $state): bool => filled($state))->helperText('При редактировании оставьте пустым, чтобы сохранить пароль.'),
            Select::make('role')->label('Права')->options(['admin' => 'Администратор: всё и пользователи', 'publisher' => 'Выпускающий: редактирование и публикация', 'editor' => 'Редактор: только черновики'])->required()->default('editor')->disabled(fn (?User $record) => $record?->id === auth()->id()),
            Toggle::make('active')->label('Доступ разрешён')->default(true)->disabled(fn (?User $record) => $record?->id === auth()->id()),
        ]);
    }
}
