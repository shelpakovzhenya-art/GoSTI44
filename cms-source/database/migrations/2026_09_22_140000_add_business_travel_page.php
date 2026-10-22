<?php
use App\Support\ContentValidator;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {
 public function up(): void {
  if (! Schema::hasTable('content_entries') || ! DB::table('content_entries')->where('key','home')->exists()) return;
  DB::transaction(function (): void {
   $key='dlya-komandirovochnyh';
   $data=json_decode(<<<'JSON'
{
  "template": "business",
  "title": "Приезжайте по работе",
  "eyebrow": "НАШИ ГОСТИ",
  "description": "Здесь можно продуктивно работать, комфортно отдыхать и чувствовать себя как дома, даже вдали от дома.",
  "body": "",
  "buttons": [
    {
      "label": "Забронировать таунхаус",
      "href": "/#booking"
    }
  ],
  "images": [
    {
      "src": "/images/business-bedroom.jpg",
      "alt": "Гостиная гостевого дома «Танжерин»"
    }
  ],
  "texts": [
    {
      "key": "heroTitle",
      "value": "Приезжайте\nпо работе"
    },
    {
      "key": "intro",
      "value": "ТАНЖЕРИН — удобный выбор\nДля командировочных в Кострому."
    },
    {
      "key": "heroFact1",
      "value": "Удобное расположение\nдля деловых поездок"
    },
    {
      "key": "heroFact2",
      "value": "Стабильный Wi-Fi\nдля работы и видеозвонков"
    },
    {
      "key": "heroFact3",
      "value": "Пространство, где можно\nсосредоточиться и отдохнуть"
    },
    {
      "key": "heroNote",
      "value": "Работа в Костроме\nможет быть комфортной"
    },
    {
      "key": "photoNote",
      "value": "В деловых поездках\nтоже есть\nприятные моменты"
    },
    {
      "key": "benefitsTitle",
      "value": "ВСЁ, ЧТО НУЖНО ДЛЯ ДЕЛОВОЙ ПОЕЗДКИ"
    },
    {
      "key": "benefit1Title",
      "value": "Комфортное размещение"
    },
    {
      "key": "benefit1Text",
      "value": "Удобные спальни\nи рабочее место"
    },
    {
      "key": "benefit2Title",
      "value": "Стабильный Wi-Fi"
    },
    {
      "key": "benefit2Text",
      "value": "Для работы, встреч\nи видеозвонков"
    },
    {
      "key": "benefit3Title",
      "value": "Своя кухня"
    },
    {
      "key": "benefit3Text",
      "value": "Можно готовить\nи не зависеть\nот кафе"
    },
    {
      "key": "benefit4Title",
      "value": "Парковка"
    },
    {
      "key": "benefit4Text",
      "value": "Удобный заезд\nи парковочное\nместо"
    },
    {
      "key": "benefit5Title",
      "value": "Отчётные документы"
    },
    {
      "key": "benefit5Text",
      "value": "Предоставляем\nвсе необходимые\nдокументы"
    },
    {
      "key": "datesNote",
      "value": "Гибкие даты и условия\nдля командировочных"
    },
    {
      "key": "closingNote",
      "value": "Хорошая работа\nначинается с хорошего места"
    },
    {
      "key": "location",
      "value": "ТАНЖЕРИН — в Костроме удобно по делам и приятно оставаться."
    }
  ],
  "seo": {
    "title": "Для командировочных в Кострому — Танжерин",
    "description": "Здесь можно продуктивно работать, комфортно отдыхать и чувствовать себя как дома, даже вдали от дома.",
    "h1": "Приезжайте по работе",
    "ogImage": "/images/business-bedroom.jpg",
    "noindex": false
  }
}
JSON, true, flags: JSON_THROW_ON_ERROR);
   ContentValidator::validate('page',$data,$key);
   if (! DB::table('content_entries')->where('key',$key)->exists()) {
    $json=json_encode($data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR);
    $id=DB::table('content_entries')->insertGetId(['kind'=>'page','key'=>$key,'name'=>'Для командировочных','draft'=>$json,'published'=>$json,'position'=>50,'published_at'=>now(),'created_at'=>now(),'updated_at'=>now()]);
    DB::table('content_revisions')->insert(['content_entry_id'=>$id,'user_id'=>null,'action'=>'publish','data'=>$json,'created_at'=>now(),'updated_at'=>now()]);
   }
   $menu=DB::table('content_entries')->where('key','main-menu')->lockForUpdate()->first();
   if (! $menu) return;
   $changes=[];
   foreach (['draft','published'] as $column) {
    if ($menu->{$column}===null) continue;
    $data=json_decode($menu->{$column},true,flags:JSON_THROW_ON_ERROR);
    foreach ($data['buttons'] as &$button) { if ($button['href']==='#business-travel' || $button['href']==='/#business-travel') $button['href']='/dlya-komandirovochnyh'; }
    unset($button);
    ContentValidator::validate($menu->kind,$data,$menu->key);
    $json=json_encode($data,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR);
    $changes[$column]=$json;
    DB::table('content_revisions')->insert(['content_entry_id'=>$menu->id,'user_id'=>null,'action'=>$column==='draft'?'draft':'publish','data'=>$json,'created_at'=>now(),'updated_at'=>now()]);
   }
   if ($changes) DB::table('content_entries')->where('id',$menu->id)->update($changes+['updated_at'=>now(),'published_at'=>now()]);
  });
 }
 public function down(): void { /* Preserve editorial content on rollback. */ }
};
