<?php
  //Config file I recommend using for backend SQL connectionsl,
  //so during testing no one has to change the config for every file
  defined('DB_HOST') ? null : define('DB_HOST', 'localhost');
  defined('DB_USER') ? null : define('DB_USER', 'root');
  defined('DB_PASS') ? null : define('DB_PASS', '');
  defined('DB_NAME') ? null : define('DB_NAME', 'project_management');

  defined('APP_NAME') ? null : define('APP_NAME', 'PMSoftware');

  mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);


?>