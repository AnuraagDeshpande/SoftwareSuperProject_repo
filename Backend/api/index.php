<?php
  header("Access-Control-Allow-Origin: *");
  header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
  header("Access-Control-Allow-Headers: Content-Type, Authorization");
  
  // For preflight requests
  if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
      http_response_code(200);
      exit();
  }
  
  require_once('../init.php');


  // Capture request info

  //parse_url (analyzed string, component being analyzed)
  $request = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
  $method = $_SERVER['REQUEST_METHOD'];

  
  //removes folder path prefix so routing can focus on the important part
  //essentially, we don't care about what comes before /api in the url so we strip it
  //Once the beginning of the url is stripped it can be matched to the requested route

  $basePath = '/SE_REPO/SoftwareSuperProject_repo/Backend/api';
  $endpoint = str_replace($basePath, '', $request);

  //In the end we get an endpoint like "/users" in the variable

  // Routing logic (switch (true) switches based on if the case returns true or not)
  // Using switch (true) instead of switch ($endpoint) because we don't want to only check for exact matches
  // Avoids a bunch of nonsense

  switch (true) {
    case preg_match('#^/users#', $endpoint):
      require_once('routes/users.php');
      break;
    case preg_match('#^/projects#', $endpoint):
      require_once('routes/projects.php');
      break;
    case preg_match('#^/tasks#', $endpoint):
      require_once('routes/tasks.php');
      break;
    default:
      http_response_code(404);
      echo json_encode(['error' => 'Route not found']);
}

