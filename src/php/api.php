<?php
require_once './simple_html_dom.php';
require_once "./phpQuery-onefile.php";
header('Content-Type: application/json');

$query = $_GET;
$data = [];

$keyword = $query['keyword'];
$ymd = $query['ymd'];
$place = $query['place'];
$start = $query['start'];

$content = http_build_query([]);
$content_length = strlen($content);
$options = array('http' => array(
    'method' => 'GET',
    'header' => "Content-Type: application/x-www-form-urlencoded\r\n"
        . "Content-Length: $content_length",
    'content' => $content));

$resultData = file_get_contents(
    'http://api.atnd.org/events/?keyword=' . $keyword.','. $place .'&ymd='.$ymd .'&format=jsonp&count=9&start='.$start,
    false, stream_context_create($options));

$result = preg_replace('/callback/', '', $resultData);

$imgList=[];

foreach(json_decode(substr($result, 1, strlen($result)-3)) as $d){

    foreach($d as $dd) {

        $doc = phpQuery::newDocumentFile($dd->event->event_url);

        foreach ($doc["#events"]->find("#events-show") as $entry){
            $h1 = pq($entry)->find('.events-show-img')->html();
            $data=pq($h1)->attr('data-original');
            if(!empty($data)){
                $imgList[]='https://atnd.org'.$data;
            }else{
                $imgList[]='https://atnd.org/images/bg/o384.jpg';
            }
        }
    }
}


$result = preg_replace('/callback/', '', $resultData);
$temp = json_decode(substr($result, 1, strlen($result)-3));


$count = 0;
foreach($temp->events as $d){

    $d->event->img=$imgList[$count];
    $count++;
}


//echo $_GET['callback'] . preg_replace('/callback/', '', $temp);
echo $_GET['callback'] . '('.json_encode($temp).')';


