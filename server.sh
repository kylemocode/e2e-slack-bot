#!/bin/bash
cd ~/desktop/verybuy-native
git checkout $2

if [ "$1" = "app" ]
then
	echo "Run app e2e"
    npx detox build -c ios.sim.debug
	npx detox test -c ios.sim.debug 
elif [ "$1" = "web" ]
then
    echo "Run web e2e"
fi
