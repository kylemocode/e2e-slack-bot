#!/bin/bash
cd ~/desktop/verybuy-native
git checkout $2
BUILD_SUCCESS="false"
TEST_SUCCESS="false"
if [ "$1" = "app" ]
then
	echo "Run app e2e"
    npx detox build -c ios.sim.debug && BUILD_SUCCESS="true"
	npx detox test -c ios.sim.debug e2e/scenarios/login/shoppingCart/categoryProducts/categoryBuyIt && TEST_SUCCESS="true"
elif [ "$1" = "web" ]
then
    echo "Run web e2e"
fi

if ["$BUILD_SUCCESS" -eq "true" -a "$TEST_SUCCESS" -eq "true"]
then
	exit 0
elif ["$BUILD_SUCCESS" -eq "true" -a "$TEST_SUCCESS" -eq "false"]
then
	exit 1 #test fail
else ["$BUILD_SUCCESS" -eq "false"]
then
	exit 2 #build fail

fi