<?php




class SQLiteHandler {
  public static $database_dir = __DIR__ . 'test_database.db';
  public static $db;
  public static function get_connection(){

    if (is_null(SQLiteHandler::$db)) {
      SQLiteHandler::$db = new SQLite3($database_dir);
    }
    return SQLiteHandler::$db;
  }

  public static function build_tables(){
    $db = SQLiteHandler::get_connection();
    $db->exec('CREATE IF NOT EXISTS TABLE dictionary (id INTEGER PRIMARY KEY, session_id STRING)');
  }

  public static function generate_stmt($query){
    $db = SQLiteHandler::get_connection();
    return $db->prepare($query);
  }

}


