<?php
// Store only directive and blocked origin: no page URL, query, cookies or IP.
if($_SERVER['REQUEST_METHOD']!=='POST'){http_response_code(405);exit;}
$raw=file_get_contents('php://input',false,null,0,16385);
if(strlen($raw)>16384){http_response_code(413);exit;}
$data=json_decode($raw,true);
if(!is_array($data)){http_response_code(400);exit;}
$reports=isset($data['csp-report'])?[$data['csp-report']]:array_slice($data,0,10);
foreach($reports as$r){
 $r=$r['body']??$r;
 $directive=$r['effective-directive']??$r['effectiveDirective']??'';
 if(!preg_match('/^[a-z-]{1,60}$/',$directive))continue;
 $blocked=$r['blocked-uri']??$r['blockedURL']??'';
 $origin=parse_url($blocked,PHP_URL_HOST);
 if(!$origin)$origin=in_array($blocked,['inline','eval','data','blob','self'],true)?$blocked:'other';
 error_log('TANGERIN_CSP '.json_encode(['directive'=>$directive,'origin'=>substr($origin,0,200)],JSON_UNESCAPED_SLASHES));
}
http_response_code(204);
