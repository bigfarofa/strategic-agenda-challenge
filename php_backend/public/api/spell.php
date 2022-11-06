<?php

require_once __DIR__ . "/../../strategic_agenda_api/st_agenda_api_wrapper/STAgendaAPISpell.php";
require_once __DIR__ . "/../../utils/cors.php";


cors();

// Access-Control headers are received during OPTIONS requests

$method = $_SERVER['REQUEST_METHOD'];

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