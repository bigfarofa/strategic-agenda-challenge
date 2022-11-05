<?php
include_once __DIR__ . "./STAgendaAPIAuth.php";
interface STAgendaCredentialsRequestInjector {
  public function get_api_auth();
}



class STAgendaCredentialsRequestInjectorCurl implements STAgendaCredentialsRequestInjector {
  public $auth_api;
  public function __construct(){
    $this->auth_api = new STAgendaAPIAuthNoAuth();
  }

  public function get_api_auth(){
    return $this->auth_api;
  }

  public function inject($curl){
    return;
  }
}

?>