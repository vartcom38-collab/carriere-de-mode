<?php
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['error'=>'method_not_allowed']); exit; }

function out(int $code, array $data): void { http_response_code($code); echo json_encode($data, JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE); exit; }
function clip($v, int $n): string { $s = preg_replace('/\s+/u',' ',trim((string)$v)); return mb_substr($s,0,$n); }
function safe_id(string $s): string { return preg_replace('/[^a-zA-Z0-9_-]/','-', $s) ?: 'garment'; }
function secret_key(): string {
  $k = getenv('MAGNIFIC_API_KEY') ?: getenv('MAGNIFIC_KEY') ?: '';
  if ($k !== '') return $k;
  $cfg = __DIR__ . '/.env.php';
  if (is_file($cfg)) { $v = include $cfg; if (is_array($v)) return (string)($v['MAGNIFIC_API_KEY'] ?? $v['MAGNIFIC_KEY'] ?? ''); }
  return '';
}
function curl_json(string $url, array $headers, array $payload): array {
  $ch = curl_init($url);
  curl_setopt_array($ch,[CURLOPT_POST=>true,CURLOPT_RETURNTRANSFER=>true,CURLOPT_TIMEOUT=>55,CURLOPT_HTTPHEADER=>$headers,CURLOPT_POSTFIELDS=>json_encode($payload,JSON_UNESCAPED_SLASHES|JSON_UNESCAPED_UNICODE)]);
  $raw = curl_exec($ch); $status = (int)curl_getinfo($ch,CURLINFO_HTTP_CODE); $err = curl_error($ch); curl_close($ch);
  if ($raw === false) throw new RuntimeException('curl_failed:'.$err);
  $j = json_decode($raw,true); if (!is_array($j)) $j=['raw'=>mb_substr($raw,0,800)];
  if ($status < 200 || $status >= 300) throw new RuntimeException('provider_'.$status.':'.json_encode($j));
  return $j;
}
function persist_image(string $garmentId, string $context, string $source): string {
  $root = rtrim((string)($_SERVER['DOCUMENT_ROOT'] ?? dirname(__DIR__,2)),'/');
  $dir = $root.'/uploads/garments/'.safe_id($garmentId);
  if (!is_dir($dir) && !mkdir($dir,0755,true) && !is_dir($dir)) throw new RuntimeException('upload_dir_unavailable');
  $stamp = gmdate('Ymd-His'); $name = safe_id($context).'-'.$stamp.'-'.substr(hash('sha256',$source),0,10).'.jpg'; $path=$dir.'/'.$name;
  if (str_starts_with($source,'data:image/')) { $comma = strpos($source,','); if ($comma===false) throw new RuntimeException('invalid_data_url'); $bin = base64_decode(substr($source,$comma+1),true); if ($bin===false) throw new RuntimeException('invalid_base64_image'); }
  else { $ch=curl_init($source); curl_setopt_array($ch,[CURLOPT_RETURNTRANSFER=>true,CURLOPT_FOLLOWLOCATION=>true,CURLOPT_TIMEOUT=>45]); $bin=curl_exec($ch); $status=(int)curl_getinfo($ch,CURLINFO_HTTP_CODE); curl_close($ch); if ($bin===false || $status<200 || $status>=300) throw new RuntimeException('image_download_failed_'.$status); }
  if (file_put_contents($path,$bin)===false) throw new RuntimeException('image_write_failed');
  return '/uploads/garments/'.rawurlencode(safe_id($garmentId)).'/'.rawurlencode($name);
}
function direction_prompt($raw): string {
  if (!is_array($raw)) return '';
  $allowed=[
    'framing'=>['full'=>'full body fashion portrait, entire silhouette visible','three-quarter'=>'three-quarter fashion framing while keeping the garment readable','detail'=>'fashion detail emphasis while retaining enough silhouette to identify the same garment'],
    'light'=>['soft'=>'soft diffused studio light','graphic'=>'directional graphic fashion light with controlled shadows','natural'=>'natural daylight with realistic texture','night'=>'controlled nocturnal editorial lighting'],
    'mood'=>['clean'=>'minimal refined studio mood','intimate'=>'intimate quiet couture mood','editorial'=>'strong high-fashion editorial mood','heritage'=>'architectural heritage-inspired mood without copying any monument'],
    'setting'=>['studio'=>'neutral premium photography studio','interior'=>'elegant restrained interior','city'=>'subtle urban fashion setting','outdoor'=>'refined outdoor setting'],
    'destination'=>['book'=>'portfolio image prioritizing garment readability','ateliergram'=>'social editorial image with immediate visual impact','client'=>'client presentation image, flattering and realistic','editorial'=>'magazine editorial image, sophisticated and authored']
  ];
  $parts=[]; foreach($allowed as $k=>$opts){$v=(string)($raw[$k]??''); if(isset($opts[$v]))$parts[]=$opts[$v];}
  return implode(', ',$parts);
}

