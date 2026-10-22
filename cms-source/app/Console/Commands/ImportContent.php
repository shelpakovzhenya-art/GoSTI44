<?php

namespace App\Console\Commands;

use App\Models\ContentEntry;
use App\Models\Media;
use App\Support\ContentSanitizer;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use ZipArchive;

class ImportContent extends Command
{
    protected $signature = 'cms:import {path : Архив cms:export}';

    protected $description = 'Восстановить контент в пустую CMS; существующие записи не перезаписываются';

    public function handle(): int
    {
        if (ContentEntry::exists() || Media::exists()) {
            $this->error('Импорт разрешён только в пустую базу контента. Восстанавливайте в отдельную установку.');

            return self::FAILURE;
        }
        $zip = new ZipArchive;
        if ($zip->open($this->argument('path')) !== true) {
            $this->error('Архив не открыт.');

            return self::FAILURE;
        }
        $raw = $zip->getFromName('content.json');
        $data = $raw ? json_decode($raw, true, flags: JSON_THROW_ON_ERROR) : null;
        if (($data['version'] ?? null) !== 1) {
            $zip->close();
            $this->error('Неподдерживаемый архив.');

            return self::FAILURE;
        }
        $files = [];
        $total = 0;
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $stat = $zip->statIndex($i);
            $name = $stat['name'];
            $total += $stat['size'];
            if ($total > 1024 * 1024 * 1024) {
                throw new \RuntimeException('Архив больше 1 ГиБ: требуется ручное восстановление.');
            }
            if ($name === 'content.json') {
                continue;
            }
            if (! preg_match('~^uploads/(photos/[a-zA-Z0-9_\-./]+\.(jpg|jpeg|png|webp))$~i', $name, $match) || str_contains($name, '..')) {
                throw new \RuntimeException('Недопустимый путь в архиве.');
            }
            $bytes = $zip->getFromName($name);
            $info = is_string($bytes) ? @getimagesizefromstring($bytes) : false;
            if (! $info || ! in_array($info['mime'], ['image/jpeg', 'image/png', 'image/webp'])) {
                throw new \RuntimeException('Файл не является разрешённым изображением.');
            }
            $files[$name] = $match[1];
            if (Storage::disk('public')->exists($match[1])) {
                throw new \RuntimeException('Фото уже существует: восстановление не перезаписывает файлы.');
            }
        }
        DB::transaction(function () use ($data, $files, $zip) {
            foreach ($data['entries'] as $row) {
                $entry = ContentEntry::create(['kind' => $row['kind'], 'key' => $row['key'], 'name' => $row['name'], 'draft' => ContentSanitizer::clean($row['draft']), 'position' => $row['position']]);
                $entry->published = isset($row['published']) ? ContentSanitizer::clean($row['published']) : null;
                $entry->published_at = $row['published_at'];
                $entry->save();
                foreach ($row['revisions'] ?? [] as $revision) {
                    $entry->revisions()->create(['action' => $revision['action'], 'data' => ContentSanitizer::clean($revision['data'])]);
                }
            }
            foreach ($data['media'] as $row) {
                Media::create(['name' => $row['name'], 'path' => $row['path'], 'alt' => $row['alt'], 'caption' => $row['caption']]);
            }
            foreach ($files as $source => $destination) {
                $bytes = $zip->getFromName($source);
                Storage::disk('public')->put($destination, $bytes);
            }
        });
        $zip->close();
        $this->info('Контент восстановлен. Учётные записи создайте через cms:admin.');

        return self::SUCCESS;
    }
}
