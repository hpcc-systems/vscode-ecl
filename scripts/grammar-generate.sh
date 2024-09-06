#!/bin/bash

# Latest Antlr 4.x:  https://www.antlr.org/download.html
# Latest Kel Grammar:  https://github.com/LexisNexis-RBA/Tardis/blob/master/kel-top/tools/kel-intellij-plugin/src/main/antlr/org/hpccsystems/intellij/language/plugin/parser/KELLexer.g4
# Latest Salt Grammar: https://github.com/LexisNexis-RBA/Tardis/blob/master/SALT/src/main/java/com/relx/rba/tardis/salt/antlr/Salt.g4 

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
