<?php
include_once __DIR__ . "../STAgendaAPIEndpoint.php";



class SpellPostRequestData {
  public $text;
  public $lang;

  public function __construct($text, $lang){
    $this->text = $text;
    $this->lang = $lang;
  }

  public function to_post_fields(){
    return array('text' => $this->text,'lang' => $this->lang);
  }
}
class STAgendaAPISpell extends STAgendaAPIEndpoint {

  public function __construct(){
    parent::__construct();
  }

  public function post_spell(SpellPostRequestData $data){
    $spellUrl = $this->api_endpoint() . "/v1/spell";
    $curl = curl_init();
    curl_setopt_array($curl, array(
      CURLOPT_URL => $spellUrl,
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => '',
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 0,
      CURLOPT_FOLLOWLOCATION => true,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => 'POST',
      CURLOPT_POSTFIELDS => $data->to_post_fields(),
    ));

    $this->injector->inject($curl);
    
    $response = curl_exec($curl);

    curl_close($curl);
    return $response;
  }
}


?>