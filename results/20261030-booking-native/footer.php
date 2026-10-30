<?php
require '/var/www/gosti/current/cms/vendor/autoload.php';
$app=require '/var/www/gosti/current/cms/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
use Illuminate\Support\Facades\DB;
$j=fn($v)=>json_encode($v,JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES|JSON_THROW_ON_ERROR);
echo $j(DB::transaction(function()use($j){
$r=DB::table('content_entries')->where('key','site-footer')->lockForUpdate()->first();$fields=[];
foreach(['published','draft']as$f){$d=json_decode($r->$f,true);$old='<div id="_bn_widget_footer_"><a href="https://bnovo.ru/" id="_bnovo_link_" rel="noreferrer" target="_blank">Bnovo</a></div>';if(!preg_match('~<div id="_bn_widget_footer_">.*?</div>~s',$d['body'],$m))throw new RuntimeException('Host guard');$replacement='<div id="_bn_widget_footer_">'.file_get_contents(__DIR__.'/form.html').'</div>';$d['body']=str_replace($m[0],$replacement,$d['body']);$fields[$f]=$j($d);}
$b='/var/www/gosti/backups/20261030-booking-native/footer-before.json';if(file_exists($b))throw new RuntimeException('Backup exists');file_put_contents($b,$j($r));chmod($b,0600);
$n=now();DB::table('content_entries')->where('id',$r->id)->update($fields+['published_at'=>$n,'updated_at'=>$n]);
foreach(['published'=>'publish','draft'=>'draft']as$f=>$a)DB::table('content_revisions')->insert(['content_entry_id'=>$r->id,'user_id'=>null,'action'=>$a,'data'=>$fields[$f],'created_at'=>$n,'updated_at'=>$n]);
return ['entry'=>'site-footer','revisions'=>2];
}))."\n";

