<?php
require '/var/www/gosti/current/cms/vendor/autoload.php';
$app=require '/var/www/gosti/current/cms/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use Illuminate\Support\Facades\DB;
use App\Support\ContentValidator;
$spec=json_decode(file_get_contents(__DIR__.'/content-patch.json'),true,512,JSON_THROW_ON_ERROR);
$backup='/var/www/gosti/backups/20261022-faq-legal';$dry=in_array('--check',$argv,true);
$json=static fn($v)=>json_encode($v,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR);
$result=DB::transaction(function()use($spec,$backup,$dry,$json){
 $changes=[];$saved=[];
 foreach($spec['edits']as$edit){
  $row=DB::table('content_entries')->where('key',$edit['key'])->lockForUpdate()->first();
  if(!$row||$row->kind!==$edit['kind'])throw new RuntimeException('Unexpected entry');
  if(json_decode($row->published,true,512,JSON_THROW_ON_ERROR)!=$edit['beforePublished'])throw new RuntimeException('Published entry changed');
  $fields=[];
  foreach(['published','draft']as$field){
   $data=json_decode($row->$field,true,512,JSON_THROW_ON_ERROR);
   foreach($edit['bodyTransforms']as$t){if(substr_count($data['body'],$t['before'])!==1)throw new RuntimeException('Footer fragment changed');$data['body']=str_replace($t['before'],$t['after'],$data['body']);}
   foreach($edit['textTransforms']as$t){
    $found=0;foreach($data['texts']as&$text){if($text['key']!==$t['key'])continue;if($text['value']!==$t['before'])throw new RuntimeException('Landing text changed');$text['value']=$t['after'];$found++;}unset($text);
    if($found!==1)throw new RuntimeException('Unexpected text key count');
   }
   if($edit['buttonInsert']){
    $t=$edit['buttonInsert'];$positions=[];
    foreach($data['buttons']as$i=>$button){if($button['href']===$t['afterHref'])$positions[]=$i;if($button['label']===$t['button']['label'])throw new RuntimeException('FAQ menu item already exists');}
    if(count($positions)!==1)throw new RuntimeException('Unexpected menu anchor');
    array_splice($data['buttons'],$positions[0]+1,0,[$t['button']]);
   }
   ContentValidator::validate($edit['kind'],$data,$row->key);
   if($field==='published'&&isset($edit['expectedBody'])&&$data['body']!==$edit['expectedBody'])throw new RuntimeException('Unexpected footer result');
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
