#!/bin/bash
cd ~/desktop/verybuy-native
git checkout $2
yarn

if [ "$1" = "app/ios" ]
then
	echo "Run app ios e2e"
	cd ios
	pod install
	cd ../
    npx detox build -c ios.sim.debug
	npx detox test -c ios.sim.debug --record-videos failing --take-screenshots failing --cleanup
elif [ "$1" = "app/android" ]
then
    echo "Run app android e2e"
	npx detox build -c android.emu.debug
	npx detox test -c android.emu.debug --record-videos failing --take-screenshots failing --cleanup
elif [ "$1" = "web" ]
then
    echo "Run web e2e"
fi
