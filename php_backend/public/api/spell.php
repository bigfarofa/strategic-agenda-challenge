<?php

require_once __DIR__ . "/../../strategic_agenda_api/st_agenda_api_wrapper/STAgendaAPISpell.php";


$method = $_SERVER['REQUEST_METHOD'];

if ($method === "POST") {
  $text = $_POST["text"];
  $lang = $_POST["lang"];
  $spellData = new SpellPostRequestData($text, $lang);
  $apiSpellEndpoint = new STAgendaAPISpell();

  $response = $apiSpellEndpoint->post_spell($spellData);
  echo json_encode($response);
  
} else {
  http_response_code(400);
}