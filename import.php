<?php
$filecontent = file_get_contents($argv[1]);
$lines = explode("\r", $filecontent);
$data = array();
$tempdata = array();

function number_da_parse($number) {
  $number = str_replace(',', '.', $number);
  return (float) $number;
}

foreach ($lines as $line) {
  $arr = explode(';', $line);
  if (is_numeric($arr[2])) {
    $tempdata[$arr[2]] = array(
      'short' => number_da_parse($arr[3]),
      'long' => number_da_parse($arr[4]),
    );
    if (is_numeric($arr[1])) {
      $data[$arr[1]] = $tempdata;
      $tempdata = array();
    }
  }
}
$json = json_encode($data, JSON_NUMERIC_CHECK + JSON_FORCE_OBJECT);
file_put_contents($argv[2], $json);
