#!/bin/bash

jest --clearCache
if [ -n "$1" ]; then
   jest --watch "$1" # run single test if argument is provided
else
   jest --watchAll # otherwise full test suite
fi