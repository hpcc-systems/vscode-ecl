r := RECORD
    UNSIGNED4 id;
    VARSTRING name;
    VARSTRING nationality;
    VARSTRING sex;
    VARSTRING date_of_birth;
    REAL height;
    REAL weight;
    VARSTRING sport;
    UNSIGNED4 gold;
    UNSIGNED4 silver;
    UNSIGNED4 bronze;
    VARSTRING info;
END;

d := DATASET('~::athletes.csv', r, CSV);

d2 := d(date_of_birth != 'date_of_birth');

OUTPUT(d2, NAMED('athletes'), ALL);