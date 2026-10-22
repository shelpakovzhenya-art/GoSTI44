<?php

namespace App\Filament\Resources\Media\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class MediaForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            TextInput::make('name')->label('Название')->required()->maxLength(200),
            FileUpload::make('path')->label('Фото')->disk('public')->directory('photos')->visibility('public')->image()->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])->maxSize(15360)->imageEditor()->required()->columnSpanFull(),
            TextInput::make('alt')->label('Что изображено на фото (alt)')->required()->maxLength(250),
            Textarea::make('caption')->label('Подпись'),
        ]);
    }
}
