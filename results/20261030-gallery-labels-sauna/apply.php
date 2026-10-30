<?php
require '/var/www/gosti/current/cms/vendor/autoload.php';
$app=require '/var/www/gosti/current/cms/bootstrap/app.php';$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use Illuminate\Support\Facades\DB;
$j=fn($v)=>json_encode($v,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR);
echo $j(DB::transaction(function()use($j){
$backup='/var/www/gosti/backups/20261030-gallery-labels-sauna';if(file_exists($backup))throw new RuntimeException('Backup exists');mkdir($backup,0700,true);
foreach(['lemon','photo-gallery']as$key){$r=DB::table('content_entries')->where('key',$key)->lockForUpdate()->first();$fields=[];
foreach(['published','draft']as$f){$d=json_decode($r->$f,true);
if($key==='lemon'){$map=['/images/lemon-living-wide-20260930.webp'=>'Зона отдыха','/images/lemon-living-entry-20260930.webp'=>'Вход в гостиную'];$count=0;foreach($d['images']as&$im){if(isset($map[$im['src']])){if($im['alt']!=='Гостиная')throw new RuntimeException('Caption changed');$im['alt']=$map[$im['src']];$count++;}}unset($im);if($count!==2)throw new RuntimeException('Images missing');}
else{if(count($d['images'])!==11)throw new RuntimeException('Gallery changed');$d['images'][]=['src'=>'/images/spa-sauna.jpg','alt'=>'Парная'];}
$fields[$f]=$j($d);}
file_put_contents($backup.'/'.$key.'.json',$j($r));chmod($backup.'/'.$key.'.json',0600);$n=now();DB::table('content_entries')->where('id',$r->id)->update($fields+['published_at'=>$n,'updated_at'=>$n]);foreach(['published'=>'publish','draft'=>'draft']as$f=>$a)DB::table('content_revisions')->insert(['content_entry_id'=>$r->id,'user_id'=>null,'action'=>$a,'data'=>$fields[$f],'created_at'=>$n,'updated_at'=>$n]);
}return ['entries'=>2,'revisions'=>4];}))."\n";
