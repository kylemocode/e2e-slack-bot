#!/bin/bash
cd ~/desktop/verybuy-native
git checkout $2
yarn
cd ios
pod install
cd ../
if [ "$1" = "app/ios" ]
then
	echo "Run app ios e2e"
    npx detox build -c ios.sim.debug
	npx detox test -c ios.sim.debug
elif [ "$1" = "app/android" ]
then
    echo "Run app android e2e"
	npx detox build -c android.emu.debug
	npx detox test -c android.emu.debug
elif [ "$1" = "web" ]
then
    echo "Run web e2e"
fi
