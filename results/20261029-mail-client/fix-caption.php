<?php
require '/var/www/gosti/current/cms/vendor/autoload.php';
$app=require '/var/www/gosti/current/cms/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use Illuminate\Support\Facades\DB;
$j=fn($v)=>json_encode($v,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR);
$result=DB::transaction(function()use($j){
$before=DB::table('content_entries')->orderBy('id')->get()->toArray();
$r=DB::table('content_entries')->where('key','lemon')->first();
$fields=[];
foreach(['published','draft']as$f){
$d=json_decode($r->$f,true,512,JSON_THROW_ON_ERROR);
if($d['images'][0]['src']!='/images/optimized-20261029/lemon-bedroom-wide-20260930.webp'||$d['images'][0]['alt']!=='Спальня с двуспальной кроватью и диваном')throw new RuntimeException('Caption guard failed');
$d['images'][0]['alt']='Спальня с двуспальной кроватью';$fields[$f]=$j($d);
}
$backup='/var/www/gosti/backups/20261029-mail-client/caption-before-20261030.json';
if(file_exists($backup))throw new RuntimeException('Backup exists');
file_put_contents($backup,$j($before));chmod($backup,0600);
$n=now();DB::table('content_entries')->where('id',$r->id)->update($fields+['updated_at'=>$n,'published_at'=>$n]);
foreach(['published'=>'publish','draft'=>'draft']as$f=>$action)DB::table('content_revisions')->insert(['content_entry_id'=>$r->id,'user_id'=>null,'action'=>$action,'data'=>$fields[$f],'created_at'=>$n,'updated_at'=>$n]);
$after=DB::table('content_entries')->orderBy('id')->get()->toArray();$unchanged=0;
foreach($before as$i=>$old){if($old->id!==$r->id){if($j($old)!==$j($after[$i]))throw new RuntimeException('Unrelated row changed');$unchanged++;}}
return ['changed'=>'lemon.images.0.alt','otherRowsUnchanged'=>$unchanged,'revisionsAdded'=>2];
});echo $j($result)."\n";

