#!/bin/bash

cd ./grammar/ecl
java -jar ../antlr-4.10.1-complete.jar -Dlanguage=JavaScript -o ../../src/grammar/ecl -visitor -Xexact-output-dir ./*.g4
cd ../..

cd ./grammar/kel
if ls *.g4 >/dev/null 2>&1; then
    java -jar ../antlr-4.10.1-complete.jar -Dlanguage=JavaScript -o ../../src/grammar/kel -visitor -Xexact-output-dir ./*.g4
fi
cd ../..

cd ./grammar/salt

if ls *.g4 >/dev/null 2>&1; then
    java -jar ../antlr-4.10.1-complete.jar -Dlanguage=JavaScript -o ../../src/grammar/salt -visitor -Xexact-output-dir ./*.g4
fi
cd ../..

# cd ./grammar/dude
# java -jar ../antlr-4.10.1-complete.jar -Dlanguage=JavaScript -o ../../src/grammar/dude -visitor -Xexact-output-dir ./*.g4
# cd ../..

# cd ./grammar/trixe
# java -jar ../antlr-4.10.1-complete.jar -Dlanguage=JavaScript -o ../../src/grammar/trixe -visitor -Xexact-output-dir ./*.g4
# cd ../..
