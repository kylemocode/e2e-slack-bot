#!/bin/bash
cd ./error-log
mkdir $1
python -m SimpleHTTPServer
# if [ -d "./$1" ] 
# then
#     echo "branch folder exist"
# else
#     makir $1
#     echo "make branch folder"
# fi


