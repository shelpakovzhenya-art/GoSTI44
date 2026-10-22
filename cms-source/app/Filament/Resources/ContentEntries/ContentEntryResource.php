<?php

namespace App\Filament\Resources\ContentEntries;

use App\Filament\Resources\ContentEntries\Pages\CreateContentEntry;
use App\Filament\Resources\ContentEntries\Pages\EditContentEntry;
use App\Filament\Resources\ContentEntries\Pages\ListContentEntries;
use App\Filament\Resources\ContentEntries\Schemas\ContentEntryForm;
use App\Filament\Resources\ContentEntries\Tables\ContentEntriesTable;
use App\Models\ContentEntry;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class ContentEntryResource extends Resource
{
    protected static ?string $navigationLabel = 'Контент сайта';

    protected static ?string $modelLabel = 'запись';

    protected static ?string $pluralModelLabel = 'Контент сайта';

    protected static ?string $recordTitleAttribute = 'name';

    protected static ?string $model = ContentEntry::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    public static function form(Schema $schema): Schema
    {
        return ContentEntryForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return ContentEntriesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListContentEntries::route('/'),
            'create' => CreateContentEntry::route('/create'),
            'edit' => EditContentEntry::route('/{record}/edit'),
        ];
    }
}
