<?php




class MySQLHandler {
  public static $db;
  public static function get_connection(){
    $config = parse_ini_file(__DIR__ . "/db.ini");
    $database = $config["database"];
    
    $link = mysqli_connect($config["address"], $config["user"], $config["password"]);
      
    return $link;
  }

  public static function build_database(){
    $db = MySQLHandler::get_connection();
    $config = parse_ini_file(__DIR__ . "/db.ini");
    $database = $config["database"];
    var_dump($database);
    
    $stmt = $db->prepare("CREATE DATABASE  IF NOT EXISTS test_lucas_gomes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    if (!$stmt) {
      var_dump($db->error);
      exit(1);
    }
    $stmt->execute();
    $stmt->close();
    $db->select_db($database);
    $stmt = $db->prepare('CREATE TABLE IF NOT EXISTS users (user_id INT PRIMARY KEY)');
    if (!$stmt) {
      echo "1";
      var_dump($db->error);
      exit(1);
    }
    $stmt->execute();
    $stmt->close();
    $stmt = $db->prepare('CREATE TABLE IF NOT EXISTS users_session_ids (
      session_id VARCHAR(512),
      user_id INT,
      PRIMARY KEY (session_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE    
    )');
    if (!$stmt) {
      echo "2";
      var_dump($db->error);
      exit(1);
    }
    $stmt->execute();
    $stmt->close();
    $stmt = $db->prepare('CREATE TABLE IF NOT EXISTS user_dictionary (
      user_dict_id INT,
      user_id INT,
      word VARCHAR(63),
      lang VARCHAR(20),
      PRIMARY KEY(user_dict_id),
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    )');
    if (!$stmt) {
      echo "3";
      var_dump($db->error);
      exit(1);
    }
    $stmt->execute();
    $stmt->close();
    $db->close();
  }

  public static function execute_select_stmt($query, $params, $arr){
    $db = MySQLHandler::get_connection();
    $stmt = $db->prepare($query);
    call_user_func_array($stmt->bind_param, $params);
    if ($stmt) {
      $stmt->execute();
      $result = $stmt->get_result();
      $result->fetch_all(MYSQLI_ASSOC)
      $stmt->close();
      return $result;
    } else {
      throw new Exception($db->error);
    }
    $db->close();
    
  }

  public static function execute_stmt($query, $params, $arr){
    $db = MySQLHandler::get_connection();
    $stmt = $db->prepare($query);
    call_user_func_array($stmt->bind_param, $params);
    if ($stmt) {
      $stmt->execute();
      $stmt->close();
      return $result;
    } else {
      throw new Exception($db->error);
    }
    $db->close();
    
  }

}


