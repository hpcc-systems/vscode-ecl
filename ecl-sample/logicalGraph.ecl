#OPTION('generateLogicalGraph', TRUE);

OutLayout := {UNSIGNED v_min};

LOADXML('<xml/>');

ExpTest(d) := FUNCTIONMACRO
    #EXPORTXML(inFileFields, RECORDOF(d));
    #FOR(inFileFields)
        #FOR(field)
            #UNIQUENAME(uniqueData)
            %uniqueData% := TABLE(d, {%@name%}, %@name%, MERGE);
            LOCAL #EXPAND('field_' + %'@name'% + '_min') := MIN(%uniqueData%, %@name%);
        #END
    #END
    RETURN DATASET
        (
            [
                {
                    #FOR(inFileFields)
                        #FOR(field)
                            #EXPAND('field_' + %'@name'% + '_min')
                        #END
                    #END
                }
            ],
            OutLayout
        );
ENDMACRO;

ds := DATASET('~foo', {UNSIGNED n}, FLAT, OPT);
r := ExpTest(ds);
OUTPUT(r, NAMED('r'));