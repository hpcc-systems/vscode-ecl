#!/bin/bash

ANTLR_VER=4.13.1

cd ./grammar/ecl
java -jar ../antlr-${ANTLR_VER}-complete.jar -Dlanguage=TypeScript -o ../../src/grammar/ecl -visitor -Xexact-output-dir ./*.g4
cd ../..

cd ./grammar/kel
if ls *.g4 >/dev/null 2>&1; then
    java -jar ../antlr-${ANTLR_VER}-complete.jar -Dlanguage=TypeScript -o ../../src/grammar/kel -visitor -Xexact-output-dir ./*.g4
fi
cd ../..

cd ./grammar/salt

if ls *.g4 >/dev/null 2>&1; then
    java -jar ../antlr-${ANTLR_VER}-complete.jar -Dlanguage=TypeScript -o ../../src/grammar/salt -visitor -Xexact-output-dir ./*.g4
fi
cd ../..

# cd ./grammar/dude
# java -jar ../antlr-${ANTLR_VER}-complete.jar -Dlanguage=TypeScript -o ../../src/grammar/dude -visitor -Xexact-output-dir ./*.g4
# cd ../..

# cd ./grammar/trixe
# java -jar ../antlr-${ANTLR_VER}-complete.jar -Dlanguage=TypeScript -o ../../src/grammar/trixe -visitor -Xexact-output-dir ./*.g4
# cd ../..
