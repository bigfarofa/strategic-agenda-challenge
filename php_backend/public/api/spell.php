<?php

require_once __DIR__ . "/../../strategic_agenda_api/st_agenda_api_wrapper/STAgendaAPISpell.php";
require_once __DIR__ . "/../../utils/cors.php";


//cors();



$http_origin = $_SERVER['REMOTE_ADDR'];
var_dump($http_origin);
var_dump($_SERVER);
$allowed_domains = array(
  '127.0.0.1',
  'localhost',
);

if (in_array($http_origin, $allowed_domains)) {  
  header("Access-Control-Allow-Origin: http://$http_origin:3000");

  header("Access-Control-Allow-Headers: *");
  header("Access-Control-Allow-Methods: *");
}


// Access-Control headers are received during OPTIONS requests

$method = $_SERVER['REQUEST_METHOD'];
var_dump($method);
if ($method == "POST") {
  $text = $_POST["text"];
  $lang = $_POST["lang"];
  $spellData = new SpellPostRequestData($text, $lang);
  $apiSpellEndpoint = new STAgendaAPISpell();

  $response = $apiSpellEndpoint->post_spell($spellData);
  echo json_encode($response);
  
} else if($method == "OPTIONS") {
  //http_response_code(200);
} else {
  http_response_code(404);
}