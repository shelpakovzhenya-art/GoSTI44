<?php

namespace App\Console\Commands;

use App\Models\ContentEntry;
use App\Models\Media;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class ExportContent extends Command
{
    protected $signature = 'cms:export {path : Путь нового ZIP-файла}';

    protected $description = 'Резервная копия контента, черновиков, версий и фотографий без учётных записей';

    public function handle(): int
    {
        $path = $this->argument('path');
        if (file_exists($path)) {
            $this->error('Файл уже существует: укажите новый путь.');

            return self::FAILURE;
        }
        $zip = new ZipArchive;
        if ($zip->open($path, ZipArchive::CREATE | ZipArchive::EXCL) !== true) {
            $this->error('Не удалось создать архив.');

            return self::FAILURE;
        }
        $entries = ContentEntry::with('revisions')->get()->toArray();
        $media = Media::all()->toArray();
        $zip->addFromString('content.json', json_encode(['version' => 1, 'exportedAt' => now()->toIso8601String(), 'entries' => $entries, 'media' => $media], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR));
        foreach (Storage::disk('public')->allFiles() as $file) {
            if (basename($file) === '.gitignore') {
                continue;
            }$zip->addFile(Storage::disk('public')->path($file), 'uploads/'.$file);
        }
        $zip->close();
        $this->info('Архив контента создан: '.$path);

        return self::SUCCESS;
    }
}
