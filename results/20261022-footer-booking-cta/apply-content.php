<?php
require '/var/www/gosti/current/cms/vendor/autoload.php';$app=require '/var/www/gosti/current/cms/bootstrap/app.php';$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use Illuminate\Support\Facades\DB;use App\Support\ContentValidator;
$spec=json_decode(file_get_contents(__DIR__.'/content-patch.json'),true,512,JSON_THROW_ON_ERROR);$backup='/var/www/gosti/backups/20261022-footer-booking-cta';$dry=in_array('--check',$argv,true);$json=static fn($v)=>json_encode($v,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR);
$result=DB::transaction(function()use($spec,$backup,$dry,$json){
 $changes=[];$saved=[];
 foreach($spec['edits']as$edit){
  $row=DB::table('content_entries')->where('key',$edit['key'])->lockForUpdate()->first();if(!$row||$row->kind!=='section')throw new RuntimeException('Unexpected entry');$published=json_decode($row->published,true,512,JSON_THROW_ON_ERROR);if($published!=$edit['beforePublished'])throw new RuntimeException('Published content changed');$fields=[];
  foreach(['published','draft']as$field){$data=json_decode($row->$field,true,512,JSON_THROW_ON_ERROR);foreach($edit['transforms']as$change){if(substr_count($data['body'],$change['before'])!==1)throw new RuntimeException('Target fragment changed');$data['body']=str_replace($change['before'],$change['after'],$data['body']);}ContentValidator::validate('section',$data,$row->key);if($field==='published'&&$data['body']!==$edit['expectedBody'])throw new RuntimeException('Unexpected result');$fields[$field]=$data;}
  $changes[]=['id'=>$row->id,'key'=>$row->key,'fields'=>$fields];$saved[]=(array)$row;
 }
 if($dry)return['validated'=>true,'sections'=>count($changes),'onlyBodies'=>true,'otherDraftFieldsPreserved'=>true];
 if(!is_file($backup.'/database.sqlite')||file_exists($backup.'/entries-before.json'))throw new RuntimeException('Unexpected backup state');file_put_contents($backup.'/entries-before.json',$json($saved));chmod($backup.'/entries-before.json',0600);$now=now();
 foreach($changes as$change){DB::table('content_entries')->where('id',$change['id'])->update(['published'=>$json($change['fields']['published']),'draft'=>$json($change['fields']['draft']),'published_at'=>$now,'updated_at'=>$now]);foreach(['published'=>'publish','draft'=>'draft']as$field=>$action)DB::table('content_revisions')->insert(['content_entry_id'=>$change['id'],'user_id'=>null,'action'=>$action,'data'=>$json($change['fields'][$field]),'created_at'=>$now,'updated_at'=>$now]);}
 return['sections'=>array_column($changes,'key'),'onlyBodiesChanged'=>true,'revisionsAdded'=>2,'otherDraftFieldsPreserved'=>true];
});echo$json($result).PHP_EOL;
