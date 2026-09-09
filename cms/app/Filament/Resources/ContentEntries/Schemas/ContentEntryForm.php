<?php

namespace App\Filament\Resources\ContentEntries\Schemas;

use App\Models\Media;
use Filament\Forms\Components\CodeEditor;
use Filament\Forms\Components\CodeEditor\Enums\Language;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class ContentEntryForm
{
    public const KINDS = ['page' => 'Страница', 'section' => 'Блок главной', 'house' => 'Дом', 'service' => 'Услуга', 'faq' => 'Вопрос и ответ', 'review' => 'Отзыв', 'rating' => 'Рейтинг площадки', 'settings' => 'Контакты и настройки', 'menu' => 'Меню', 'redirect' => 'Перенаправление'];

    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Запись')->schema([
                TextInput::make('name')->label('Название в админке')->required()->maxLength(200),
                Select::make('kind')->label('Тип')->options(fn (string $operation) => $operation === 'create' ? array_diff_key(self::KINDS, array_flip(['section', 'settings', 'menu'])) : self::KINDS)->required()->live()->disabledOn('edit')->dehydrated(),
                TextInput::make('key')->label('Постоянный ключ / путь')->helperText('Ключ существующего блока не меняется. Для новой страницы: about или pravila.')->required()->maxLength(150)->regex('/^[a-z0-9][a-z0-9_\-\/]*$/')->unique(ignoreRecord: true)->disabledOn('edit')->dehydrated(),
                TextInput::make('position')->label('Порядок')->integer()->minValue(0)->default(0),
            ])->columns(2),
            Tabs::make('Редактирование')->tabs([
                Tab::make('Содержимое')->schema([
                    TextInput::make('draft.title')->label('Заголовок')->maxLength(250)->visible(fn (Get $get) => in_array($get('kind'), ['page', 'house', 'service', 'faq']) && $get('key') !== 'home'),
                    TextInput::make('draft.eyebrow')->label('Надпись над заголовком')->maxLength(150)->visible(fn (Get $get) => $get('kind') === 'page' && $get('key') !== 'home'),
                    Textarea::make('draft.description')->label('Краткое описание')->rows(3)->visible(fn (Get $get) => in_array($get('kind'), ['page', 'house', 'service', 'faq']) && $get('key') !== 'home'),
                    Toggle::make('html_mode')->label('Редактировать HTML')->live()->dehydrated(false)->visible(fn (Get $get) => $get('kind') === 'page' && $get('key') !== 'home'),
                    RichEditor::make('draft.body')->label('Текст — визуальный редактор')->toolbarButtons(['bold', 'italic', 'underline', 'h2', 'h3', 'bulletList', 'orderedList', 'blockquote', 'link', 'undo', 'redo'])->visible(fn (Get $get) => ! $get('html_mode') && $get('kind') === 'page' && $get('key') !== 'home')->live(onBlur: true)->afterStateUpdated(fn (Set $set, $state) => $set('html_source', $state)),
                    CodeEditor::make('html_source')->label('Тот же текст — HTML')->language(Language::Html)->wrap()->visible(fn (Get $get) => (bool) $get('html_mode') && $get('kind') === 'page' && $get('key') !== 'home')->dehydrated(false)->afterStateHydrated(fn (Set $set, Get $get) => $set('html_source', $get('draft.body')))->live(onBlur: true)->afterStateUpdated(fn (Set $set, $state) => $set('draft.body', $state))->helperText('Скрипты и небезопасные атрибуты удаляются при сохранении.'),
                    Repeater::make('draft.texts')->defaultItems(0)->visible(fn (Get $get) => $get('kind') === 'section')->label('Тексты блока')->schema([
                        TextInput::make('key')->label('Ключ')->required()->disabled()->dehydrated(),
                        Textarea::make('value')->label('Текст')->required(),
                    ])->columns(2)->collapsible()->collapsed()->addable(false)->deletable(false)->reorderable(false)->itemLabel(fn (array $state): ?string => Str::limit($state['value'] ?? 'Текст', 85)),
                    Repeater::make('draft.buttons')->defaultItems(0)->visible(fn (Get $get) => in_array($get('kind'), ['page', 'menu']) && $get('key') !== 'home')->label('Кнопки')->schema([
                        TextInput::make('label')->label('Надпись')->required(),
                        TextInput::make('href')->label('Ссылка')->required()->regex('/^(https?:\/\/|mailto:|tel:|#|\/)[^<>]*$/'),
                    ])->columns(2),
                    Textarea::make('draft.detail')->label('Подробности услуги')->visible(fn (Get $get) => $get('kind') === 'service'),
                    Select::make('draft.icon')->label('Иконка')->options(['House' => 'Дом', 'Trees' => 'Деревья', 'ChefHat' => 'Кухня', 'Flame' => 'Мангал', 'CarFront' => 'Парковка', 'KeyRound' => 'Ключ', 'Baby' => 'Дети', 'PawPrint' => 'Питомцы', 'Croissant' => 'Завтрак', 'Sparkles' => 'Комфорт', 'Leaf' => 'Лист'])->default('Leaf')->visible(fn (Get $get) => $get('kind') === 'service'),
                    Select::make('draft.className')->label('Оформление услуги')->options(['breakfast' => 'Завтрак', 'barbecue' => 'Мангал', 'children' => 'Дети', 'comfort' => 'Комфорт'])->default('comfort')->visible(fn (Get $get) => $get('kind') === 'service'),
                    Repeater::make('draft.items')->label('Удобства')->defaultItems(0)->visible(fn (Get $get) => $get('key') === 'comforts')->schema([
                        TextInput::make('title')->label('Название')->required(),
                        Textarea::make('text')->label('Описание')->required(),
                        Select::make('icon')->label('Иконка')->options(['House' => 'Дом', 'Trees' => 'Деревья', 'ChefHat' => 'Кухня', 'Flame' => 'Мангал', 'CarFront' => 'Парковка', 'KeyRound' => 'Ключ', 'Baby' => 'Дети', 'PawPrint' => 'Питомцы', 'Leaf' => 'Лист'])->default('Leaf'),
                    ])->collapsible()->itemLabel(fn (array $state): ?string => $state['title'] ?? 'Удобство'),
                ]),
                Tab::make('Фотографии')->visible(fn (Get $get) => $get('kind') === 'house' || ($get('kind') === 'page' && $get('key') !== 'home') || in_array($get('key'), ['site-images', 'photo-gallery']))->schema([
                    Repeater::make('draft.images')->defaultItems(0)->label('Изображения')->schema([
                        TextInput::make('key')->label('Расположение / исходный путь')->helperText('У системных фотографий сохраняйте этот ключ: он связывает фото с местом на сайте.'),
                        Select::make('media_id')->label('Из медиатеки')->options(fn () => Media::query()->pluck('name', 'id'))->searchable()->live()->afterStateUpdated(function (Set $set, $state) {
                            $media = Media::find($state);
                            if ($media) {
                                $set('src', '/storage/'.$media->path);
                                $set('alt', $media->alt);
                            }
                        }),
                        TextInput::make('src')->label('Путь к изображению')->required()->regex('/^(\/images\/|\/brand\/|\/storage\/)[a-zA-Z0-9_\-\.\/]+$/'),
                        TextInput::make('alt')->label('Описание для доступности и поиска')->maxLength(250)->helperText('Оставьте пустым только для декоративного изображения или сохранения текущей подписи системного фото.'),
                        TextInput::make('caption')->label('Подпись'),
                    ])->collapsible()->itemLabel(fn (array $state): ?string => $state['alt'] ?? 'Фото')->reorderable(),
                ]),
                Tab::make('Дом')->visible(fn (Get $get) => $get('kind') === 'house')->schema([
                    TextInput::make('draft.name')->label('Название дома')->required(fn (Get $get) => $get('kind') === 'house'),
                    TextInput::make('draft.area')->label('Площадь, м²')->numeric()->minValue(1),
                    Toggle::make('draft.areaApproximate')->label('Площадь приблизительная')->default(false),
                    TextInput::make('draft.guests')->label('Вместимость, например «до 7»'),
                    TextInput::make('draft.bedrooms')->label('Спальни')->integer()->minValue(0),
                    TextInput::make('draft.bathrooms')->label('Санузлы')->integer()->minValue(0),
                    TextInput::make('draft.label')->label('Метка'),
                    TextInput::make('draft.feature')->label('Главное удобство'),
                    Select::make('draft.tone')->label('Цвет дома')->options(['lime' => 'Лайм', 'lemon' => 'Лимон', 'citrus' => 'Цитрус']),
                    TagsInput::make('draft.amenities')->label('Удобства'),
                ])->columns(2),
                Tab::make('SEO')->visible(fn (Get $get) => $get('kind') === 'page')->schema([
                    TextInput::make('draft.seo.title')->label('Title')->maxLength(250),
                    Textarea::make('draft.seo.description')->label('Description')->rows(3)->maxLength(500),
                    TextInput::make('draft.seo.h1')->label('H1')->maxLength(250),
                    TextInput::make('draft.seo.canonical')->label('Canonical — переопределение')->url()->helperText('Обычно оставляется пустым: адрес формируется из основного домена и пути страницы.'),
                    TextInput::make('draft.seo.ogImage')->label('Картинка для социальных сетей')->regex('/^(\/images\/|\/storage\/)[a-zA-Z0-9_\-\.\/]+$/'),
                    Toggle::make('draft.seo.noindex')->label('Запретить индексацию'),
                ]),
                Tab::make('Параметры')->visible(fn (Get $get) => in_array($get('kind'), ['settings', 'review', 'rating', 'redirect']))->schema([
                    TextInput::make('draft.name')->label('Имя / название площадки')->visible(fn (Get $get) => in_array($get('kind'), ['review', 'rating'])),
                    TextInput::make('draft.initials')->label('Инициалы')->visible(fn (Get $get) => $get('kind') === 'review'),
                    TextInput::make('draft.date')->label('Дата отзыва')->visible(fn (Get $get) => $get('kind') === 'review'),
                    Textarea::make('draft.quote')->label('Точная цитата')->visible(fn (Get $get) => $get('kind') === 'review')->helperText('Добавляйте только реальные отзывы с источником.'),
                    TextInput::make('draft.user')->label('Идентификатор автора на площадке')->visible(fn (Get $get) => $get('kind') === 'review'),
                    TextInput::make('draft.id')->label('Ключ площадки')->required(fn (Get $get) => $get('kind') === 'rating')->visible(fn (Get $get) => $get('kind') === 'rating'),
                    TextInput::make('draft.rating')->label('Оценка, например 5,0')->visible(fn (Get $get) => $get('kind') === 'rating'),
                    TextInput::make('draft.count')->label('Количество оценок')->visible(fn (Get $get) => $get('kind') === 'rating'),
                    TextInput::make('draft.url')->label('Ссылка на источник')->url()->visible(fn (Get $get) => $get('kind') === 'rating'),
                    TextInput::make('draft.logo')->label('Путь к логотипу')->visible(fn (Get $get) => $get('kind') === 'rating'),
                    Repeater::make('draft.fields')->defaultItems(0)->visible(fn (Get $get) => in_array($get('kind'), ['settings', 'menu']))->label('Параметры записи')->schema([
                        TextInput::make('key')->label('Параметр')->required(),
                        Textarea::make('value')->label('Значение')->required(),
                    ])->columns(2)->itemLabel(fn (array $state): ?string => $state['key'] ?? null),
                    TextInput::make('draft.origin')->label('Основной домен, https://…')->url()->visible(fn (Get $get) => $get('kind') === 'settings'),
                    Toggle::make('draft.indexable')->label('Разрешить индексацию production')->visible(fn (Get $get) => $get('kind') === 'settings')->helperText('Включать после настройки домена и проверки сайта.'),
                    TextInput::make('draft.destination')->label('Куда перенаправлять')->regex('/^\/(?!\/)[^<>]*$/')->visible(fn (Get $get) => $get('kind') === 'redirect'),
                ]),
            ])->columnSpanFull(),
        ]);
    }
}
