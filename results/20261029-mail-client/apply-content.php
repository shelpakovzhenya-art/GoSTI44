<?php
require '/var/www/gosti/current/cms/vendor/autoload.php';
$app=require '/var/www/gosti/current/cms/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use Illuminate\Support\Facades\DB;
use App\Support\ContentValidator;
$spec=json_decode(file_get_contents(__DIR__.'/content-patch.json'),true,512,JSON_THROW_ON_ERROR);
$backup='/var/www/gosti/backups/20261029-mail-client';$dry=in_array('--check',$argv,true);
$json=static fn($v)=>json_encode($v,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR);
$result=DB::transaction(function()use($spec,$backup,$dry,$json){
 $changes=[];$saved=[];
 foreach($spec['edits']as$edit){
  $row=DB::table('content_entries')->where('key',$edit['key'])->lockForUpdate()->first();
  if(!$row||$row->kind!==$edit['kind'])throw new RuntimeException('Unexpected entry: '.$edit['key']);
  $fields=[];
  foreach(['published','draft']as$field){
   $data=json_decode($row->$field,true,512,JSON_THROW_ON_ERROR);
   foreach($edit['changes']as$change){
    $target=&$data;
    foreach($change['path']as$part){if(!array_key_exists($part,$target))throw new RuntimeException('Missing field');$target=&$target[$part];}
    if($target!==$change['before'])throw new RuntimeException('Changed '.$row->key.' '.$field.' '.implode('.',$change['path']));
    $target=$change['after'];unset($target);
   }
   // Legacy records contain empty optional text slots. Preserve them, but reject
   // every new validation error or any changed value at an existing error path.
   $original=json_decode($row->$field,true,512,JSON_THROW_ON_ERROR);$prior=[];
   try{ContentValidator::validate($edit['kind'],$original,$row->key);}catch(Illuminate\Validation\ValidationException $e){$prior=$e->errors();}
   try{ContentValidator::validate($edit['kind'],$data,$row->key);}catch(Illuminate\Validation\ValidationException $e){
    foreach($e->errors()as$path=>$errors){
     if(!isset($prior[$path])||$prior[$path]!==$errors||data_get($original,$path)!==data_get($data,$path))throw new RuntimeException('New validation error: '.$row->key.' '.$field.' '.$path);
    }
   }
   $fields[$field]=$data;
  }
  $changes[]=['id'=>$row->id,'key'=>$row->key,'fields'=>$fields];$saved[]=(array)$row;
 }
 if($dry)return['validated'=>true,'records'=>count($changes),'draftFieldsPreserved'=>true];
 if(!is_file($backup.'/database.sqlite')||file_exists($backup.'/entries-before.json'))throw new RuntimeException('Unexpected backup state');
 file_put_contents($backup.'/entries-before.json',$json($saved));chmod($backup.'/entries-before.json',0600);$now=now();
 foreach($changes as$change){
  DB::table('content_entries')->where('id',$change['id'])->update(['published'=>$json($change['fields']['published']),'draft'=>$json($change['fields']['draft']),'published_at'=>$now,'updated_at'=>$now]);
  foreach(['published'=>'publish','draft'=>'draft']as$field=>$action)DB::table('content_revisions')->insert(['content_entry_id'=>$change['id'],'user_id'=>null,'action'=>$action,'data'=>$json($change['fields'][$field]),'created_at'=>$now,'updated_at'=>$now]);
 }
 return['records'=>array_column($changes,'key'),'revisionsAdded'=>count($changes)*2,'draftFieldsPreserved'=>true];
});echo$json($result).PHP_EOL;
