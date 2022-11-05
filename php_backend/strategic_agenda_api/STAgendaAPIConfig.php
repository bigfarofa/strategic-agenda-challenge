
<?php

class STAgendaAPIConfig {
  public $hostname = "";
  public function api_endpoint(){
    return $this->hostname . "/api";
  }
}

class STAgendaAPIConfigDefault extends STAgendaAPIConfig {
  public function __construct(){
    $this->hostname = "http://35.197.120.214:5000";
  }
}

class STAgendaAPIConfigDefaultSingleton {

  public static $api_config;

  static function get_api_config(){
    if (is_null(STAgendaAPIConfigDefaultSingleton::$api_config)) {
      STAgendaAPIConfigDefaultSingleton::$api_config = new STAgendaAPIConfigDefault();
    }
    return STAgendaAPIConfigDefaultSingleton::$api_config;
  }
}

?>