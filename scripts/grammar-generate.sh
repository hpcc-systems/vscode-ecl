#!/bin/bash

cd ./grammar/kel
antlr4 -Dlanguage=JavaScript -o ../../src/grammar/kel -visitor -Xexact-output-dir ./*.g4
cd ../..

cd ./grammar/salt
antlr4 -Dlanguage=JavaScript -o ../../src/grammar/salt -visitor -Xexact-output-dir ./*.g4
cd ../..

cd ./grammar/dude
antlr4 -Dlanguage=JavaScript -o ../../src/grammar/dude -visitor -Xexact-output-dir ./*.g4
cd ../..

cd ./grammar/trixe
antlr4 -Dlanguage=JavaScript -o ../../src/grammar/trixe -visitor -Xexact-output-dir ./*.g4
cd ../..
