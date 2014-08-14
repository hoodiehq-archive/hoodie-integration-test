export DISPLAY=:99.0
sh -e /etc/init.d/xvfb start
wget http://selenium-release.storage.googleapis.com/2.41/selenium-server-standalone-2.41.0.jar
java -jar selenium-server-standalone-2.41.0.jar &> /dev/null &
