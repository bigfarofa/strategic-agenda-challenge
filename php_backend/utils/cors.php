
<?php
/**
 *  Code based on this StackOverflow answer: https://stackoverflow.com/a/9866124/6249019
 * 
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
    

    $enableAccessControl = function ($origin) {
      header("Access-Control-Allow-Origin: {$origin}");
      header('Access-Control-Allow-Credentials: true');
      header('Access-Control-Max-Age: 60');    // cache for 1 minute  
    };
    

    $allowedOrigins = array("http://localhost:3000");

    $enableAccessControlWithCheck = function($origin) use (&$allowedOrigins, $enableAccessControl){
      if (in_array($origin, $allowedOrigins) ) {
        $enableAccessControl($origin);
      }
    };

    if (isset($_SERVER['HTTP_ORIGIN'])) {
        // Decide if the origin in $_SERVER['HTTP_ORIGIN'] is one
        // you want to allow, and if so:
        $enableAccessControlWithCheck($_SERVER['HTTP_ORIGIN']);
    } else if(isset($_SERVER["SERVER_NAME"])) {
      $is_https = isset($_SERVER["HTTPS"]);
      $httpStr = $is_https ? "https://" : "http://";
      $origin = $httpStr . $_SERVER["SERVER_NAME"] . ":" . "3000";


      $enableAccessControlWithCheck($origin);
    }
    
    // Access-Control headers are received during OPTIONS requests
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'])) {
          // may also be using PUT, PATCH, HEAD etc
          header("Access-Control-Allow-Methods: POST, GET, PUT, DELETE, PATCH, OPTIONS");
        }
        
        if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
          header("Access-Control-Allow-Headers: *");
        }
    }
}