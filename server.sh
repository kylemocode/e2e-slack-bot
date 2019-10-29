#!/bin/bash
cd ~/desktop/verybuy-native
git checkout $2
yarn
cd ios
pod install
cd ../
if [ "$1" = "app" ]
then
	echo "Run app e2e"
    npx detox build -c ios.sim.debug
	npx detox test -c ios.sim.debug  e2e/scenarios/login/shoppingCart/categoryProducts/categoryAddToCart
elif [ "$1" = "web" ]
then
    echo "Run web e2e"
fi