try {
  $key = secret_key(); if ($key==='') out(503,['error'=>'magnific_key_missing']);
  $body = json_decode(file_get_contents('php://input') ?: '{}', true); if (!is_array($body)) $body=[];
  $garmentId = clip($body['garmentId'] ?? '',160); $context = clip($body['context'] ?? 'atelier',32); $promptBase = clip($body['prompt'] ?? '',3200);
  $allowed=['atelier','cliente','book','shooting','ateliergram','editorial']; if (!in_array($context,$allowed,true)) $context='atelier';
  if ($garmentId==='') out(400,['error'=>'garment_id_required']); if ($promptBase==='') out(400,['error'=>'prompt_required']);
  $contextPrompt=[
    'atelier'=>'neutral couture atelier presentation, full garment clearly visible, restrained background',
    'cliente'=>'realistic fitting-room presentation, one adult model wearing the exact garment, natural posture, garment fully readable',
    'book'=>'luxury fashion portfolio image, editorial but faithful, full silhouette readable',
    'shooting'=>'high-end fashion editorial photograph, deliberate lighting, full silhouette readable',
    'ateliergram'=>'premium fashion social editorial photograph, natural luxury, full garment readable',
    'editorial'=>'high-end fashion editorial photograph, sophisticated but not theatrical'
  ][$context];
  $studio = direction_prompt($body['direction'] ?? null);
  $hard='ONE adult fashion model only. Show ONE garment/look only. Photorealistic fashion photography, not illustration, not sketch, not 3D. Preserve exactly the described garment type, silhouette, length, volume, construction, materials, colors and details. Do not invent extra garments, coats, blazers, bags, logos, text, patterns or embellishments. The clothing must remain the same design across future contexts.';
  $prompt=clip($promptBase.'. '.$contextPrompt.($studio!==''?'. PHOTO DIRECTION: '.$studio:'').'. '.$hard,4200);
  $seed=(int)($body['seed'] ?? abs(crc32($garmentId)));
  $payload=['prompt'=>$prompt,'negative_prompt'=>'illustration, sketch, drawing, painting, 3d render, mannequin lineup, multiple people, multiple outfits, collage, text, watermark, logo, extra coat, extra blazer, extra bag','guidance_scale'=>3,'seed'=>$seed,'num_images'=>1,'image'=>['size'=>'portrait_2_3'],'filter_nsfw'=>true];
  $j=curl_json('https://api.magnific.com/v1/ai/text-to-image',['Content-Type: application/json','Accept: application/json','x-magnific-api-key: '.$key],$payload);
  $item = is_array($j['data'] ?? null) ? ($j['data'][0] ?? []) : [];
  $src = (string)($item['url'] ?? ''); if ($src==='' && !empty($item['base64'])) $src='data:image/png;base64,'.$item['base64'];
  if ($src==='') throw new RuntimeException('generated_image_missing');
  $url=persist_image($garmentId,$context,$src);
  out(200,['ok'=>true,'garmentId'=>$garmentId,'context'=>$context,'url'=>$url,'provider'=>'magnific','model'=>'text-to-image','seed'=>$seed,'promptVersion'=>3,'direction'=>$body['direction']??null,'generatedAt'=>gmdate('c'),'stored'=>'infomaniak']);
} catch (Throwable $e) {
  error_log('[HC garment visual] '.$e->getMessage());
  out(500,['error'=>'garment_visual_generation_failed','detail'=>$e->getMessage()]);
}
