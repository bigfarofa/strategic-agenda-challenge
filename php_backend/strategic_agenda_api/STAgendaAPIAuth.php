
<?php
include_once __DIR__ . "./STAgendaAPIConfig.php";

class STAgendaAPIAuth {
  public $api_config;
  public function __construct(){
    $this->api_config = STAgendaAPIConfigDefaultSingleton::get_api_config();
  }
  public function authenticate(){
    return;
  }
}

class STAgendaAPIAuthNoAuth extends STAgendaAPIAuth {

  public function __construct(){
    parent::__construct();
  }
  public function authenticate(){
    return;
  }
}

?>