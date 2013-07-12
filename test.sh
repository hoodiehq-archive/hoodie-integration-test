#!/bin/sh -e

MAIN_STATUS=`curl -s http://127.0.0.1:6001 -w "\n%{http_code}\n" | tail -1`
MAIN_OK=$?

API_STATUS=`curl -s http://127.0.0.1:6001/_api -w "\n%{http_code}\n" | tail -1`
API_OK=$?

ADMIN_STATUS=`curl -s http://127.0.0.1:6002 -w "\n%{http_code}\n" | tail -1`
ADMIN_OK=$?

COUCH_STATUS=`curl -s http://127.0.0.1:6003 -w "\n%{http_code}\n" | tail -1`
COUCH_OK=$?

if [ $MAIN_OK -ne 0 ]; then
  echo "MAIN EXIT STATUS NOT 0"
  exit 1
fi

if [ "$MAIN_STATUS" != "200" ]; then 
  echo "MAIN HTTP STATUS NOT 200"
  exit 2
fi


if [ $API_OK -ne 0 ]; then
  echo "API EXIT STATUS NOT 0"
  exit 3
fi

if [ "$API_STATUS" != "200" ]; then 
  echo "API HTTP STATUS NOT 200"
  exit 4
fi


if [ $ADMIN_OK -ne 0 ]; then
  echo "ADMIN EXIT STATUS NOT 0"
  exit 5
fi

if [ "$ADMIN_STATUS" != "200" ]; then 
  echo "ADMIN HTTP STATUS NOT 200"
  exit 6
fi


if [ $COUCH_OK -ne 0 ]; then
  echo "COUCH EXIT STATUS NOT 0"
  exit 7
fi

if [ "$COUCH_STATUS" != "200" ]; then 
  echo "COUCH HTTP STATUS NOT 200"
  exit 8
fi

echo "All Good! :)"
