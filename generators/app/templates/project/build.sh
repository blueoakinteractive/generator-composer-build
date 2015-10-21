#!/bin/bash

MAKEFILE="project.make"
DRUSH_OPTS='--concurrency=16'
WORKING_PATH=`cd "$CALLPATH"; pwd -P`
PROJECT_PATH="${WORKING_PATH%\/*}"
TMP_PATH="$PROJECT_PATH/tmp"
BUILD_PATH="$PROJECT_PATH/www"

echo '=============================================='
echo '         Building Drupal Installation         '
echo '=============================================='

set -e

if [ $BUILD_PATH ]; then
  rm -Rf $BUILD_PATH
fi

if [ $TMP_PATH ]; then
  rm -Rf $TMP_PATH
fi

drush make $DRUSH_OPTS "$WORKING_PATH/$MAKEFILE" $TMP_PATH
rsync -vrq --delete --exclude-from=$WORKING_PATH/rsync.exclude $TMP_PATH/ $BUILD_PATH/

echo 'Drupal Installation built'

echo '=============================================='
echo '              Creating Symlinks              '
echo '=============================================='

# Create symlinks
if [ ! -L "$BUILD_PATH/sites/default/files" ]; then
  ln -s ../../../project/files ../www/sites/default/files
fi

if [ ! -L "$BUILD_PATH/sites/default/libraries" ]; then
  ln -s ../../../project/libraries ../www/sites/default/libraries
fi

if [ ! -L "$BUILD_PATH/sites/default/modules" ]; then
  ln -s ../../../project/modules ../www/sites/default/modules
fi

if [ ! -L "$BUILD_PATH/sites/default/themes" ]; then
  ln -s ../../../project/themes ../www/sites/default/themes
fi

echo 'Symlinks created'

echo '=============================================='
echo '             Copying settings.php             '
echo '=============================================='

# Copy settings.php
if [ ! -L "$BUILD_PATH/sites/default/settings.php" ]; then
  cp ./settings.php ../www/sites/default/settings.php
fi

echo 'settings.php copied'

echo '=============================================='
echo '                   Clean Up                   '
echo '=============================================='

rm -Rf $TMP_PATH
cd $BUILD_PATH
drush rr
drush updatedb -y
drush cc all

set +e

echo 'Clean up complete'

echo '=============================================='
echo '            Project Build Complete            '
echo '=============================================='
