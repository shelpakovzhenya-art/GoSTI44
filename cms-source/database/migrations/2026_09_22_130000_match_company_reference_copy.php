<?php

use App\Support\ContentValidator;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('content_entries')) {
            return;
        }

        DB::transaction(function (): void {
            $entry = DB::table('content_entries')->where('key', 'dlya-bolshoy-kompanii')->lockForUpdate()->first();
            if (! $entry) {
                return;
            }

            $changes = [];

            foreach (['draft', 'published'] as $column) {
                if ($entry->{$column} === null) {
                    continue;
                }

                $data = json_decode($entry->{$column}, true, flags: JSON_THROW_ON_ERROR);
                $data['description'] = 'Приезжаете несколькими семьями, с родственниками или друзьями? В ТАНЖЕРИНЕ можно разместиться рядом и жить с комфортом: вместе проводить время, а отдыхать — каждый в своём таунхаусе.';
                $data['body'] = '<p>Поможем подобрать удобное размещение для вашей компании.</p>';
                $data['seo']['h1'] = 'До 25 гостей — в трёх таунхаусах рядом';
                $updates = [
                    'heroTitle' => 'До 25 гостей —
в трёх таунхаусах рядом',
                    'fact1Text' => 'в трёх таунхаусах рядом',
                    'fact3Title' => 'Все дома рядом',
                    'fact3Text' => 'удобно для общей поездки',
                    'scenario1Text' => 'Живёте рядом, но у каждой семьи остаются свои спальни, кухня и веранда.',
                    'scenario2Text' => 'Можно собираться вместе на общей территории, а вечером расходиться по отдельным домам.',
                    'scenario3Text' => 'Используются все три таунхауса — удобно для совместной поездки.',
                    'reasonsTitle' => 'Почему три таунхауса удобнее одного большого дома',
                    'reason1Text' => 'Не нужно всем жить в одном общем доме.',
                    'reason2Text' => 'Особенно удобно утром и при проживании нескольких семей.',
                    'reason3Title' => 'Можно отдыхать в разном ритме',
                    'reason3Text' => 'Дети могут лечь раньше, а остальные проводить время вместе.',
                    'housesTitle' => 'Три таунхауса для вашей компании',
                    'noteText' => 'ТАНЖЕРИН подходит для совместных поездок и семейных встреч.
Мы сохраняем спокойную атмосферу и не ориентируемся на шумные вечеринки с громкой музыкой.',
                    'closingText' => 'Напишите в Telegram, сколько вас будет и на какие даты планируете поездку — подскажем, какие таунхаусы лучше выбрать.',
                    'scenariosNote' => 'Больше, чем просто отдых — это время вместе ♡',
                    'noteCaption' => 'Хорошие люди всегда рядом ♡',
                    'closingNote' => 'Вместе всегда теплее ♡',
                    'closingButton' => 'Написать в Telegram',
                    'closingSecondary' => 'Посмотреть все дома',
                    'closingTrust1' => 'Быстро ответим',
                    'closingTrust2' => 'Подскажем оптимальный вариант',
                    'closingTrust3' => 'Бронь без лишних сложностей',
                    'limeSummary' => '2 спальни · кухня · веранда · SPA',
                    'lemonSummary' => '2 спальни · гостиная · кухня · джакузи',
                    'citrusSummary' => '4 спальни · 3 санузла · кухня · веранда',
                ];
                foreach ($updates as $key => $value) {
                    $found = false;
                    foreach ($data['texts'] as &$item) {
                        if ($item['key'] === $key) { $item['value'] = $value; $found = true; break; }
                    }
                    unset($item);
                    if (! $found) { $data['texts'][] = ['key' => $key, 'value' => $value]; }
                }

                ContentValidator::validate($entry->kind, $data, $entry->key);
                $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
                if ($json === $entry->{$column}) {
                    continue;
                }

                $changes[$column] = $json;
                DB::table('content_revisions')->insert([
                    'content_entry_id' => $entry->id,
                    'user_id' => null,
                    'action' => $column === 'draft' ? 'draft' : 'publish',
                    'data' => $json,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            if ($changes === []) {
                return;
            }

            $changes['updated_at'] = now();
            if (isset($changes['published'])) {
                $changes['published_at'] = now();
            }
            DB::table('content_entries')->where('id', $entry->id)->update($changes);
        });
    }

    public function down(): void
    {
        // Published CMS copy remains editable and is not overwritten on rollback.
    }
};
