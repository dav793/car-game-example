#!/bin/sh

# check if a directory exists. 
# return 0 if exists, 1 otherwise.
#
# command line args:
#   -p path to dir
#
# example:
#   /> ./check-node-modules.sh -p client/node_modules
#

# extract arguments
while getopts "p:" option
do
    case "${option}" in
        p) DIR_PATH=${OPTARG};;
    esac
done

# check arguments
if [ $# -eq 0 ]
then
    echo "error: no arguments supplied"
    exit 1
fi

if [ -d $DIR_PATH ]
then
    echo 0
else
    echo 1
fi

exit 0;