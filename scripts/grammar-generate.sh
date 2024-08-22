#!/bin/bash

cd ./grammar/kel
java -jar ../antlr-4.13.2-complete.jar -Dlanguage=JavaScript -o ../../src/grammar/kel -visitor -Xexact-output-dir ./*.g4
cd ../..

cd ./grammar/salt
java -jar ../antlr-4.13.2-complete.jar -Dlanguage=JavaScript -o ../../src/grammar/salt -visitor -Xexact-output-dir  ./*.g4
cd ../..

# cd ./grammar/dude
# java -jar ../antlr-4.10.1-complete.jar -Dlanguage=JavaScript -o ../../src/grammar/dude -visitor -Xexact-output-dir ./*.g4
# cd ../..

# cd ./grammar/trixe
# java -jar ../antlr-4.10.1-complete.jar -Dlanguage=JavaScript -o ../../src/grammar/trixe -visitor -Xexact-output-dir ./*.g4
# cd ../..
