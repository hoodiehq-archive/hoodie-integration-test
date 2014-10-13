export DISPLAY=:99.0
sh -e /etc/init.d/xvfb start
wget http://selenium-release.storage.googleapis.com/2.43/selenium-server-standalone-2.43.1.jar
java -jar selenium-server-standalone-2.43.1.jar &> /dev/null &
