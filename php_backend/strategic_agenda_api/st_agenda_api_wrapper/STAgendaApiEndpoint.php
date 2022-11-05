<?php

require_once __DIR__ . "../../STAgendaCredentialsInjector.php";

class STAgendaAPIEndpoint {
  public $injector;

  public function __construct(){
    $this->set_injector(new STAgendaCredentialsRequestInjectorCurl());
  }

  public function set_injector($injector){
    $this->injector = $injector;
  }

  public function api_config(){
    return $this->injector->get_api_auth()->api_config;
  }

  public function  api_endpoint(){
    return $this->api_config()->api_endpoint();
  }

}



?>