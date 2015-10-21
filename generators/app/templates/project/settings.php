<?php

$databases = array();
$databases['default']['default'] = array(
  'driver' => 'mysql',
  'host' => 'mysql',
  'username' => 'mysql',
  'password' => 'mysql',
  'database' => 'data',
  'prefix' => '',
);

$conf['securepages_enable'] = FALSE;

$conf['file_public_path'] = 'sites/default/files';
$conf['file_private_path'] = 'sites/default/files/private';
$conf['file_temporary_path'] = '/tmp';
$conf['cache'] = '0';
$conf['preprocess_css'] = '0';
$conf['preprocess_js'] = '0';

// Disable cron!
$conf['cron_safe_threshold'] = 0;
$conf['mail_system'] = array(
  'default-system' => 'DevelMailLog',
);

$conf['theme_debug'] = TRUE;

// If the site is bootstrapped via drush and docker available.
if (!empty($_SERVER['DOCKER_HOST'])) {
  preg_match('([\w]+\.boi)', getcwd(), $matches);
  if (empty($matches[0])) {
    print "Unable to set mysql port for drush commands. Check settings.php!\n";
  }
  $project = $matches[0];
  $name = str_replace('.', '', $project);
  $cmd = "/usr/local/bin/docker port " . $name . "_mysql_1 3306 | grep -Eo '\d+$'";
  $port = trim(shell_exec($cmd));
  // Database configuration.
  $databases['default']['default'] = array(
    'driver' => 'mysql',
    'host' => 'db.boi',
    'port' => $port,
    'username' => 'mysql',
    'password' => 'mysql',
    'database' => 'data',
    'prefix' => '',
  );
}