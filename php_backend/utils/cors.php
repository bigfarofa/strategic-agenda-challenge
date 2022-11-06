
<?php
/**
 *  An example CORS-compliant method.  It will allow any GET, POST, or OPTIONS requests from any
 *  origin.
 *
 *  In a production environment, you probably want to be more restrictive, but this gives you
 *  the general idea of what is involved.  For the nitty-gritty low-down, read:
 *
 *  - https://developer.mozilla.org/en/HTTP_access_control
 *  - https://fetch.spec.whatwg.org/#http-cors-protocol
 *
 */
function cors() {
    
    // Allow from any origin
    if (isset($_SERVER['HTTP_ORIGIN'])) {
        // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
        // you want to allow, and if so:
        header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Max-Age: 86400');    // cache for 1 day
    } else if(isset($_SERVER["REMOTE_ADDR"])) {
      $is_https = isset($_SERVER["HTTPS"]);
      $httpStr = $is_https ? "https://" : "http://";
      $origin = $httpStr . $_SERVER["REMOTE_ADDR"] . ":" . $_SERVER["REMOTE_PORT"];
      header("Access-Control-Allow-Origin: $origin");
      header('Access-Control-Allow-Credentials: true');
      header('Access-Control-Max-Age: 10');
      header("Access-Control-Allow-Headers: *");
      header("Access-Control-Allow-Methods: *");
    }
    
    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
          // may also be using PUT, PATCH, HEAD etc
          //header("HTTP/1.1 200 OK");
          header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, PATCH, OPTIONS");
        }
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
          header("Access-Control-Allow-Headers: *");
        }
    
        exit(0);
    }
    
    echo "You have CORS!";
}